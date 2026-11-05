// Nikke Library — monsters (one page per monster model, its variants inside).
const Monsters = (() => {
  const m = {
    list: null,
    generation: store.get('monGeneration', 'All'), // 'All' | 'Rapture' | 'Dark Matter' (MonsterModelTable.monster_generation)
    scope: store.get('monScope', 'variant'), // "Appears in": 'variant' (the one picked) | 'all' (every variant of the model)
    cls: store.get('monClass', 'All'), // in-game class (Husk … Queen); a model matches if any variant has it
    current: null,
    variant: null,
  };
  const href = (id, variant) => `#/monster/${id}${variant ? `/${variant}` : ''}`;
  const GRADES = ['Boss', 'Centurion', 'Elite', 'Minion', 'Thrash'];
  const GENERATIONS = ['Rapture', 'Dark Matter'];
  const CLASSES = ['Husk', 'Servant', 'Master', 'Exceed', 'Lord', 'Tyrant', 'Heretic', 'Queen'];
  const KIND_LABEL = { campaign: 'Campaign', tower: 'Towers', raid: 'Raids', event: 'Events', other: 'Other' };
  const gradeClass = (g) => `grade-${String(g || '').toLowerCase()}`;
  const elemDot = (e) => `<span class="elem elem-${esc(e.toLowerCase())}" title="${esc(e)}"></span>`;
  const pct = (r) => fmtPct(r / 100, 2); // ratios are in 1/10000
  const elems = (list) => list.map((e) => `${elemDot(e)} ${esc(e)}`).join(', ') || '—';

  async function enter() {
    if (!m.list) m.list = await (await apiFetch('/api/monsters')).json();
    renderTabs();
    renderTree();
  }

  const byGeneration = (x, g = m.generation) => g === 'All' || x.generation === g;
  const byClass = (x, c = m.cls) => c === 'All' || x.classes.includes(c);

  // Generation tabs, then a class row; each count follows the other filter.
  function renderTabs() {
    $('#cat-tabs').innerHTML = ['All', ...GENERATIONS].map((g) => {
      const n = m.list.filter((x) => byGeneration(x, g) && byClass(x)).length;
      return `<button class="cat-tab ${m.generation === g ? 'active' : ''}" data-gen="${g}">${g}<span class="n">${n}</span></button>`;
    }).join('') + `<div class="mode-row wrap">${['All', ...CLASSES].map((c) => {
      const n = m.list.filter((x) => byGeneration(x) && byClass(x, c)).length;
      return `<button class="mode-chip ${m.cls === c ? 'active' : ''}" data-cls="${c}">${c === 'All' ? 'All classes' : c} <span class="key">${n}</span></button>`;
    }).join('')}</div>`;
    $('#cat-tabs').querySelectorAll('[data-gen]').forEach((b) => b.onclick = () => setFilter('generation', b.dataset.gen));
    $('#cat-tabs').querySelectorAll('[data-cls]').forEach((b) => b.onclick = () => setFilter('cls', b.dataset.cls));
  }

  function setFilter(key, value) {
    m[key] = value;
    store.set(key === 'cls' ? 'monClass' : 'monGeneration', value);
    renderTabs();
    renderTree();
    if (!m.current) overview();
  }

  // The same two filters as selects on the landing page, for phones (the sidebar is folded there).
  function filterBar() {
    const sel = (key, all, values) => `<select class="mon-select" data-filter="${key}">${['All', ...values].map((v) =>
      `<option value="${esc(v)}" ${m[key] === v ? 'selected' : ''}>${esc(v === 'All' ? all : v)}</option>`).join('')}</select>`;
    return `<div class="mon-filters">${sel('generation', 'All generations', GENERATIONS)}${sel('cls', 'All classes', CLASSES)}</div>`;
  }

  const label = (x) => `${x.name}${x.variant ? ` (${x.variant})` : ''}`;

  // Filter matches name, prefab, element code, element, grade or role.
  function filtered() {
    const plain = (s) => String(s).toLowerCase().replace(/\./g, ''); // "psid" finds P.S.I.D.
    const f = plain(state.filter);
    const match = (x) => !f || [label(x), x.prefab, x.grade, x.role, x.attribute, x.generation, ...x.codes, ...x.elements, ...x.uiGrades, ...x.classes]
      .some((v) => v && plain(v).includes(f));
    return m.list.filter((x) => byGeneration(x) && byClass(x) && match(x));
  }

  function renderTree() {
    const list = filtered();
    $('#tree').innerHTML = GRADES.concat([...new Set(list.map((x) => x.grade))].filter((g) => !GRADES.includes(g))).map((g) => {
      const members = list.filter((x) => x.grade === g);
      if (!members.length) return '';
      const open = state.filter || members.some((x) => x.id === m.current?.id) || g === 'Boss';
      return `<details class="group" ${open ? 'open' : ''}><summary>${esc(g)}<span class="count">${members.length}</span></summary>
        ${members.map((x) => `<a class="scene-link char-link ${m.current?.id === x.id ? 'active' : ''}" href="${href(x.id)}">
          ${gameImg('icons-monster', x.icon, 'char-icon mon-icon')}
          ${x.elements.length === 1 ? elemDot(x.elements[0]) : ''}
          <span>${esc(label(x))}</span><span class="lines">${x.variants}</span></a>`).join('')}
      </details>`;
    }).join('') || '<p class="key" style="padding:12px">No matches.</p>';
    $('#tree .scene-link.active')?.scrollIntoView({ block: 'nearest' });
  }

  async function route() {
    const r = location.hash.match(/^#\/monster\/(\d+)(?:\/(\d+))?/);
    if (!r) { m.current = null; renderTree(); return overview(); } // #/monsters or a hub filter #/monsters/<facet>/<value>
    if (m.current?.id !== Number(r[1])) {
      const res = await apiFetch('/api/monster?id=' + r[1]);
      if (!res.ok) { $('#reader').innerHTML = '<div class="error">Monster not found.</div>'; return; }
      m.current = await res.json();
      $('#reader').scrollTop = 0;
      renderTree();
    }
    const vs = m.current.variants;
    m.variant = vs.find((v) => v.id === Number(r[2])) || vs.find((v) => v.appearances.length) || vs[0];
    renderMonster();
  }

  // Landing hub: cards to browse by grade, by where monsters spawn, by element and by
  // generation (#/monsters/<facet>/<value>), then the gallery of the current selection.
  const ELEMENTS = ['Fire', 'Water', 'Wind', 'Electric', 'Iron'];
  const FACETS = {
    grade: { title: 'By grade', values: GRADES, test: (x, v) => x.grade === v },
    where: {
      title: 'By where they appear',
      values: [...Object.keys(KIND_LABEL), 'none'],
      label: (v) => (v === 'none' ? 'Never spawn' : KIND_LABEL[v]),
      test: (x, v) => (v === 'none' ? !Object.keys(x.appears || {}).length : !!x.appears?.[v]),
    },
    element: { title: 'By element', values: ELEMENTS, test: (x, v) => x.elements.includes(v) },
    class: { title: 'By class', values: CLASSES, test: (x, v) => x.classes.includes(v) },
  };
  const facetHref = (k, v) => `#/monsters/${k}/${encodeURIComponent(v)}`;

  function overview() {
    const sel = location.hash.match(/^#\/monsters\/(\w+)\/([^/]+)/);
    const facet = sel && FACETS[sel[1]] ? { key: sel[1], value: decodeURIComponent(sel[2]), ...FACETS[sel[1]] } : null;
    const base = filtered(); // generation, class and text filters
    const list = base.filter((x) => !facet || facet.test(x, facet.value));
    const spawning = m.list.filter((x) => Object.keys(x.appears || {}).length).length;
    const used = new Set(); // a different monster on each card where possible
    const iconOf = (xs) => {
      const hit = xs.find((x) => x.icon && !used.has(x.icon)) || xs.find((x) => x.icon);
      if (!hit) return null;
      used.add(hit.icon);
      return `img/icons-monster/${hit.icon}.webp`;
    };
    const groups = Object.entries(FACETS).map(([k, f]) => ({
      title: f.title,
      cards: f.values.map((v) => {
        const xs = base.filter((x) => f.test(x, v));
        return xs.length && { href: facetHref(k, v), title: f.label ? f.label(v) : v, n: xs.length, img: iconOf(xs) };
      }).filter(Boolean),
    })).filter((g) => g.cards.length);
    const heading = facet ? `${facet.label ? facet.label(facet.value) : facet.value} · ${fmtNum(list.length)}` : `All monsters · ${fmtNum(list.length)}`;
    $('#reader').innerHTML = hubHtml({
      title: 'Monsters',
      text: `${m.list.length} monster models (${fmtNum(m.list.reduce((n, x) => n + x.variants, 0))} variants by element code, raid and event version); ` +
        `${spawning} of them spawn somewhere. Pick a monster for its variants, skills, parts and where it appears.`,
      groups,
    }).replace('</p>', `</p>${filterBar()}`) + `<div class="mon-browse"><div class="mon-gallery-head"><h2 class="hub-head">${esc(heading)}</h2>${facet ? '<a class="nav-btn" href="#/monsters">Show all</a>' : ''}</div>
      <div class="char-gallery mon-gallery">${list.map((x) => `<a href="${href(x.id)}" title="${esc(label(x))}">
        ${x.icon ? gameImg('icons-monster', x.icon) : '<span class="mon-noart"></span>'}<span>${esc(label(x))}</span></a>`).join('') || '<p class="key">No matches.</p>'}</div></div>`;
    $('#reader').querySelectorAll('[data-filter]').forEach((el) => el.onchange = () => setFilter(el.dataset.filter, el.value));
    if (facet) $('.mon-gallery-head')?.scrollIntoView(); else $('#reader').scrollTop = 0;
  }

  // ---------- monster page ----------
  // Named skills as a table (one value per cell); their descriptions follow as a list.
  function skillsCard(x, v) {
    const list = v.skills.map((id) => x.skills[id]).filter(Boolean);
    if (!list.length) return '';
    return `<section class="card"><h3>Skills <span class="sub">${list.length}${v.hiddenSkills ? ` + ${v.hiddenSkills} unnamed` : ''}</span></h3>
      <div class="table-scroll"><table class="roster keep-cols sticky-first mon-table"><thead><tr><th>Skill</th><th>Weapon</th><th>Damage type</th><th>Fire</th>
        <th class="num">Shots</th><th class="num">Damage</th><th>Interceptable</th></tr></thead><tbody>
      ${list.map((s) => `<tr><td>${esc(s.name)}</td><td>${esc(s.weapon || '—')}</td><td>${esc(s.damage || '—')}</td><td>${esc((s.fire || '—').replace(/_/g, ' ').replace(/([a-z])([A-Z0-9])/g, '$1 $2'))}</td>
        <td class="num">${s.shots > 1 ? fmtNum(s.shots) : '—'}</td><td class="num">${esc(s.value || '—')}</td><td>${s.interceptable ? 'Yes' : '—'}</td></tr>`).join('')}
      </tbody></table></div>
      <dl class="facts mon-skill-desc">${list.filter((s) => s.description).map((s) => `<dt>${esc(s.name)}</dt><dd>${esc(s.description)}</dd>`).join('')}</dl>
    </section>`;
  }

  // One table per kind (campaign, towers, raids ...): group, stage (linked when the site has a page), level.
  // Exceed versions are told apart by name ("Exceed Peacock") or by their info text's class.
  const isExceed = (v) => /^Exceed\b/i.test(v.name) || v.monsterClass === 'Exceed';

  // One table per kind (campaign, towers, raids ...): group, stage (linked when the site has a page), level.
  // "All variants" merges every variant of the model and adds a column for which one spawns there.
  function appearancesCard(x, v) {
    const all = m.scope === 'all';
    const sources = all ? x.variants : [v];
    const rows = sources.flatMap((src) => src.appearances.flatMap((g) => g.items.map((it) => ({ kind: g.kind, group: g.group, src, ...it }))));
    if (all) rows.sort((p, q) => p.group.localeCompare(q.group, 'en', { numeric: true }) || p.label.localeCompare(q.label, 'en', { numeric: true }));
    const toggle = x.variants.length > 1 ? `<div class="seg">${[['variant', 'This variant'], ['all', 'All variants']].map(([k, t]) =>
      `<button class="${m.scope === k ? 'active' : ''}" data-scope="${k}">${t}</button>`).join('')}</div>` : '';
    const head = `<h3 class="mon-appears-head">Appears in <span class="sub">${fmtNum(rows.length)}</span>${toggle}</h3>`;
    if (!rows.length) return `<section class="card">${head}<p class="key">${all ? 'No variant of this monster' : 'This variant'} was found in any stage, tower, raid or event wave.</p></section>`;
    const kinds = [...new Set(rows.map((r) => r.kind))].sort((p, q) => Object.keys(KIND_LABEL).indexOf(p) - Object.keys(KIND_LABEL).indexOf(q));
    const heads = { campaign: ['Chapter', 'Stage'], tower: ['Tower', 'Floors'] };
    const variantCell = (src) => `<td>${src.elements[0] ? elemDot(src.elements[0]) : ''} <a href="${href(x.id, src.id)}">${esc(src.name)}</a>${isExceed(src) ? ' <span class="tag diff-trial">EXCEED</span>' : ''}</td>`;
    return `<section class="card">${head}
      ${kinds.map((k) => {
        const list = rows.filter((r) => r.kind === k);
        const [h1, h2] = heads[k] || ['Where', 'Stage'];
        return `<details class="mon-where" ${list.length <= 40 ? 'open' : ''}><summary>${esc(KIND_LABEL[k] || k)} <span class="key">${fmtNum(list.length)}</span></summary>
          <div class="table-scroll"><table class="roster keep-cols sticky-first mon-table"><thead><tr><th>${h1}</th><th>${h2}</th>${all ? '<th>Variant</th>' : ''}<th class="num">Level</th></tr></thead><tbody>
          ${list.map((r) => `<tr><td>${esc(r.group)}</td>
            <td>${r.href ? `<a href="${r.href}">${esc(r.label)}</a>` : esc(r.label)}${r.boss ? ' <span class="tag boss">BOSS</span>' : ''}</td>
            ${all ? variantCell(r.src) : ''}<td class="num">${esc(r.lv)}</td></tr>`).join('')}
          </tbody></table></div></details>`;
      }).join('')}
      <p class="key note">Level is the stage's monster level. Tower floors are grouped into ranges, with the number of floors in brackets when the monster skips some.
        Rows without a link are modes the site has no pages for yet.${all ? ' All variants: one row per variant per place, so a stage can be listed once for each element or Exceed version in it.' : ''}</p>
    </section>`;
  }

  function variantsCard(x) {
    if (x.variants.length < 2) return '';
    return `<section class="card"><h3>Variants <span class="sub">${x.variants.length}</span></h3>
      <div class="table-scroll"><table class="roster keep-cols sticky-first mon-table mon-variants"><thead><tr><th>Name</th><th class="num">ID</th><th>Class</th><th>Element</th><th>Weak to</th>
        <th class="num">Spawns</th></tr></thead><tbody>
      ${x.variants.map((v) => `<tr class="${v.id === m.variant.id ? 'is-target' : ''}" data-href="${href(x.id, v.id)}">
        <td><div class="roster-name">${gameImg('icons-monster', x.icon, 'mon-row-icon')}<a href="${href(x.id, v.id)}">${esc(v.name)}</a></div></td>
        <td class="num key">${v.id}</td>
        <td><span class="grade ${gradeClass(v.uiGrade)}">${esc(v.monsterClass)}</span></td>
        <td>${elems(v.elements)}</td><td>${elems(v.weakTo)}</td>
        <td class="num">${fmtNum(v.appearances.reduce((n, g) => n + g.count, 0) || null)}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="key note">Variants share the model and differ by element code and by the raid or event they were made for. Pick one for its skills and spawns.</p></section>`;
  }

  function partsCard(x) {
    if (x.parts.length < 2) return '';
    return `<section class="card"><h3>Parts <span class="sub">${x.parts.length}</span></h3>
      <div class="table-scroll"><table class="roster keep-cols sticky-first mon-table"><thead><tr><th>Part</th><th>Slot</th><th class="num">HP %</th><th class="num">To body %</th><th>Breakable</th><th>HP bar</th></tr></thead><tbody>
      ${x.parts.map((p) => `<tr><td>${esc(p.name)}${p.main ? ' <span class="tag target">MAIN</span>' : ''}</td><td>${esc(p.type)}</td>
        <td class="num">${pct(p.hp)}</td><td class="num">${p.main ? '—' : pct(p.damageHp)}</td><td>${p.breakable ? 'Yes' : 'No'}</td><td>${p.visibleHp ? 'Shown' : 'Hidden'}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="key note">HP % is the part's HP as a share of the monster's. "To body %" is how much of the damage a part takes also hits the body.</p></section>`;
  }

  function renderMonster() {
    const x = m.current;
    const v = m.variant;
    const badge = (text, cls = '') => `<span class="badge ${cls}">${text}</span>`;
    const related = x.related.length ? `<div class="seg">${[{ id: x.id, variant: x.variant }, ...x.related].sort((a, b) => a.id - b.id).map((r) =>
      `<a class="seg-link ${r.id === x.id ? 'active' : ''}" href="${href(r.id)}">${esc(r.variant || 'Base')}</a>`).join('')}</div>` : '';
    $('#reader').innerHTML = `
      <div class="scene-head">
        <div class="crumb">Monsters · ${esc(x.generation)} · ${esc(x.grade)}</div>
        <div class="scene-title">${esc(x.name)}${x.variant ? ` <span class="key">${esc(x.variant)}</span>` : ''}</div>
        <div class="toolbar">
          ${related}
          ${x.classes.map((c) => badge(esc(c), `grade ${gradeClass(c === 'Husk' ? 'Selfless' : c)}`)).join('')}
          ${x.elements.map((e) => badge(`${elemDot(e)} ${esc(e)}`, 'with-dot')).join('')}
          ${badge(esc(x.role))}${badge(esc(x.move === 'Fly' ? 'Flying' : 'Ground'))}
        </div>
      </div>
      <div class="stage-body">
        <section class="card"><h3>Profile</h3><div class="profile">
          ${x.art ? gameImg('icons-monster', x.art, 'char-portrait mon-art') : ''}<div>
          <dl class="facts">
            <dt>Model</dt><dd>${esc(x.grade)} · ${esc(x.size)} · ${esc(x.attribute)} <span class="key">${esc(x.prefab)} · ${x.id}</span></dd>
            <dt>Generation</dt><dd>${esc(x.generation)}</dd>
            ${x.codes.length ? `<dt>Codes</dt><dd>${x.codes.map(esc).join(', ')}</dd>` : ''}
            <dt>Variants</dt><dd>${x.variants.length}</dd>
          </dl></div></div></section>
        ${variantsCard(x)}
        <section class="card"><h3>${esc(v.name)} <span class="sub">${v.id}</span></h3><dl class="facts">
          ${v.description ? `<dt>Info</dt><dd class="prose">${esc(v.description).replace(/\n/g, '<br>')}</dd>` : ''}
          <dt>Class</dt><dd><span class="grade ${gradeClass(v.uiGrade)}">${esc(v.monsterClass)}</span></dd>
          <dt>Element</dt><dd>${elems(v.elements)}</dd>
          <dt>Weak to</dt><dd>${elems(v.weakTo)}</dd>
          ${v.passive ? `<dt>Passive</dt><dd class="key">${v.passive}</dd>` : ''}
        </dl></section>
        ${skillsCard(x, v)}
        ${appearancesCard(x, v)}
        ${partsCard(x)}
      </div>`;
    $('#reader').querySelectorAll('[data-scope]').forEach((b) => b.onclick = () => {
      m.scope = b.dataset.scope; store.set('monScope', m.scope); renderMonster();
    });
    $('#reader').querySelectorAll('.mon-variants tr[data-href]').forEach((tr) => tr.onclick = (e) => {
      if (!e.target.closest('a')) location.hash = tr.dataset.href;
    });
  }

  return { enter, route, renderTree };
})();
