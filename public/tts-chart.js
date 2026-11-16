// Tracing the Stars chart viewer: full chart (the whole song in columns) and a playback
// highway, in the game's layout or as 7 equal keys. Data from /api/tts/chart (nikke-downloader/tts-charts.json).
// Chart format: ticks (48 per beat, 192 per bar); tracks 3,4,6,7 = D F J K, 5 = Space, 10/11 = shift notes;
// each note is (tick, extra); a hold lasts extra >> 8 ticks. Lane order and shift sides are inferred, not verified.
window.TtsChart = (() => {
  const COLORS = { D: '#8f86e8', F: '#3fbf95', J: '#5aa5ee', K: '#e66f9a', S: '#f2c230', L: '#8ad23a', R: '#e255d6' };
  const DIFF_CLASS = { Casual: 'casual', Normal: 'normal', Hard: 'hard', Expert: 'expert' };
  const TICKS_PER_BEAT = 48;
  const TICKS_PER_BAR = 192;

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
    return {
      width: 6,
      lanes: [
        { track: shiftL, label: 'L Shift', color: COLORS.L, x: 0, w: 0.9 },
        { track: '3', label: 'D', color: COLORS.D, x: 1, w: 1 },
        { track: '4', label: 'F', color: COLORS.F, x: 2, w: 1 },
        { track: '6', label: 'J', color: COLORS.J, x: 3, w: 1 },
        { track: '7', label: 'K', color: COLORS.K, x: 4, w: 1 },
        { track: '5', label: 'Space', color: COLORS.S, x: 1, w: 4, wide: true },
        { track: shiftR, label: 'R Shift', color: COLORS.R, x: 5.1, w: 0.9 },
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
      view: 'full', layout: '7k', swap: false, barsPerCol: 16, zoom: 100, speed: 170, rate: 1, offset: 0,
      t: 0, playing: false, last: 0,
    };
    root.innerHTML = `
      <div class="tc">
        <div class="tc-row tc-diffs"></div>
        <div class="tc-row">
          <span class="tc-group" data-group="view"><button data-v="full">Full chart</button><button data-v="play">Playback</button></span>
          <span class="tc-group" data-group="layout"><button data-v="game">Game layout</button><button data-v="7k">7K</button></span>
          <label class="tc-opt" title="Which of the two shift tracks is left is a guess"><input type="checkbox" data-opt="swap"> swap shift sides</label>
          <label class="tc-opt tc-full-only">Bars per column <select data-opt="bars"><option>4</option><option>8</option><option selected>16</option><option>32</option></select></label>
          <label class="tc-opt tc-full-only">Zoom <input type="range" data-opt="zoom" min="50" max="400" step="10" value="100" style="width:110px"> <span class="tc-zv">100%</span></label>
          <span class="tc-info key"></span>
        </div>
        <div class="tc-row tc-play-only">
          <button data-act="play">Play</button><button data-act="restart">Restart</button>
          <label class="tc-opt">Speed <input type="range" data-opt="speed" min="60" max="400" value="170"></label>
          <label class="tc-opt">Rate <select data-opt="rate"><option>0.25</option><option>0.5</option><option>0.75</option><option selected>1</option></select></label>
          <label class="tc-opt">Offset (s) <input type="number" data-opt="offset" step="0.05" value="0"></label>
        </div>
        <canvas class="tc-canvas"></canvas>
        <input type="range" class="tc-seek tc-play-only" min="0" max="1000" value="0" aria-label="Seek">
        <p class="key tc-note">Notes: D F J K lanes, Space (wide), L/R Shift. Holds are drawn as bars (length = the note's extra &gt;&gt; 8 ticks). Lane order, which shift track is left, and hold lengths are inferred from the data and not verified in game.</p>
      </div>`;
    const $ = (sel) => root.querySelector(sel);
    const canvas = $('.tc-canvas');
    const ctx = canvas.getContext('2d');
    let tmap = tempoMap(state.diff.chart);

    // Difficulty tabs.
    const diffBox = $('.tc-diffs');
    diffBox.innerHTML = `<span class="key">${data.name}</span>` + data.diffs.map((d) => `<button data-diff="${d.difficulty}" class="lv lv-${DIFF_CLASS[d.difficulty]}">${d.difficulty} Lv ${d.level}</button>`).join('');

    function sync() {
      root.querySelectorAll('[data-diff]').forEach((b) => b.classList.toggle('is-on', b.dataset.diff === state.diff.difficulty));
      root.querySelectorAll('[data-group=view] button').forEach((b) => b.classList.toggle('is-on', b.dataset.v === state.view));
      root.querySelectorAll('[data-group=layout] button').forEach((b) => b.classList.toggle('is-on', b.dataset.v === state.layout));
      root.querySelectorAll('.tc-play-only').forEach((e) => { e.style.display = state.view === 'play' ? '' : 'none'; });
      root.querySelectorAll('.tc-full-only').forEach((e) => { e.style.display = state.view === 'full' ? '' : 'none'; });
      $('[data-act=play]').textContent = state.playing ? 'Pause' : 'Play';
    }

    function size(cssH) {
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.parentElement.clientWidth || 800;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return cssW;
    }

    // Draws one lane's notes. ty(tick) maps a tick to a y (holds go up); clip = [top, bottom].
    function drawLane(lane, notes, ty, x, w, clipTop, clipBottom, noteH, holdText) {
      for (let k = 0; k < notes.length; k += 2) {
        const tick = notes[k];
        const dur = notes[k + 1] >= 256 ? notes[k + 1] >> 8 : 0;
        const yb = ty(tick);
        const yt = dur ? ty(tick + dur) : yb;
        if (yb < clipTop - noteH || yt > clipBottom + noteH) continue;
        ctx.fillStyle = lane.color;
        if (dur) {
          ctx.globalAlpha = 0.45;
          ctx.fillRect(x + 2, Math.max(yt, clipTop), w - 4, Math.min(yb, clipBottom) - Math.max(yt, clipTop));
          ctx.globalAlpha = 1;
        }
        ctx.fillRect(x + 1, yb - noteH / 2, w - 2, noteH);
        if (dur && holdText) { ctx.fillStyle = '#fff'; ctx.font = '10px system-ui'; ctx.fillText(`${dur}t`, x + w / 2 - 8, yt + 11); }
      }
    }

    function drawFull() {
      const { chart } = state.diff;
      const { lanes, width } = layoutOf(state.layout, state.swap);
      const z = state.zoom / 100;
      const unit = 12 * z;
      const colW = width * unit;
      const gap = 26;
      const pxBeat = 5 * z;
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
        ctx.fillStyle = '#1d1d25';
        ctx.fillRect(x0, yTop, colW, colH);
        ctx.font = '10px system-ui';
        for (let b = 0; b <= state.barsPerCol * 4; b++) {
          const y = yBottom - b * pxBeat;
          ctx.strokeStyle = b % 4 === 0 ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.07)';
          ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + colW, y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255,255,255,.55)';
        ctx.fillText(`bar ${c * state.barsPerCol + 1}  ${fmtTime(tickToSec(tmap, c * colTicks))}`, x0, yBottom + 13);
        const ty = (tick) => yBottom - ((tick - c * colTicks) / TICKS_PER_BEAT) * pxBeat;
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
      const H = 520;
      const cssW = size(H);
      const unit = Math.min(cssW / (width + 1), 96);
      const x0 = (cssW - width * unit) / 2;
      const hit = H - 70;
      const top = 14;
      const ct = secToTick(tmap, state.t + state.offset);
      const pxBeat = state.speed;
      const ty = (tick) => hit - ((tick - ct) / TICKS_PER_BEAT) * pxBeat;
      ctx.fillStyle = '#15151a';
      ctx.fillRect(0, 0, cssW, H);
      lanes.filter((l) => !l.wide).forEach((l, i) => { ctx.fillStyle = i % 2 ? '#1c1c23' : '#21212a'; ctx.fillRect(x0 + l.x * unit, top, l.w * unit, hit - top); });
      const b0 = Math.floor(ct / TICKS_PER_BEAT) - 1;
      const b1 = Math.ceil(ct / TICKS_PER_BEAT + (hit - top) / pxBeat) + 1;
      ctx.font = '11px system-ui';
      for (let b = b0; b <= b1; b++) {
        const y = ty(b * TICKS_PER_BEAT);
        if (b < 0 || y < top || y > hit + 30) continue;
        ctx.strokeStyle = b % 4 === 0 ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.08)';
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + width * unit, y); ctx.stroke();
        if (b % 4 === 0) { ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillText(`bar ${b / 4 + 1}`, 6, y - 2); }
      }
      [...lanes].sort((a, b) => (b.wide ? 1 : 0) - (a.wide ? 1 : 0)).forEach((lane) => {
        const notes = chart.n[lane.track];
        if (notes) drawLane(lane, notes, ty, x0 + lane.x * unit, lane.w * unit, top, hit + 20, 12, false);
      });
      ctx.fillStyle = 'rgba(255,170,60,.95)';
      ctx.fillRect(x0 - 8, hit - 1, width * unit + 16, 3);
      ctx.fillStyle = 'rgba(255,255,255,.6)';
      ctx.font = '13px system-ui';
      lanes.filter((l) => !l.wide).concat(lanes.filter((l) => l.wide)).forEach((l, i) => {
        ctx.fillText(l.label, x0 + l.x * unit + (l.w * unit) / 2 - (l.label.length * 3.4), hit + 24 + (l.wide ? 20 : 0));
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
      sync(); draw();
    });
    root.addEventListener('input', (e) => {
      const o = e.target.dataset.opt;
      if (e.target.classList.contains('tc-seek')) { state.t = (e.target.value / 1000) * tickToSec(tmap, state.diff.chart.e); return draw(); }
      if (!o) return;
      if (o === 'swap') state.swap = e.target.checked;
      if (o === 'zoom') { state.zoom = Number(e.target.value); const zv = $('.tc-zv'); if (zv) zv.textContent = state.zoom + '%'; }
      if (o === 'bars') state.barsPerCol = Number(e.target.value);
      if (o === 'speed') state.speed = Number(e.target.value);
      if (o === 'rate') state.rate = Number(e.target.value);
      if (o === 'offset') state.offset = Number(e.target.value) || 0;
      draw();
    });
    const onResize = () => { if (!root.isConnected) return window.removeEventListener('resize', onResize); draw(); };
    window.addEventListener('resize', onResize);
    sync();
    draw();
  }

  return { mount };
})();
