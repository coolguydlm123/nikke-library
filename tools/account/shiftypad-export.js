// Nikke Library: export your own account from Blablalink Shiftypad.
//
// Run it on YOUR Shiftypad page while logged in (your own page, logged in): paste it into
// the browser console (DevTools -> Console), or save it as a bookmarklet. It reads your Nikkes
// through the same Shiftypad API calls the page itself makes, slowly (Shiftypad rate-limits
// bursts), and hands back one JSON text: copied to the clipboard, or saved as
// nikke-account.json if the browser refuses the clipboard. Paste or drop that into the
// Import box on the library's Characters > My Nikkes page.
//
// A small status box appears at the top left of the Shiftypad page and shows each step.
// Nothing is sent anywhere. The JSON holds game progress only: no name, UID or login data.
(async () => {
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;z-index:2147483647;top:8px;left:8px;max-width:340px;padding:8px 12px;border-radius:8px;font:13px/1.4 sans-serif;color:#fff;background:#1d3a8a;box-shadow:0 2px 12px #0008';
  document.body.appendChild(box);
  const say = (msg, color) => { console.log('[Nikke Library] ' + msg); box.textContent = '[Nikke Library] ' + msg; if (color) box.style.background = color; };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  try {
    say('Started. Reading your account...');
    const API = 'https://api.blablalink.com/api/game/proxy/Game/';
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
        throw new Error(`${name}: code ${j.code} ${j.msg}${j.code === 1000 || /login/i.test(j.msg || '') ? ' (are you logged in?)' : ''}`);
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
    const account = {
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

    const text = JSON.stringify(account);
    window.__nikkeAccount = text; // fallback: copy this from the console with copy(window.__nikkeAccount)
    const kb = Math.round(text.length / 1024);
    let copied = false;
    try { // some browsers wait for a permission prompt here: don't wait longer than 4 s
      await Promise.race([navigator.clipboard.writeText(text).then(() => { copied = true; }), sleep(4000)]);
    } catch { /* fall through to the file */ }
    if (copied) {
      say(`Done. Copied ${account.characters.length} Nikkes (${kb} KB). Paste it into the Nikke Library import box.`, '#14633b');
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      a.download = 'nikke-account.json';
      a.click();
      say(`Done. Saved nikke-account.json (${account.characters.length} Nikkes, ${kb} KB). Drop it onto the Nikke Library import box.`, '#14633b');
    }
    setTimeout(() => box.remove(), 60000);
    return account.characters.length;
  } catch (e) {
    say('Stopped: ' + e.message, '#8a1d1d');
    throw e;
  }
})();
