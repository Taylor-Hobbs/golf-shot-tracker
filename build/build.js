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
face('Space Grotesk', 400, 'sg-400.woff2');
face('Space Grotesk', 500, 'sg-500.woff2');
face('Space Grotesk', 600, 'sg-600.woff2');
face('Space Grotesk', 700, 'sg-700.woff2');
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
fs.writeFileSync(path.join(REPO, 'index.html'), html);
console.log('index.html built:', (fs.statSync(path.join(REPO, 'index.html')).size / 1024).toFixed(0), 'KB');
