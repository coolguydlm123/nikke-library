# Nikke Library

A browser for datamined GODDESS OF VICTORY: NIKKE data: stories, campaign and tower stages,
raids, characters (with a CP calculator), minigames, progression and the jukebox.

**Live site:** https://coolguydlm123.github.io/nikke-library/

Fan project, not affiliated with SHIFT UP or Level Infinite. Game text and data belong to their owners.

## Run locally

Needs Node.js 18+ and no npm packages.

1. Set the paths in `config.json`:
   - `dataDir`: JSON tables exported by the mpk parser
   - `mpksDir`, `typesFile`: the parser's mpks folder and `customTypes.txt`
   - `localeDir`: decrypted locale JSON from nikke-downloader
   - `waveSpawnDir`: wave spawn JSON from nikke-downloader's `wavedata.py`
2. `npm start` (or `start.bat` on Windows) and open http://localhost:4170

## Publish the static site

The GitHub Pages site has no server: every API response is pre-built as a JSON file.

```
npm run build    # writes dist/
npm run deploy   # pushes dist/ to the gh-pages branch (one fresh commit each time)
```

## Layout

- `server.js`: local server
- `lib/`: data libraries; `lib/api.js` holds the API routes, used by both the server and the static build
- `public/`: front end
- `build-static.js`, `deploy.js`: static export and publish
