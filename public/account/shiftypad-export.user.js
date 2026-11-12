// ==UserScript==
// @name         Nikke Library: Shiftypad export
// @namespace    https://coolguydlm123.github.io/nikke-library/
// @version      1.0.2
// @description  Adds an "Export to Nikke Library" button to your own Blablalink Shiftypad page. One click reads your Nikkes (read-only, slowly) and gives you one JSON for the library's My Nikkes page.
// @match        https://www.blablalink.com/shiftyspad*
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL  https://coolguydlm123.github.io/nikke-library/account/shiftypad-export.user.js
// @updateURL    https://coolguydlm123.github.io/nikke-library/account/shiftypad-export.user.js
// ==/UserScript==

// Nothing is sent anywhere: the script talks only to Shiftypad's own API, with your own login, the
// same calls the page makes itself. The JSON holds game progress only (no name, UID or login data).
// It is copied to the clipboard and saved as nikke-account.json; paste or drop it on the library's
// Characters > My Nikkes page.
(() => {
  'use strict';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const API = 'https://api.blablalink.com/api/game/proxy/Game/';

  async function runExport(say) {
    const post = async (name, body = {}) => {
      for (let wait = 4000, tries = 0; tries < 6; tries++, wait += 4000) {
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), 25000); // never hang on one request
        let j;
        try {
          const res = await fetch(API + name, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
          j = await res.json();
        } catch (e) {
          throw new Error(`${name}: ${e.name === 'AbortError' ? 'no answer within 25 s' : e.message}`);
        } finally { clearTimeout(timer); }
        if (j.code === 0) return j.data;
        if (j.code === 1300018) { say(`Shiftypad asks to slow down, waiting ${wait / 1000} s (try ${tries + 1}/6)...`); await sleep(wait); continue; }
        throw new Error(`${name}: code ${j.code} ${j.msg}`);
      }
      throw new Error(`${name}: still rate limited, try again in a few minutes`);
    };

    // Your game account id comes from the signed-in Blablalink account, so your own Shiftypad page needs no
    // ?uid=. (The page's ?uid= is the same thing, base64 of "<server>-<open id>"; used if the lookup fails.)
    const findOpenId = async () => {
      try {
        const res = await fetch('https://api.blablalink.com/api/ugc/proxy/standalonesite/User/GetUserInfoNew', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        const id = (await res.json()).data?.info?.intl_openid;
        if (id) return String(id).split('-').pop();
      } catch { /* fall back to the address */ }
      const uid = new URLSearchParams(location.search).get('uid');
      if (uid) return atob(decodeURIComponent(uid)).split('-')[1];
      throw new Error('Could not find your account. Are you logged in to Blablalink?');
    };
    const openId = await findOpenId();
    say('Step 1/4: finding your game account...');
    const { role_info: role } = await post('GetSavedRoleInfo');
    const base = { intl_open_id: openId, nikke_area_id: Number(role.area_id) };

    say('Step 2/4: reading your Nikke list...');
    const roster = (await post('GetUserCharacters', base)).characters;
    const details = new Map();
    for (let i = 0; i < roster.length; i += 20) {
      const part = await post('GetUserCharacterDetails', { ...base, name_codes: roster.slice(i, i + 20).map((c) => c.name_code) });
      for (const d of part.character_details) details.set(d.name_code, d);
      say(`Step 3/4: Nikke details ${Math.min(i + 20, roster.length)}/${roster.length}`);
      await sleep(1200);
    }
    say('Step 4/4: reading account summary...');
    const basic = (await post('GetUserProfileBasicInfo', base)).basic_info;
    await sleep(1200);
    const outpost = (await post('GetUserProfileOutpostInfo', base)).outpost_info;

    const pick = (o, keys) => Object.fromEntries(keys.filter((k) => k in o).map((k) => [k, o[k]]));
    return {
      v: 1,
      source: 'shiftypad',
      exportedAt: new Date().toISOString(),
      profile: {
        ...pick(basic, ['lv', 'created_at', 'character_count', 'character_costume_count', 'corporation_character_counts', 'currencies',
          'progress_normal_campaign', 'progress_hard_campaign', 'progress_easy_campaign', 'progress_tribe_tower', 'progress_elysion_tower',
          'progress_missilis_tower', 'progress_tetra_tower', 'progress_pilgrim_tower', 'team_combat', 'profile_team',
          'sim_room_overclock_current_sub_season_high_score', 'sim_room_overclock_latest_season_high_score', 'sim_room_overclock_high_score_history']),
        ...pick(outpost, ['synchro_level', 'synchro_nonempty_slot_count', 'outpost_battle_level', 'infra_core_level', 'jukebox_count',
          'tactic_academy_class', 'tactic_academy_lesson', 'recycle_room_researches']),
      },
      // the roster row (level, core, grade, costume, power) plus the detail row (skills, bond, gear, cube, favorite item)
      characters: roster.map((r) => ({ ...(details.get(r.name_code) || {}), ...r })), // roster wins: the detail row's lv is always 1
    };
  }

  // Tests (node) use runExport only; in the browser this file just adds the button.
  if (typeof module !== 'undefined') { module.exports = { runExport }; return; }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Export to Nikke Library';
  btn.style.cssText = 'position:fixed;z-index:2147483647;right:12px;bottom:12px;padding:10px 14px;border:0;border-radius:10px;font:600 13px/1.3 sans-serif;color:#fff;background:#1d3a8a;box-shadow:0 2px 12px #0009;cursor:pointer;max-width:280px;text-align:left';
  document.body.appendChild(btn);
  const say = (msg, color) => { btn.textContent = '[Nikke Library] ' + msg; if (color) btn.style.background = color; };

  let busy = false;
  btn.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    try {
      say('Started. Reading your account...', '#1d3a8a');
      const account = await runExport(say);
      const text = JSON.stringify(account);
      const kb = Math.round(text.length / 1024);
      try { GM_setClipboard(text, 'text'); } catch { /* the file below still works */ }
      const a = document.createElement('a'); // inside a click: browsers allow this download
      a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      a.download = 'nikke-account.json';
      document.body.appendChild(a); a.click(); a.remove();
      say(`Done: ${account.characters.length} Nikkes (${kb} KB), copied and saved as nikke-account.json. Paste or drop it on My Nikkes. Click to export again.`, '#14633b');
    } catch (e) {
      say('Stopped: ' + e.message + ' (click to retry)', '#8a1d1d');
    } finally { busy = false; }
  });
})();
