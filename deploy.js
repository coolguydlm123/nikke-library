// Publishes dist/ (from build-static.js) to the gh-pages branch as a single fresh commit,
// so old data snapshots don't pile up in the repo history.
//   node deploy.js
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const GIT_DIR = path.join(__dirname, '.pages.git');
if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error('dist/ is empty: run "npm run build" first');
const remote = execFileSync('git', ['remote', 'get-url', 'origin'], { cwd: __dirname, encoding: 'utf8' }).trim();
const git = (...args) => execFileSync('git', [`--git-dir=${GIT_DIR}`, `--work-tree=${DIST}`, ...args], { stdio: 'inherit' });

fs.rmSync(GIT_DIR, { recursive: true, force: true });
git('init', '-q', '-b', 'gh-pages');
git('add', '-A');
git('commit', '-q', '-m', `Site build ${new Date().toISOString().slice(0, 10)}`);
git('push', '--force', remote, 'gh-pages');
fs.rmSync(GIT_DIR, { recursive: true, force: true });
console.log('Pushed dist/ to gh-pages');
