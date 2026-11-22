// Tracing the Stars chart viewer: full chart (the whole song in columns) and a playback
// highway, in the game's layout or as 7 equal keys. Data from /api/tts/chart (nikke-downloader/tts-charts.json).
// Chart format: ticks (48 per beat, 192 per bar); tracks 3,4,6,7 = D F J K, 5 = Space, 10/11 = shift notes;
// each note is (tick, extra); a hold lasts extra >> 8 ticks. Lane order and shift sides are inferred, not verified.
// Low byte of extra on D F J K: 1 = a hold tick, 0 = a plain tap. Every note inside a hold of its own lane has it
// (5,440 of 5,440 in 349 charts) and no note outside every hold has it (0 of about 125,800): the stars drawn along a hold bar are
// these notes, which are held with the bar, not tapped. D F J K notes inside a Space hold have it too (mostly the
// D lane). Shift lanes never have a note inside their own hold, so their hold bars carry no stars.
// Shift notes (tracks 10/11) carry a swipe in the low byte of extra: two decimal digits, each 1-9, = the swipe's
// start zone and end zone on a 1-9 scale (9,023 of the 9,027 shift notes in the 349 charts fit: track 10 ends below
// its start, track 11 above, 4 odd ones aside; 5 -> 1 and 5 -> 9 are the most common). Which way the scale runs on screen is not known.
window.TtsChart = (() => {
  const COLORS = { D: '#8f86e8', F: '#3fbf95', J: '#5aa5ee', K: '#e66f9a', S: '#f2c230', L: '#8ad23a', R: '#e255d6' };
  const DIFF_CLASS = { Casual: 'casual', Normal: 'normal', Hard: 'hard', Expert: 'expert' };
  const TICKS_PER_BEAT = 48;
  const TICKS_PER_BAR = 192;

  // ---- Skins (EventTTSSkinObjectTable). BG and Note skins use the game's own sprites (public/img/tts-skin,
  // part names from `parts` in /api/tts/skins); Character skins only exist as Spine models, so the chibi
  // preview from icons-event is used for those.
  const skinCache = new Map();
  function skinImg(name, onReady, fam = 'icons-event') {
    if (!name) return null;
    const key = `${fam}/${name}`;
    let img = skinCache.get(key);
    if (!img) { img = new Image(); img.src = `img/${fam}/${name}.webp`; skinCache.set(key, img); }
    if (img.complete && img.naturalWidth) return img;
    img.onReady = onReady;
    if (!img.waiting) { img.waiting = true; img.addEventListener('load', () => { img.waiting = false; img.onReady(); }, { once: true }); }
    return null;
  }

  const LANE_KEYS = { laneh: 'laneH', hit: 'hitOff', topw: 'topW', botw: 'botW', lanea: 'laneA' };
  // Playback lane shape (px / %), remembered: the lane's height (its top line) and the hit line's height above the bottom.
  function loadLane() {
    const saved = store.get('ttsLane', null) || {};
    const clamp = (v, lo, hi, d) => (Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d);
    return {
      laneH: clamp(saved.h, 320, 1000, 520), hitOff: clamp(saved.hit, 20, 300, 70),
      topW: clamp(saved.topw, 20, 200, 100), botW: clamp(saved.botw, 20, 200, 100), laneA: clamp(saved.alpha, 0, 100, 100),
    };
  }

  // Chosen skin ids (0 = none), remembered; ids that no longer exist fall back to none.
  function loadSkins(skins = []) {
    const saved = store.get('ttsSkin2', null) || { bg: 10001, ch: 0, note: 30001 }; // ttsSkin2: the old ttsSkin kept "Lane colors" for anyone who only changed the stage
    const ok = (id, type) => id === 0 || skins.some((k) => k.id === id && k.type === type);
    return { bg: ok(saved.bg, 'BG') ? saved.bg : 0, ch: ok(saved.ch, 'Character') ? saved.ch : 0, note: ok(saved.note, 'Note') ? saved.note : 0 };
  }

  // Lanes in lane units. "game": the in-game look (shift notes on the sides, Space spans the four keys);
  // "7k": seven equal keys in keyboard order L Shift, D, F, Space, J, K, R Shift.
  function layoutOf(kind, swap) {
    const shiftL = swap ? '11' : '10';
    const shiftR = swap ? '10' : '11';
    if (kind === '7k') {
      return {
        width: 7,
        lanes: [[shiftL, 'L Shift', COLORS.L], ['3', 'D', COLORS.D], ['4', 'F', COLORS.F], ['5', 'Space', COLORS.S], ['6', 'J', COLORS.J], ['7', 'K', COLORS.K], [shiftR, 'R Shift', COLORS.R]]
          .map(([track, label, color], i) => ({ track, label, color, x: i, w: 1 })),
      };
    }
    // Like the phone game: four lanes, Space across all four, and the swipe notes drawn inside the lanes
    // at their end zone (the two shift tracks have no lane of their own: swipe = true).
    return {
      width: 4,
      lanes: [
        { track: shiftL, label: 'L Shift', color: COLORS.L, x: 0, w: 4, swipe: true },
        { track: '3', label: 'D', color: COLORS.D, x: 0, w: 1 },
        { track: '4', label: 'F', color: COLORS.F, x: 1, w: 1 },
        { track: '6', label: 'J', color: COLORS.J, x: 2, w: 1 },
        { track: '7', label: 'K', color: COLORS.K, x: 3, w: 1 },
        { track: '5', label: 'Space', color: COLORS.S, x: 0, w: 4, wide: true },
        { track: shiftR, label: 'R Shift', color: COLORS.R, x: 0, w: 4, swipe: true },
      ],
    };
  }

  function tempoMap(chart) {
    const map = [];
    let sec = 0;
    let prevTick = 0;
    let prevBpm = chart.b[0][1];
    chart.b.forEach((r, i) => {
      if (i > 0) sec += ((r[0] - prevTick) / TICKS_PER_BEAT) * 60 / prevBpm;
      prevTick = r[0];
      prevBpm = r[1];
      map.push([r[0], sec, r[1]]);
    });
    return map;
  }
  const tickToSec = (map, tick) => { let m = map[0]; for (const x of map) if (x[0] <= tick) m = x; return m[1] + ((tick - m[0]) / TICKS_PER_BEAT) * 60 / m[2]; };
  const secToTick = (map, sec) => { let m = map[0]; for (const x of map) if (x[1] <= sec) m = x; return m[0] + (sec - m[1]) * m[2] / 60 * TICKS_PER_BEAT; };
  const fmtTime = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.floor(Math.max(0, s) % 60)).padStart(2, '0')}`;

  function mount(root, data, opts = {}) {
    const state = {
      diff: data.diffs.find((d) => d.difficulty === opts.difficulty) || data.diffs[data.diffs.length - 1],
      skin: loadSkins(opts.skins), swipe: true, ...loadLane(),
      view: 'full', layout: '7k', swap: false, barsPerCol: 16, zoom: 100, vzoom: 100, speed: 170, rate: 1, offset: 0,
      t: 0, playing: false, last: 0,
    };
    root.innerHTML = `
      <div class="tc">
        <div class="tc-row tc-diffs"></div>
        <div class="tc-row tc-skins"${(opts.skins || []).length ? '' : ' hidden'}>
          <span class="key">Skin</span>
          ${[['bg', 'Stage', 'BG', 'No stage'], ['ch', 'Character', 'Character', 'No character'], ['note', 'Notes', 'Note', 'Lane colors']].map(([key, label, type, none]) => `
          <label class="tc-opt">${label} <select data-skin="${key}"><option value="0">${none}</option>${(opts.skins || []).filter((k) => k.type === type)
            .map((k) => `<option value="${k.id}"${k.id === state.skin[key] ? ' selected' : ''}>${esc(k.name)}</option>`).join('')}</select></label>`).join('')}
          <img class="tc-char" alt="" hidden>
        </div>
        <div class="tc-row">
          <span class="tc-group" data-group="view"><button data-v="full">Full chart</button><button data-v="play">Playback</button></span>
          <span class="tc-group" data-group="layout"><button data-v="game">Game layout</button><button data-v="7k">7K</button></span>
          <label class="tc-opt" title="Which of the two shift tracks is left is a guess"><input type="checkbox" data-opt="swap"> swap shift sides</label>
          <label class="tc-opt" title="Each shift note's swipe: start zone to end zone (1-9), read from the low byte of its flags"><input type="checkbox" data-opt="swipe" checked> swipe paths</label>
          <label class="tc-opt tc-full-only">Bars per column <select data-opt="bars"><option>4</option><option>8</option><option selected>16</option><option>32</option></select></label>
          <label class="tc-opt tc-full-only">Width <input type="range" data-opt="zoom" min="50" max="400" step="10" value="100" style="width:110px"> <span class="tc-zv">100%</span></label>
          <label class="tc-opt tc-full-only">Vertical zoom <input type="range" data-opt="vzoom" min="50" max="800" step="10" value="100" style="width:130px"> <span class="tc-vv">100%</span></label>
          <span class="tc-info key"></span>
        </div>
        <div class="tc-row tc-play-only">
          <button data-act="play">Play</button><button data-act="restart">Restart</button>
          <label class="tc-opt">Speed <input type="range" data-opt="speed" min="60" max="400" value="170"></label>
          <label class="tc-opt">Rate <select data-opt="rate"><option>0.25</option><option>0.5</option><option>0.75</option><option selected>1</option></select></label>
          <label class="tc-opt">Offset (s) <input type="number" data-opt="offset" step="0.05" value="0"></label>
          ${[['laneh', 'Lane height', 'laneH', 320, 1000, 10, 'Stretches the lane upward: a taller lane shows more of the chart ahead at the same speed'],
            ['hit', 'Hit line height', 'hitOff', 20, 300, 5, 'Moves the hit line up from the bottom edge'],
            ['topw', 'Top width %', 'topW', 20, 200, 5, 'Width of the lane at its top edge: below the bottom width it narrows into a trapezoid'],
            ['botw', 'Bottom width %', 'botW', 20, 200, 5, 'Width of the lane at the hit line'],
            ['lanea', 'Track opacity %', 'laneA', 0, 100, 5, 'Opacity of the dark track behind the lanes']]
            .map(([o, label, key, min, max, step, tip]) => `<label class="tc-opt" title="${tip}">${label} <input type="range" data-opt="${o}" min="${min}" max="${max}" step="${step}" value="${state[key]}" style="width:100px"> <span data-val="${o}">${state[key]}</span></label>`).join('')}
          <button data-act="lanereset" title="Back to the default lane shape">Reset lane</button>
        </div>
        <canvas class="tc-canvas"></canvas>
        <input type="range" class="tc-seek tc-play-only" min="0" max="1000" value="0" aria-label="Seek">
        <p class="key tc-note">Notes: D F J K lanes, Space (wide), L/R Shift. Holds are drawn as bars (length = the note's extra &gt;&gt; 8 ticks) and must be held, not tapped. A D F J K note flagged 1 in the data (the low byte of extra) is a hold tick: the stars along a hold bar, held with it (gold inside a Space hold). Shift (swipe) hold bars have no stars: no note ever sits inside a shift hold in the data. Lane order, which shift track is left, and hold lengths are inferred from the data and not verified in game. Game layout is the four lanes only, like the phone game, with each swipe drawn as an area from its start zone to its end zone, arrow at the end; 7K keeps separate shift lanes and a thin path. Swipe paths: a shift note's flags hold a start and end zone (1-9); the line is drawn from start (dot) to end (arrow) across the highway, with zone 1 at the left edge, which direction the scale runs in game is not verified. Skins: stages and notes use the game's own sprites (which piece is used where is inferred: Space notes are the game's \"aflick\" / \"sp\" pieces); characters only exist as Spine models, so they show the small skin preview.</p>
      </div>`;
    const $ = (sel) => root.querySelector(sel);
    const canvas = $('.tc-canvas');
    const ctx = canvas.getContext('2d');
    let tmap = tempoMap(state.diff.chart);

    // Difficulty tabs.
    const diffBox = $('.tc-diffs');
    diffBox.innerHTML = `<span class="key">${data.name}</span>` + data.diffs.map((d) => `<button data-diff="${d.difficulty}" class="lv lv-${DIFF_CLASS[d.difficulty]}">${d.difficulty} Lv ${d.level}</button>`).join('');

    // Space hold spans of the chart (the stars inside them are drawn in the Space piece's colour).
    const spaceHolds = () => {
      if (!state.diff.spaceHolds) {
        const n = state.diff.chart.n['5'] || [];
        state.diff.spaceHolds = [];
        for (let i = 0; i < n.length; i += 2) if (n[i + 1] >= 256) state.diff.spaceHolds.push([n[i], n[i] + (n[i + 1] >> 8)]);
      }
      return state.diff.spaceHolds;
    };
    const inSpaceHold = (tick) => spaceHolds().some(([a, b]) => tick > a && tick <= b);
    const skinById = new Map((opts.skins || []).map((k) => [k.id, k]));
    const skinOf = (type) => skinById.get(state.skin[type]);
    // A skin's sprites by part name (null until loaded), or null when the skin has none.
    const sprites = (type) => {
      const parts = skinOf(type)?.parts;
      if (!parts) return null;
      const out = {};
      for (const [k, name] of Object.entries(parts)) out[k] = skinImg(name, draw, 'tts-skin');
      return out;
    };
    // Average colour of a sprite, for the small blocks of the full chart.
    const tints = new Map();
    function tint(img) {
      if (!img) return null;
      if (!tints.has(img.src)) {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0, 1, 1);
        const d = g.getImageData(0, 0, 1, 1).data;
        tints.set(img.src, d[3] ? `rgb(${d[0]},${d[1]},${d[2]})` : null);
      }
      return tints.get(img.src);
    }
    // The stage art, cropped to cover the rect (top aligned, where the sign and lights are) and dimmed.
    function drawStage(x, y, w, h) {
      const img = sprites('bg')?.stage;
      if (!img) return false;
      const k = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const sw = w / k;
      const sh = h / k;
      ctx.drawImage(img, (img.naturalWidth - sw) / 2, 0, sw, sh, x, y, w, h);
      ctx.fillStyle = 'rgba(12,12,18,.4)';
      ctx.fillRect(x, y, w, h);
      return true;
    }

    function sync() {
      root.querySelectorAll('[data-diff]').forEach((b) => b.classList.toggle('is-on', b.dataset.diff === state.diff.difficulty));
      root.querySelectorAll('[data-group=view] button').forEach((b) => b.classList.toggle('is-on', b.dataset.v === state.view));
      root.querySelectorAll('[data-group=layout] button').forEach((b) => b.classList.toggle('is-on', b.dataset.v === state.layout));
      root.querySelectorAll('.tc-play-only').forEach((e) => { e.style.display = state.view === 'play' ? '' : 'none'; });
      root.querySelectorAll('.tc-full-only').forEach((e) => { e.style.display = state.view === 'full' ? '' : 'none'; });
      $('[data-act=play]').textContent = state.playing ? 'Pause' : 'Play';
      const ch = skinOf('ch');
      const badge = $('.tc-char');
      badge.hidden = !(ch && state.view === 'full');
      if (ch) badge.src = `img/icons-event/${ch.preview}.webp`;
    }

    function size(cssH) {
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.parentElement.clientWidth || 800;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = 'high';
      return cssW;
    }

    // The highway's x range, for the swipe paths (zones 1-9 spread evenly across it).
    let field = null;
    function drawSwipe(low, y, big) {
      const a = Math.floor(low / 10);
      const b = low % 10;
      if (!field || a < 1 || a > 9 || b < 1 || b > 9 || a === b) return;
      const color = b < a ? COLORS.L : COLORS.R; // towards zone 1 = the left shift colour
      const xa = field.x0 + ((a - 1) / 8) * field.w;
      const xb = field.x0 + ((b - 1) / 8) * field.w;
      const dir = Math.sign(xb - xa);
      ctx.save();
      if (persp) { const f = at(y); ctx.translate(persp.cx, y); ctx.scale(f, f); ctx.translate(-persp.cx, -y); }
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.globalAlpha = big ? 0.8 : 0.35;
      ctx.lineWidth = big ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(xa, y);
      ctx.lineTo(xb, y);
      ctx.stroke();
      if (big) {
        ctx.beginPath(); ctx.arc(xa, y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(xb, y); ctx.lineTo(xb - dir * 10, y - 6); ctx.lineTo(xb - dir * 10, y + 6); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    // Lane shape. In playback the lane can be a trapezoid: persp = { cx, top, hit, ft, fb } scales everything about the
    // lane's centre line, by ft at the top edge and fb at the hit line (null = a plain rectangle).
    let persp = null;
    const at = (y) => {
      if (!persp) return 1;
      const t = Math.min(1, Math.max(0, (y - persp.top) / (persp.hit - persp.top)));
      return persp.ft + (persp.fb - persp.ft) * t;
    };
    const px = (xx, f) => (persp ? persp.cx + (xx - persp.cx) * f : xx);
    // Draws fn scaled about the lane centre and the given y by the lane's scale there (notes keep their y).
    function scaled(y, fn) {
      if (!persp) { fn(); return; }
      const f = at(y);
      ctx.save();
      ctx.translate(persp.cx, y);
      ctx.scale(f, f);
      ctx.translate(-persp.cx, -y);
      fn();
      ctx.restore();
    }
    // A vertical strip (xl..xr, y1..y2) as a trapezoid: a sprite cut into thin slices, or the current fill colour.
    function drawTrap(img, xl, xr, y1, y2) {
      if (!persp) { ctx.drawImage(img, xl, y1, xr - xl, y2 - y1); return; }
      const n = Math.max(1, Math.ceil((y2 - y1) / 3));
      for (let i = 0; i < n; i++) {
        const ya = y1 + ((y2 - y1) * i) / n;
        const yz = y1 + ((y2 - y1) * (i + 1)) / n;
        const f = at((ya + yz) / 2);
        ctx.drawImage(img, 0, (img.naturalHeight * i) / n, img.naturalWidth, img.naturalHeight / n, px(xl, f), ya, (xr - xl) * f, yz - ya + 0.6);
      }
    }
    function trapFill(xl, xr, y1, y2) {
      const f1 = at(y1);
      const f2 = at(y2);
      ctx.beginPath();
      ctx.moveTo(px(xl, f1), y1); ctx.lineTo(px(xr, f1), y1); ctx.lineTo(px(xr, f2), y2); ctx.lineTo(px(xl, f2), y2);
      ctx.closePath();
      ctx.fill();
    }
    function syncLane() {
      for (const [o, key] of Object.entries(LANE_KEYS)) {
        const el = $(`[data-opt=${o}]`);
        if (el) el.value = state[key];
        const v = $(`[data-val=${o}]`);
        if (v) v.textContent = state[key];
      }
      store.set('ttsLane', { h: state.laneH, hit: state.hitOff, topw: state.topW, botw: state.botW, alpha: state.laneA });
    }

    // The opaque part of a sprite: the pieces carry transparent padding, which left gaps between the hold
    // and the pieces it joins.
    const cores = new Map();
    function core(img) {
      let c = cores.get(img.src);
      if (!c) {
        const cv = document.createElement('canvas');
        cv.width = img.naturalWidth;
        cv.height = img.naturalHeight;
        const g = cv.getContext('2d');
        g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, cv.width, cv.height).data;
        let x0 = cv.width;
        let y0 = cv.height;
        let x1 = -1;
        let y1 = -1;
        for (let y = 0; y < cv.height; y++) {
          for (let x = 0; x < cv.width; x++) {
            if (d[(y * cv.width + x) * 4 + 3] > 100) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
          }
        }
        c = x1 < 0 ? { sx: 0, sy: 0, sw: cv.width, sh: cv.height } : { sx: x0, sy: y0, sw: x1 - x0 + 1, sh: y1 - y0 + 1 };
        cores.set(img.src, c);
      }
      return c;
    }

    // A horizontal piece stretched to a width: the two ends keep their shape, the middle stretches.
    function drawBar(img, x, y, w, h) {
      const sc = Math.round(img.naturalWidth * 0.2);
      const dc = Math.min((sc * h) / img.naturalHeight, w / 2);
      ctx.drawImage(img, 0, 0, sc, img.naturalHeight, x, y, dc, h);
      ctx.drawImage(img, img.naturalWidth - sc, 0, sc, img.naturalHeight, x + w - dc, y, dc, h);
      if (w > 2 * dc) ctx.drawImage(img, sc, 0, img.naturalWidth - 2 * sc, img.naturalHeight, x + dc, y, w - 2 * dc, h);
    }

    // Draws one lane's notes. ty(tick) maps a tick to a y (holds go up); clip = [top, bottom].
    function drawLane(lane, notes, ty, lx, lw, clipTop, clipBottom, noteH, holdText) {
      const P = sprites('note');
      const sk = P && P.tap ? P : null;
      // n = D F J K, sp = Space (the game's "aflick" / "sp" pieces), l / r = shift.
      const laneKind = lane.wide ? 'sp' : (lane.track === '10' || lane.track === '11') ? (lane.label[0] === 'L' ? 'l' : 'r') : 'n';
      for (let k = 0; k < notes.length; k += 2) {
        const tick = notes[k];
        const dur = notes[k + 1] >= 256 ? notes[k + 1] >> 8 : 0;
        const flag = notes[k + 1] & 0xff; // D F J K: 1 = a hold tick (the stars along a hold bar)
        const yb = ty(tick);
        const yt = dur ? ty(tick + dur) : yb;
        if (yb < clipTop - noteH || yt > clipBottom + noteH) continue;
        let x = lx;
        let w = lw;
        let kind = laneKind;
        let span = null; // game layout: the swipe's area as [x1, x2] from its start zone to its end zone
        if (laneKind === 'l' || laneKind === 'r') {
          // The swipe's direction picks the left / right piece; in the game layout the note sits in the
          // lanes at its end zone (zone 1 = left edge of the four lanes, 9 = right edge).
          const sw = notes[k + 1] & 0xff;
          const a = Math.floor(sw / 10);
          const b = sw % 10;
          if (a >= 1 && a <= 9 && b >= 1 && b <= 9 && a !== b) {
            kind = b < a ? 'l' : 'r';
            if (state.layout === 'game' && field) {
              w = field.w / 4;
              x = Math.min(Math.max(field.x0 + ((b - 1) / 8) * field.w - w / 2, field.x0), field.x0 + field.w - w);
              if (state.swipe) {
                const half = field.w / 16;
                const xa = field.x0 + ((a - 1) / 8) * field.w;
                const xb = field.x0 + ((b - 1) / 8) * field.w;
                span = [Math.max(field.x0, Math.min(xa, xb) - half), Math.min(field.x0 + field.w, Math.max(xa, xb) + half)];
              }
            }
          }
          if (state.swipe && !span && state.layout !== 'game') drawSwipe(sw, yb, noteH >= 6);
        }
        if (sk) {
          const [tapImg, holdImg, starImg] = { n: [sk.tap, sk.hold, sk.star], sp: [sk.spTap, sk.spHold, sk.spStar], l: [sk.lTap, sk.lHold, null], r: [sk.rTap, sk.rHold, null] }[kind];
          const y1 = Math.max(yt, clipTop);
          const y2 = Math.min(yb, clipBottom);
          if (noteH < 6 && w < 10) { // full chart with very narrow lanes: small blocks in the sprite's colour (wider lanes show the sprites)
            ctx.fillStyle = tint(tapImg) || lane.color;
            if (dur && y2 > y1) { ctx.globalAlpha = 0.45; ctx.fillRect(x + 2, y1, w - 4, y2 - y1); ctx.globalAlpha = 1; }
            ctx.fillRect(span ? span[0] : x + 1, yb - noteH / 2, span ? span[1] - span[0] : w - 2, noteH);
            continue;
          }
          // A shift hold is a strip about 0.8 of a lane wide (measured on the in-game screenshots), flush with the end
          // of the swipe bar it grows from; the other holds fill the lane.
          const shiftHold = kind === 'l' || kind === 'r';
          const bw = shiftHold ? Math.max(6, w * 0.8) : kind === 'n' ? w * 0.7 : w - 4;
          const bx = shiftHold && span ? (kind === 'l' ? span[0] : span[1] - bw) : x + (w - bw) / 2;
          if (dur && holdImg && y2 > y1) {
            // The whole body at its true size, clipped to the visible part, on whole pixels: stretching only the
            // visible part made the stripes slide and the edges jag while it scrolled. In a trapezoid lane it is
            // cut into thin slices, each as wide as the lane is there.
            const cr = core(holdImg);
            ctx.save();
            ctx.beginPath();
            ctx.rect(-1e4, clipTop, 2e4, clipBottom - clipTop);
            ctx.clip();
            if (!persp) {
              ctx.drawImage(holdImg, cr.sx, cr.sy, cr.sw, cr.sh, Math.round(bx), Math.round(yt), Math.round(bw), Math.round(yb) - Math.round(yt));
            } else {
              const seg = 3;
              const total = yb - yt;
              for (let ya = Math.max(yt, clipTop - seg); ya < Math.min(yb, clipBottom + seg); ya += seg) {
                const yz = Math.min(ya + seg, yb);
                const f = at((ya + yz) / 2);
                const t0 = (ya - yt) / total;
                const t1 = (yz - yt) / total;
                ctx.drawImage(holdImg, cr.sx, cr.sy + t0 * cr.sh, cr.sw, (t1 - t0) * cr.sh, px(bx, f), ya, bw * f, yz - ya + 0.6);
              }
            }
            ctx.restore();
          }
          // D F J K and Space holds: the star marks the middle of the hold and the hold ends with a piece like its start
          // (the preview of a note skin shows caps at both ends of a hold and the star between them).
          // A D F J K note flagged 1 is a hold tick: a star on the hold bar (gold inside a Space hold), not a tap bar.
          const starPiece = kind === 'n' && flag === 1 && !dur ? (inSpaceHold(tick) && sk.spStar ? sk.spStar : sk.star) : null;
          if (dur && !shiftHold && tapImg) scaled(yt, () => { const eh = Math.min((w - 4) * tapImg.naturalHeight / tapImg.naturalWidth, 34); ctx.drawImage(tapImg, x + 2, yt - eh / 2, w - 4, eh); });
          scaled(yb, () => {
            if (starPiece) {
              const sw = Math.min(w * 0.8, 60);
              const sh = sw * starPiece.naturalHeight / starPiece.naturalWidth;
              ctx.drawImage(starPiece, x + w / 2 - sw / 2, yb - sh / 2, sw, sh);
              return;
            }
            if (kind === 'n' && sk.glow) { const gw = w + 8; const gh = gw * sk.glow.naturalHeight / sk.glow.naturalWidth; ctx.drawImage(sk.glow, x - 4, yb - gh / 2, gw, gh); }
            if (tapImg) {
              const th = Math.min((w - 4) * tapImg.naturalHeight / tapImg.naturalWidth, 34);
              if (span) drawBar(tapImg, span[0] + 2, yb - th / 2, span[1] - span[0] - 4, th);
              else ctx.drawImage(tapImg, x + 2, yb - th / 2, w - 4, th);
              const arrow = { sp: sk.spArrow, l: sk.lArrow, r: sk.rArrow }[kind];
              if (arrow) {
                const ah = Math.min(th * 0.9, 30);
                const aw = ah * arrow.naturalWidth / arrow.naturalHeight;
                // On a swipe area the arrow sits at the end the swipe goes to.
                const ax = span ? (kind === 'l' ? span[0] + aw / 2 + 8 : span[1] - aw / 2 - 8) : x + w / 2;
                ctx.drawImage(arrow, ax - aw / 2, yb - ah / 2, aw, ah);
              }
            }
          });
          continue;
        }
        ctx.fillStyle = lane.color;
        if (dur) {
          ctx.globalAlpha = 0.45;
          const hy1 = Math.max(yt, clipTop);
          const hy2 = Math.min(yb, clipBottom);
          if (persp) {
            const f1 = at(hy1);
            const f2 = at(hy2);
            ctx.beginPath();
            ctx.moveTo(px(x + 2, f1), hy1); ctx.lineTo(px(x + w - 2, f1), hy1); ctx.lineTo(px(x + w - 2, f2), hy2); ctx.lineTo(px(x + 2, f2), hy2);
            ctx.closePath();
            ctx.fill();
          } else ctx.fillRect(x + 2, hy1, w - 4, hy2 - hy1);
          ctx.globalAlpha = 1;
        }
        scaled(yb, () => {
          if (span) {
            const bh = noteH >= 6 ? Math.min(30, noteH * 2.4) : noteH;
            ctx.fillRect(span[0] + 1, yb - bh / 2, span[1] - span[0] - 2, bh);
            if (noteH >= 6) {
              const dir = kind === 'l' ? -1 : 1;
              const ax = kind === 'l' ? span[0] + 14 : span[1] - 14;
              ctx.fillStyle = 'rgba(255,255,255,.9)';
              ctx.beginPath(); ctx.moveTo(ax + dir * 6, yb); ctx.lineTo(ax - dir * 4, yb - 7); ctx.lineTo(ax - dir * 4, yb + 7); ctx.closePath(); ctx.fill();
            }
          } else {
            ctx.fillRect(x + 1, yb - noteH / 2, w - 2, noteH);
            if (flag === 1 && kind === 'n') { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(x + 1.5, yb - noteH / 2 + 0.5, w - 3, noteH - 1); }
          }
        });
        if (dur && holdText) { ctx.fillStyle = '#fff'; ctx.font = '10px system-ui'; ctx.fillText(`${dur}t`, x + w / 2 - 8, yt + 11); }
      }
    }

    function drawFull() {
      persp = null;
      const { chart } = state.diff;
      const { lanes, width } = layoutOf(state.layout, state.swap);
      const z = state.zoom / 100;
      const unit = 12 * z;
      const colW = width * unit;
      const gap = 26;
      const pxBeat = 5 * state.vzoom / 100;
      const colTicks = state.barsPerCol * TICKS_PER_BAR;
      const colH = state.barsPerCol * 4 * pxBeat;
      const totalCols = Math.max(1, Math.ceil(chart.e / colTicks));
      const cssW = canvas.parentElement.clientWidth || 800;
      const perRow = Math.max(1, Math.floor((cssW - 10) / (colW + gap)));
      const rows = Math.ceil(totalCols / perRow);
      const rowH = colH + 44;
      size(rows * rowH + 10);
      ctx.fillStyle = '#15151a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let c = 0; c < totalCols; c++) {
        const row = Math.floor(c / perRow);
        const x0 = 10 + (c % perRow) * (colW + gap);
        const yBottom = row * rowH + 24 + colH;
        const yTop = yBottom - colH;
        if (!drawStage(x0, yTop, colW, colH)) { ctx.fillStyle = '#1d1d25'; ctx.fillRect(x0, yTop, colW, colH); }
        ctx.font = '10px system-ui';
        for (let b = 0; b <= state.barsPerCol * 4; b++) {
          const y = yBottom - b * pxBeat;
          ctx.strokeStyle = b % 4 === 0 ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.07)';
          ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + colW, y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255,255,255,.55)';
        ctx.fillText(`bar ${c * state.barsPerCol + 1}  ${fmtTime(tickToSec(tmap, c * colTicks))}`, x0, yBottom + 13);
        const ty = (tick) => yBottom - ((tick - c * colTicks) / TICKS_PER_BEAT) * pxBeat;
        field = { x0, w: colW };
        // Wide Space notes first so lane notes sit on top.
        [...lanes].sort((a, b) => (b.wide ? 1 : 0) - (a.wide ? 1 : 0)).forEach((lane) => {
          const notes = chart.n[lane.track];
          if (notes) drawLane(lane, notes, ty, x0 + lane.x * unit, lane.w * unit, yTop, yBottom, 3, false);
        });
      }
      $('.tc-info').textContent = `${state.diff.difficulty} · ${totalCols} columns × ${state.barsPerCol} bars · ${laneNoteCount()} notes`;
    }

    function laneNoteCount() {
      return ['3', '4', '5', '6', '7', '10', '11'].reduce((n, t) => n + (state.diff.chart.n[t] || []).length / 2, 0);
    }

    function drawPlay() {
      const { chart } = state.diff;
      const { lanes, width } = layoutOf(state.layout, state.swap);
      const H = state.laneH;
      const cssW = size(H);
      const unit = Math.min(cssW / (width + 1), 96);
      const x0 = (cssW - width * unit) / 2;
      const hit = H - state.hitOff;
      const top = 14;
      const ct = secToTick(tmap, state.t + state.offset);
      const pxBeat = state.speed;
      const ty = (tick) => hit - ((tick - ct) / TICKS_PER_BEAT) * pxBeat;
      ctx.fillStyle = '#15151a';
      ctx.fillRect(0, 0, cssW, H);
      persp = state.topW === 100 && state.botW === 100 ? null : { cx: x0 + (width * unit) / 2, top, hit, ft: state.topW / 100, fb: state.botW / 100 };
      const fbv = persp ? persp.fb : 1;
      const staged = drawStage(0, 0, cssW, H);
      const bg = sprites('bg');
      const visible = lanes.filter((l) => !l.swipe);
      const normal = lanes.filter((l) => !l.wide && l.track !== '10' && l.track !== '11' && !l.swipe);
      const lx0 = normal.length ? Math.min(...normal.map((l) => l.x)) : 0;
      const lx1 = normal.length ? Math.max(...normal.map((l) => l.x + l.w)) : 0;
      // The dark track behind the lanes (opacity slider), in the lane's shape.
      ctx.save();
      ctx.globalAlpha = state.laneA / 100;
      if (bg?.lane && normal.length) {
        visible.filter((l) => !l.wide && !normal.includes(l)).forEach((l) => { ctx.fillStyle = 'rgba(0,0,0,.35)'; trapFill(x0 + l.x * unit, x0 + (l.x + l.w) * unit, top, hit); });
        drawTrap(bg.lane, x0 + lx0 * unit, x0 + lx1 * unit, top, hit + 30);
      } else {
        visible.filter((l) => !l.wide).forEach((l, i) => { ctx.fillStyle = staged ? (i % 2 ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.04)') : (i % 2 ? '#1c1c23' : '#21212a'); trapFill(x0 + l.x * unit, x0 + (l.x + l.w) * unit, top, hit); });
      }
      ctx.restore();
      if (bg?.lane && bg.line && normal.length) [...normal.map((l) => l.x), lx1].forEach((lx) => drawTrap(bg.line, x0 + lx * unit - 6, x0 + lx * unit + 6, top, hit));
      // The chosen character stands beside the highway when there is room, bobbing while it plays.
      const chSkin = skinOf('ch');
      const chImg = chSkin && skinImg(chSkin.preview, draw);
      if (chImg) {
        const gap = x0 - 28;
        const h = Math.min(260, H - 40, (gap - 16) * chImg.naturalHeight / chImg.naturalWidth);
        if (h >= 110) {
          const w = h * chImg.naturalWidth / chImg.naturalHeight;
          ctx.drawImage(chImg, x0 + width * unit + 28 + Math.min(16, (gap - w) / 2), H - h - 8 + (state.playing ? Math.sin(state.t * 6) * 4 : 0), w, h);
        }
      }
      const b0 = Math.floor(ct / TICKS_PER_BEAT) - 1;
      const b1 = Math.ceil(ct / TICKS_PER_BEAT + (hit - top) / pxBeat) + 1;
      ctx.font = '11px system-ui';
      for (let b = b0; b <= b1; b++) {
        const y = ty(b * TICKS_PER_BEAT);
        if (b < 0 || y < top || y > hit + 30) continue;
        ctx.strokeStyle = b % 4 === 0 ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.08)';
        const bf = at(y);
        ctx.beginPath(); ctx.moveTo(px(x0, bf), y); ctx.lineTo(px(x0 + width * unit, bf), y); ctx.stroke();
        if (b % 4 === 0) { ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillText(`bar ${b / 4 + 1}`, 6, y - 2); }
      }
      field = { x0, w: width * unit };
      [...lanes].sort((a, b) => (b.wide ? 1 : 0) - (a.wide ? 1 : 0)).forEach((lane) => {
        const notes = chart.n[lane.track];
        if (notes) drawLane(lane, notes, ty, x0 + lane.x * unit, lane.w * unit, top, hit + 20, 12, false);
      });
      if (bg?.judge) {
        const jw = (width * unit + 16) * fbv;
        const jh = Math.min(30, jw * bg.judge.naturalHeight / bg.judge.naturalWidth);
        ctx.drawImage(bg.judge, px(x0 - 8, fbv), hit - jh / 2, jw, jh);
      } else {
        ctx.fillStyle = 'rgba(255,170,60,.95)';
        ctx.fillRect(px(x0 - 8, fbv), hit - 1, (width * unit + 16) * fbv, 3);
      }
      ctx.fillStyle = 'rgba(255,255,255,.6)';
      ctx.font = '13px system-ui';
      visible.filter((l) => !l.wide).concat(visible.filter((l) => l.wide)).forEach((l) => {
        const cx = px(x0 + l.x * unit + (l.w * unit) / 2, fbv);
        if (bg?.keycap && normal.includes(l)) {
          // Key caps carry the key letter.
          const ks = Math.min(unit * 0.8, 52) * Math.min(fbv, 1.3);
          const kr = Math.min(ks / bg.keycap.naturalWidth, (ks + 8) / bg.keycap.naturalHeight);
          const kw = bg.keycap.naturalWidth * kr;
          const kh = bg.keycap.naturalHeight * kr;
          ctx.drawImage(bg.keycap, cx - kw / 2, hit + 10, kw, kh);
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.fillText(l.label, cx, hit + 10 + kh / 2 + 5);
          ctx.textAlign = 'left';
          ctx.fillStyle = 'rgba(255,255,255,.6)';
        } else {
          ctx.fillText(l.label, cx - (l.label.length * 3.4), hit + 24 + (l.wide ? 20 : 0));
        }
      });
      const len = tickToSec(tmap, chart.e);
      $('.tc-info').textContent = `${fmtTime(state.t)} / ${fmtTime(len)} · bar ${Math.floor(ct / TICKS_PER_BAR) + 1} · ${laneNoteCount()} notes`;
      $('.tc-seek').value = Math.round((state.t / len) * 1000);
    }

    const draw = () => (state.view === 'full' ? drawFull() : drawPlay());
    function tick(ts) {
      if (!state.playing || !root.isConnected) { state.playing = false; return; }
      state.t += ((ts - state.last) / 1000) * state.rate;
      state.last = ts;
      if (state.t > tickToSec(tmap, state.diff.chart.e)) state.t = 0;
      drawPlay();
      requestAnimationFrame(tick);
    }

    root.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.diff) { state.diff = data.diffs.find((d) => d.difficulty === b.dataset.diff); tmap = tempoMap(state.diff.chart); state.t = 0; }
      else if (b.closest('[data-group=view]')) { state.view = b.dataset.v; state.playing = false; }
      else if (b.closest('[data-group=layout]')) state.layout = b.dataset.v;
      else if (b.dataset.act === 'play') { state.playing = !state.playing; state.last = performance.now(); if (state.playing) requestAnimationFrame(tick); }
      else if (b.dataset.act === 'restart') state.t = 0;
      else if (b.dataset.act === 'lanereset') { Object.assign(state, { laneH: 520, hitOff: 70, topW: 100, botW: 100, laneA: 100 }); syncLane(); }
      sync(); draw();
    });
    root.addEventListener('input', (e) => {
      const o = e.target.dataset.opt;
      if (e.target.classList.contains('tc-seek')) { state.t = (e.target.value / 1000) * tickToSec(tmap, state.diff.chart.e); return draw(); }
      if (e.target.dataset.skin) {
        state.skin[e.target.dataset.skin] = Number(e.target.value);
        store.set('ttsSkin2', state.skin);
        sync();
        return draw();
      }
      if (!o) return;
      if (o === 'swap') state.swap = e.target.checked;
      if (o === 'swipe') state.swipe = e.target.checked;
      if (o === 'zoom') { state.zoom = Number(e.target.value); const zv = $('.tc-zv'); if (zv) zv.textContent = state.zoom + '%'; }
      if (o === 'vzoom') { state.vzoom = Number(e.target.value); const vv = $('.tc-vv'); if (vv) vv.textContent = state.vzoom + '%'; }
      if (o === 'bars') state.barsPerCol = Number(e.target.value);
      if (o === 'speed') state.speed = Number(e.target.value);
      if (o === 'rate') state.rate = Number(e.target.value);
      if (o === 'offset') state.offset = Number(e.target.value) || 0;
      if (LANE_KEYS[o]) { state[LANE_KEYS[o]] = Number(e.target.value); syncLane(); }
      draw();
    });
    const onResize = () => { if (!root.isConnected) return window.removeEventListener('resize', onResize); draw(); };
    window.addEventListener('resize', onResize);
    sync();
    draw();
  }

  return { mount };
})();
