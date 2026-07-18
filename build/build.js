// Assembles ../index.html from ../index.template.html + fonts + course data.
// Run: node build/build.js   (from the repo root)
// Then bump the CACHE name in sw.js before deploying.
const fs = require('fs');
const path = require('path');
const B = __dirname;
const REPO = path.join(B, '..');

const faces = [];
const face = (fam, w, file) => {
  const b64 = fs.readFileSync(path.join(B, file)).toString('base64');
  faces.push(`@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2');}`);
};
face('JetBrains Mono', 400, 'jbm-400.woff2');
face('JetBrains Mono', 500, 'jbm-500.woff2');
face('JetBrains Mono', 700, 'jbm-700.woff2');

const course = fs.readFileSync(path.join(B, 'course_data.js'), 'utf8');
let html = fs.readFileSync(path.join(REPO, 'index.template.html'), 'utf8');
if (!html.includes('/*__FONTS__*/') || !html.includes('/*__COURSE_DATA__*/')) {
  console.error('placeholders missing'); process.exit(1);
}
html = html.replace('/*__FONTS__*/', faces.join('\n'));
html = html.replace('/*__COURSE_DATA__*/', course);
const elevPath = path.join(B, 'elev_data.js');
html = html.replace('/*__ELEV__*/', fs.existsSync(elevPath) ? fs.readFileSync(elevPath, 'utf8') : '');
const apiCfg = JSON.parse(fs.readFileSync(path.join(B, 'api_config.json'), 'utf8'));
html = html.replace('"__API_BASE__"', JSON.stringify(apiCfg.apiBase || ''));
fs.writeFileSync(path.join(REPO, 'index.html'), html);
console.log('index.html built:', (fs.statSync(path.join(REPO, 'index.html')).size / 1024).toFixed(0), 'KB');

// sw.js from template + tile manifest
const tiles = JSON.parse(fs.readFileSync(path.join(B, 'tiles_manifest.json'), 'utf8'));
let sw = fs.readFileSync(path.join(REPO, 'sw.template.js'), 'utf8');
if (!sw.includes('/*__TILES__*/')) { console.error('sw placeholder missing'); process.exit(1); }
sw = sw.replace('/*__TILES__*/', tiles.map(t => `'./${t}'`).join(','));
fs.writeFileSync(path.join(REPO, 'sw.js'), sw);
console.log('sw.js built with', tiles.length, 'tiles precached');
