// Locale loader. Text in the dialog tables is referenced by keys such as
// "Locale_MainScenario:d_main_01_01_e_1" (<table>:<key>). Until a locale
// directory is configured every lookup returns null and the UI shows keys.
//
// The exact shape of the locale dump is not known yet, so this accepts the
// common shapes and will be tightened once real files are available:
//   { records: [ { key|id: "...", en|text|value: "..." } ] }
//   { "<key>": "<text>" }
const fs = require('fs');
const path = require('path');

const TEXT_FIELDS = ['text', 'value', 'en', 'ko', 'ja'];

function pickText(rec, language) {
  if (typeof rec[language] === 'string') return rec[language];
  for (const f of TEXT_FIELDS) if (typeof rec[f] === 'string') return rec[f];
  return null;
}

function loadLocale(dir, language) {
  const map = new Map();
  if (!dir || !fs.existsSync(dir)) return map;
  const walk = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) { walk(p); continue; }
      if (!ent.name.endsWith('.json')) continue;
      const table = ent.name.replace(/\.json$/, '').split('.')[0];
      let json;
      try { json = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
      if (Array.isArray(json.records)) {
        for (const rec of json.records) {
          const key = rec.key ?? rec.id;
          const text = pickText(rec, language);
          if (key != null && text != null) map.set(`${table}:${key}`, text);
        }
      } else if (json && typeof json === 'object') {
        for (const [key, text] of Object.entries(json)) {
          if (typeof text === 'string') map.set(`${table}:${key}`, text);
        }
      }
    }
  };
  walk(dir);
  return map;
}

module.exports = { loadLocale };
