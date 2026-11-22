// Nikke Library — Shop & Gacha: recruit banners, passes, packages and login events.
const Shop = (() => {
  const s = { gacha: null, passes: null, packages: null, login: null, page: 'hub', id: null, detail: null };
  const TABS = [['gacha', 'Gacha'], ['passes', 'Passes'], ['packages', 'Packages'], ['popups', 'Popup offers'], ['login', 'Login events']];
  const head = (crumb, title, desc) => `<div class="scene-head">
      <div class="crumb">${crumb.map(esc).join(' · ')}</div><div class="scene-title">${title}</div>
      ${desc ? `<p class="album-desc">${desc}</p>` : ''}</div>`;
  const load = async (key, url) => { if (!s[key]) s[key] = await (await apiFetch(url)).json(); return s[key]; };
  const LIMIT = { Account: 'once', Daily: '/ day', Weekly: '/ week', Monthly: '/ month' };
  const limitText = (l) => (l ? `${l.count} ${LIMIT[l.type] || l.type}` : '—');
  const RENEW = { AutoDay: 'Daily', AutoWeek: 'Weekly', NoRenew: 'Once' };

  // An item with its icon (and box contents when it's a random box); a Nikke links to their page.
  const charHtml = (c) => (c ? `<a href="#/character/${c.code}">${gameImg('icons-char', c.icon, 'reward-icon')}${esc(c.name)}</a>` : '—');
  const itemHtml = (x) => (x.type === 'Character' && x.code
    ? `<span class="shop-item">${charHtml({ code: x.code, name: x.name })} ×${fmtNum(x.amount)}</span>`
    : `<span class="shop-item">${rewardIcon(x)}${esc(x.name)} ×${fmtNum(x.amount)}${boxToggle(x)}</span>`);
  const itemsHtml = (list) => (list?.length ? list.map(itemHtml).join('') : '—');
  const bannerTitle = (b) => (b.featured.length ? b.featured.map((c) => c.name).join(', ') : `${b.type} #${b.id}`);
  const gemCost = (b, n) => {
    const gem = b.prices.find((p) => p.currency === 'Gem');
    return gem && gem[n] ? fmtNum(gem[n]) : '—';
  };

  async function enter() {
    renderTabs();
  }

  function renderTabs() {
    $('#cat-tabs').innerHTML = TABS.map(([id, label]) =>
      `<a class="cat-tab ${s.page === id ? 'active' : ''}" href="#/shop/${id}">${label}</a>`).join('');
  }

  function renderTree() {
    const f = state.filter;
    const link = (hash, label, meta, active) =>
      `<a class="scene-link ${active ? 'active' : ''}" href="${hash}"><span>${label}</span><span class="lines">${meta ?? ''}</span></a>`;
    const hit = (text) => !f || text.toLowerCase().includes(f);
    let html = `<details class="group" open><summary>Shop & Gacha</summary>
      ${link('#/shop', 'Overview', '', s.page === 'hub')}
      ${TABS.map(([id, label]) => link(`#/shop/${id}`, label, '', s.page === id)).join('')}</details>`;
    if (['gacha', 'banner'].includes(s.page) && s.gacha) {
      html += `<details class="group" open><summary>Banners</summary>${[...s.gacha].reverse().filter((b) => hit(bannerTitle(b))).map((b) =>
        link(`#/shop/banner/${b.id}`, esc(bannerTitle(b)), b.type, s.page === 'banner' && s.id === b.id)).join('')}</details>`;
    }
    if (['packages', 'package'].includes(s.page) && s.packages) {
      html += `<details class="group" open><summary>Package shops</summary>${s.packages.shops.filter((p) => hit(p.name)).map((p) =>
        link(`#/shop/package/${p.id}`, esc(p.name), p.products, s.page === 'package' && s.id === p.id)).join('')}</details>`;
    }
    if (['login', 'login-event'].includes(s.page) && s.login) {
      html += `<details class="group" open><summary>Login events</summary>${s.login.filter((l) => hit(`${l.name} ${l.character?.name || ''}`)).map((l) =>
        link(`#/shop/login/${l.id}`, esc(l.character ? `${l.name} · ${l.character.name}` : l.name), `${l.days} days`, s.page === 'login-event' && s.id === l.id)).join('')}</details>`;
    }
    if (['passes', 'pass', 'freepass', 'missions'].includes(s.page) && s.passes) {
      html += `<details class="group" open><summary>Season passes</summary>${[...s.passes.seasons].reverse().map((p) =>
        link(`#/shop/pass/${p.id}`, `${p.start} → ${p.end}`, `${p.missions} missions`, s.page === 'pass' && s.id === p.id)).join('')}</details>
        <details class="group" open><summary>Free passes</summary>${s.passes.free.map((p) =>
        link(`#/shop/freepass/${p.id}`, esc(p.name), `${p.ranks.length} ranks`, s.page === 'freepass' && s.id === p.id)).join('')}</details>`;
    }
    $('#tree').innerHTML = html;
  }

  async function route() {
    const m = location.hash.match(/^#\/shop(?:\/([\w-]+))?(?:\/(\d+))?/);
    const page = m?.[1] || 'hub';
    s.page = ['gacha', 'banner', 'passes', 'pass', 'freepass', 'missions', 'packages', 'package', 'popups', 'login'].includes(page) ? page : 'hub';
    s.id = m?.[2] ? Number(m[2]) : null;
    if (s.page === 'login' && s.id != null) s.page = 'login-event';
    $('#reader').innerHTML = '<div class="loading">Loading…</div>';
    if (['hub', 'gacha', 'banner'].includes(s.page)) await load('gacha', '/api/shop/gacha');
    if (['hub', 'passes', 'pass', 'freepass', 'missions'].includes(s.page)) await load('passes', '/api/shop/passes');
    if (['hub', 'packages', 'package', 'popups'].includes(s.page)) await load('packages', '/api/shop/packages');
    if (['hub', 'login', 'login-event'].includes(s.page)) await load('login', '/api/shop/login');
    if (s.page === 'banner') s.detail = await (await apiFetch(`/api/shop/banner?id=${s.id}`)).json();
    if (s.page === 'package') s.detail = await (await apiFetch(`/api/shop/package?id=${s.id}`)).json();
    if (s.page === 'login-event') s.detail = await (await apiFetch(`/api/shop/login-event?id=${s.id}`)).json();
    renderTabs();
    renderTree();
    ({ hub, gacha: gachaPage, banner: bannerPage, passes: passesPage, pass: passPage, freepass: freePassPage, missions: missionsPage,
      packages: packagesPage, package: packagePage, popups: popupsPage, login: loginPage, 'login-event': loginEventPage })[s.page]();
    $('#reader').scrollTop = 0;
  }

  // Landing page: a card per page, so the section works on a phone without the sidebar.
  function hub() {
    const pickups = s.gacha.filter((b) => b.type === 'Pick-up').length;
    $('#reader').innerHTML = hubHtml({
      title: 'Shop & Gacha',
      text: 'Recruit banners and their rates, passes, packages and login rewards.',
      groups: [{ cards: [
        { href: '#/shop/gacha', title: 'Gacha', n: `${s.gacha.length} banners`, text: `Recruit rates per Nikke, costs, pity and step rewards. ${pickups} pick-up banners.` },
        { href: '#/shop/passes', title: 'Passes', n: `${s.passes.seasons.length} seasons`, text: 'Season pass missions and costumes, and the free passes with their rank rewards.' },
        { href: '#/shop/packages', title: 'Packages', n: `${s.packages.shops.length} shops`, text: 'Paid package contents and purchase limits, and the login package.' },
        { href: '#/shop/popups', title: 'Popup offers', n: `${s.packages.popups.length} offers`, text: 'Limited-time offers triggered by levels, chapter and tower clears.' },
        { href: '#/shop/login', title: 'Login events', n: `${s.login.length} events`, text: 'Daily attendance rewards for each login event.' },
      ] }],
    });
  }

  // ---------- Gacha ----------
  function gachaPage() {
    const rows = [...s.gacha].reverse();
    $('#reader').innerHTML = head(['Shop & Gacha'], 'Gacha', 'Recruit banners, newest id first.') + `
      <div class="stage-body"><section class="card"><h3>Banners <span class="sub">${rows.length}</span></h3>
        <div class="table-scroll"><table class="roster keep-cols sticky-first shop-names"><thead><tr><th>Banner</th><th>Type</th><th class="num">SSR</th>
          <th class="num">Gems ×1</th><th class="num">Gems ×10</th><th class="num">Steps</th><th class="num">Pull limit</th><th class="num">Id</th></tr></thead><tbody>
        ${rows.map((b) => `<tr><td><a href="#/shop/banner/${b.id}">${b.featured[0] ? gameImg('icons-char', b.featured[0].icon, 'reward-icon') : ''}${esc(bannerTitle(b))}</a></td>
          <td>${esc(b.type)}</td><td class="num">${fmtPct(b.ssrRate)}</td><td class="num">${gemCost(b, 'one')}</td><td class="num">${gemCost(b, 'ten')}</td>
          <td class="num">${b.steps || '—'}</td><td class="num">${b.pullLimit || '—'}</td><td class="num">${b.id}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="key note">Banners have no names or dates in the data, so each is named after its pick-up Nikke(s). Steps = pull-count reward steps. Prices are also payable with vouchers (see each banner).</p></section></div>`;
  }

  function bannerPage() {
    const b = s.detail;
    if (b.error) { $('#reader').innerHTML = '<div class="error">Banner not found.</div>'; return; }
    const kind = (e) => (e.kind === 'Character' ? '' : ` <span class="tag">${esc(e.kind.replace(/([a-z])([A-Z])/g, '$1 $2'))}</span>`);
    $('#reader').innerHTML = head(['Shop & Gacha', 'Gacha'], esc(bannerTitle(b)), `${esc(b.type)} banner #${b.id}.`) + `
      <div class="stage-body">
        <section class="card"><h3>Banner</h3><dl class="facts">
          <dt>Type</dt><dd>${esc(b.type)}</dd>
          <dt>SSR rate</dt><dd>${fmtPct(b.ssrRate)}</dd>
          ${b.prices.map((p) => `<dt>${esc(p.currency)}</dt><dd>${fmtNum(p.one)} per pull${p.ten ? ` · ${fmtNum(p.ten)} per 10` : ''}${p.dailyOne ? ` · first pull each day ${fmtNum(p.dailyOne)}` : ''}</dd>`).join('')}
          ${b.pullLimit ? `<dt>Pull limit</dt><dd>${b.pullLimit}</dd>` : ''}
          ${b.perPull.length ? `<dt>Each pull also gives</dt><dd>${itemsHtml(b.perPull)}</dd>` : ''}
          ${b.limitReward.length ? `<dt>Limit reward</dt><dd>${itemsHtml(b.limitReward)}</dd>` : ''}
          ${b.previous ? `<dt>Previous step</dt><dd><a href="#/shop/banner/${b.previous}">Banner #${b.previous}</a></dd>` : ''}
          ${b.choicesList.length ? `<dt>Choose from</dt><dd>${b.choicesList.map(charHtml).join(', ')}</dd>` : ''}
        </dl></section>
        ${b.pity.map((p) => `<section class="card"><h3>${esc(p.name)}</h3><dl class="facts">
          <dt>Pulls needed</dt><dd>${fmtNum(p.pulls)}</dd><dt>Reward</dt><dd>${p.reward} Nikke of your choice</dd>
          ${p.start ? `<dt>Dates</dt><dd>${p.start} → ${p.end}</dd>` : ''}
          <dt>Nikkes</dt><dd>${p.characters.map(charHtml).join(', ') || '—'}</dd></dl></section>`).join('')}
        ${b.payback.length ? `<section class="card"><h3>Pull rewards <span class="sub">${b.payback.length} steps</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th class="num">Step</th><th class="num">Pulls</th><th>Reward</th></tr></thead><tbody>
          ${b.payback.map((p) => `<tr><td class="num">${p.step}</td><td class="num">${fmtNum(p.pulls)}</td><td>${itemsHtml(p.reward)}</td></tr>`).join('')}
          </tbody></table></div></section>` : ''}
        <section class="card"><h3>Rates</h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th>Nikke</th><th>Grade</th><th class="num">Rate</th></tr></thead><tbody>
          ${b.grades.flatMap((g) => g.entries.map((e) => `<tr><td>${e.code ? charHtml(e) : esc(e.name)}${kind(e)}</td><td>${g.rare}</td><td class="num">${fmtPct(e.rate, 4)}</td></tr>`)).join('')}
          </tbody></table></div>
          <p class="key note">Grade totals: ${b.grades.map((g) => `${g.rare} ${fmtPct(g.rate, 2)}${g.guaranteedAt ? ` (max-count ${fmtNum(g.guaranteedAt)})` : ''}`).join(' · ')}. Each Nikke's rate = the grade row's rate × the Nikke's share of that row's list.</p></section>
      </div>`;
  }

  // ---------- Passes ----------
  function passesPage() {
    const p = s.passes;
    const linked = new Set(p.seasons.map((x) => x.pointId));
    const other = Object.entries(p.missionGroups).filter(([k]) => !linked.has(Number(k)));
    $('#reader').innerHTML = head(['Shop & Gacha'], 'Passes', 'Season passes, their missions and costumes, and the free passes.') + `
      <div class="stage-body">
        <section class="card"><h3>Season passes <span class="sub">${p.seasons.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th>Season</th><th class="num">Ends</th><th class="num">Missions</th><th>Costumes</th></tr></thead><tbody>
          ${[...p.seasons].reverse().map((x) => `<tr><td><a href="#/shop/pass/${x.id}">${x.start}</a></td><td class="num">${x.end}</td><td class="num">${x.missions}</td>
            <td>${x.costumes.length ? esc(x.costumes.join(', ')) : '—'}</td></tr>`).join('')}
          </tbody></table></div>
          <p class="key note">Rank rewards for season passes are not in the data. Costumes = pass costume shop items that went on sale during the season.</p></section>
        <section class="card"><h3>Free passes <span class="sub">${p.free.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th>Pass</th><th class="num">Ranks</th><th class="num">Missions</th><th class="num">Rank skip</th></tr></thead><tbody>
          ${p.free.map((x) => `<tr><td><a href="#/shop/freepass/${x.id}">${esc(x.name)}</a></td><td class="num">${x.ranks.length}</td><td class="num">${x.missions.length}</td>
            <td class="num">${fmtNum(x.skip.amount)} ${esc(x.skip.currency)}</td></tr>`).join('')}
          </tbody></table></div></section>
        <section class="card"><h3>Other pass mission groups <span class="sub">${other.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th class="num">Point id</th><th class="num">Missions</th></tr></thead><tbody>
          ${other.map(([k, list]) => `<tr><td class="num"><a href="#/shop/missions/${k}">${k}</a></td><td class="num">${list.length}</td></tr>`).join('')}
          </tbody></table></div><p class="key note">Mission groups whose pass point id no season pass uses (event passes, inferred).</p></section>
      </div>`;
  }

  const missionTable = (list) => `<div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Mission</th><th class="num">Points</th></tr></thead><tbody>
    ${list.map((m) => `<tr><td>${esc(m.text)}</td><td class="num">${fmtNum(m.points)}</td></tr>`).join('')}</tbody></table></div>`;

  function passPage() {
    const x = s.passes.seasons.find((p) => p.id === s.id);
    if (!x) { $('#reader').innerHTML = '<div class="error">Pass not found.</div>'; return; }
    const list = s.passes.missionGroups[x.pointId] || [];
    $('#reader').innerHTML = head(['Shop & Gacha', 'Passes'], `Season pass ${x.start} → ${x.end}`, `Pass #${x.id} · pass point ${x.pointId}.`) + `
      <div class="stage-body">
        <section class="card"><h3>Missions <span class="sub">${list.length}</span></h3>${missionTable(list)}</section>
        ${x.costumes.length ? `<section class="card"><h3>Costumes on sale</h3><p>${esc(x.costumes.join(', '))}</p></section>` : ''}
      </div>`;
  }

  function missionsPage() {
    const list = s.passes.missionGroups[s.id] || [];
    $('#reader').innerHTML = head(['Shop & Gacha', 'Passes'], `Pass missions · point ${s.id}`, '') + `
      <div class="stage-body"><section class="card"><h3>Missions <span class="sub">${list.length}</span></h3>${missionTable(list)}</section></div>`;
  }

  function freePassPage() {
    const x = s.passes.free.find((p) => p.id === s.id);
    if (!x) { $('#reader').innerHTML = '<div class="error">Pass not found.</div>'; return; }
    $('#reader').innerHTML = head(['Shop & Gacha', 'Passes'], esc(x.name), esc(x.description)) + `
      <div class="stage-body">
        <section class="card"><h3>Ranks <span class="sub">${x.ranks.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th class="num">Rank</th><th class="num">Points</th><th>Reward</th></tr></thead><tbody>
          ${x.ranks.map((r) => `<tr><td class="num">${r.highlight ? `<b>${r.rank}</b>` : r.rank}</td><td class="num">${fmtNum(r.points)}</td><td>${itemsHtml(r.reward)}</td></tr>`).join('')}
          </tbody></table></div>
          <p class="key note">Points = total pass points needed. Bold ranks are highlighted in game. A rank can be skipped for ${fmtNum(x.skip.amount)} ${esc(x.skip.currency)}.</p></section>
        <section class="card"><h3>Missions <span class="sub">${x.missions.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Mission</th><th>Resets</th><th class="num">Points</th></tr></thead><tbody>
          ${x.missions.map((m) => `<tr><td>${esc(m.text)}</td><td>${esc(RENEW[m.renew] || m.renew)}</td><td class="num">${fmtNum(m.points)}</td></tr>`).join('')}
          </tbody></table></div></section>
      </div>`;
  }

  // ---------- Packages ----------
  function packagesPage() {
    const p = s.packages;
    $('#reader').innerHTML = head(['Shop & Gacha'], 'Packages', 'Paid packages by shop, and the login package.') + `
      <div class="stage-body">
        <section class="card"><h3>Package shops <span class="sub">${p.shops.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first shop-names"><thead><tr><th>Shop</th><th class="num">Products</th><th class="num">Active</th><th class="num">Free</th><th class="num">Id</th></tr></thead><tbody>
          ${p.shops.map((x) => `<tr><td><a href="#/shop/package/${x.id}">${esc(x.name)}</a></td><td class="num">${x.products}</td><td class="num">${x.active}</td>
            <td class="num">${x.free || '—'}</td><td class="num">${x.id}</td></tr>`).join('')}
          </tbody></table></div>
          <p class="key note">Shops have no names in the data, so each is named after its first product. Prices are store product ids only; the data has no money amounts.</p></section>
        ${p.login.map((l) => `<section class="card"><h3>${esc(l.name)}</h3><p class="key">${esc(l.description)}</p>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th class="num">Day</th><th>Contents</th></tr></thead><tbody>
          ${l.days.map((d) => `<tr><td class="num">${d.day}</td><td>${itemsHtml(d.contents)}</td></tr>`).join('')}
          </tbody></table></div>
          <p class="key note">Buy limit ${limitText(l.limit)}; ${l.extraDays} extra days to claim.</p></section>`).join('')}
      </div>`;
  }

  function packagePage() {
    const d = s.detail;
    if (d.error) { $('#reader').innerHTML = '<div class="error">Package shop not found.</div>'; return; }
    $('#reader').innerHTML = head(['Shop & Gacha', 'Packages'], esc(d.name), `Package shop #${d.id} · ${d.products.length} products.`) + `
      <div class="stage-body"><section class="card">
        <div class="table-scroll"><table class="roster keep-cols sticky-first shop-names"><thead><tr><th>Product</th><th>Contents</th><th class="num">Limit</th><th class="num">Grade</th><th class="num">Value</th></tr></thead><tbody>
        ${d.products.map((p) => `<tr><td>${esc(p.name)}${p.free ? ' <span class="tag">FREE</span>' : ''}${p.active ? '' : ' <span class="tag">OFF</span>'}</td>
          <td>${itemsHtml(p.contents)}</td><td class="num">${limitText(p.limit)}</td><td class="num">${p.grade ?? '—'}</td><td class="num">${p.efficiency ?? '—'}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="key note">Grade = price tier within the shop; Value = the product_efficiency rating (meaning inferred). OFF = not active.</p></section></div>`;
  }

  function popupsPage() {
    const rows = s.packages.popups;
    const TRIGGER = (t) => t.replace(/([a-z])([A-Z])/g, '$1 $2');
    $('#reader').innerHTML = head(['Shop & Gacha', 'Packages'], 'Popup offers', 'Packages that pop up for a limited time when a condition is met.') + `
      <div class="stage-body"><section class="card"><h3>Offers <span class="sub">${rows.length}</span></h3>
        <div class="table-scroll"><table class="roster keep-cols sticky-first shop-names"><thead><tr><th>Offer</th><th>Trigger</th><th class="num">At</th><th class="num">Hours</th><th class="num">Grade</th><th>Contents</th></tr></thead><tbody>
        ${rows.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.triggers.map(TRIGGER).join(', '))}</td>
          <td class="num">${p.conditions > 1 ? `${fmtNum(p.minValue)}–${fmtNum(p.maxValue)}` : fmtNum(p.minValue)}</td><td class="num">${fmtNum(p.hours)}</td>
          <td class="num">${p.grade}</td><td>${itemsHtml(p.contents)}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="key note">At = the condition values that trigger the offer (level, chapter or floor; ${rows.reduce((n, p) => n + p.conditions, 0)} trigger rows in all). Hours = how long the offer stays.</p></section></div>`;
  }

  // ---------- Login events ----------
  function loginPage() {
    $('#reader').innerHTML = head(['Shop & Gacha'], 'Login events', 'Attendance events: one reward per login day.') + `
      <div class="stage-body"><section class="card"><h3>Events <span class="sub">${s.login.length}</span></h3>
        <div class="table-scroll"><table class="roster keep-cols sticky-first shop-names"><thead><tr><th>Event</th><th>Nikke</th><th class="num">Days</th><th class="num">Goals</th><th class="num">Id</th></tr></thead><tbody>
        ${[...s.login].reverse().map((l) => `<tr><td><a href="#/shop/login/${l.id}">${esc(l.name)}</a></td><td>${l.character ? charHtml(l.character) : '—'}</td>
          <td class="num">${l.days}</td><td class="num">${l.goals || '—'}</td><td class="num">${l.id}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="key note">Newest id first. Goals = days marked as milestone rewards. Most events share the generic name "Daily Login Event"; the Nikke is the event's featured character.</p></section></div>`;
  }

  function loginEventPage() {
    const l = s.detail;
    if (l.error) { $('#reader').innerHTML = '<div class="error">Login event not found.</div>'; return; }
    $('#reader').innerHTML = head(['Shop & Gacha', 'Login events'], esc(l.name), `Event #${l.id}${l.character ? ` · ${esc(l.character.name)}` : ''} · ${l.days} days.`) + `
      <div class="stage-body"><section class="card">
        <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th class="num">Day</th><th>Reward</th></tr></thead><tbody>
        ${l.dayList.map((d) => `<tr><td class="num">${d.goal ? `<b>${d.day}</b>` : d.day}</td><td>${itemsHtml(d.reward)}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="key note">Bold days are goal rewards.${l.replenish ? ` Missed days can be made up for ${fmtNum(l.replenish.amount)} ${esc(l.replenish.currency)}.` : ''}</p></section></div>`;
  }

  return { enter, route, renderTree };
})();
