/**
 * Original artwork for Think Twice (ثانية تفكير), authored as SVG and rendered to PNG with headless Chromium.
 *   node scripts/generate-assets.js
 * Editable SVG sources are saved in assets/source/.
 */
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets/images');
const SRC = path.join(ROOT, 'assets/source');
const FONT = path.join(ROOT, 'node_modules/@expo-google-fonts/cairo');
const C = { indigo: '#3E2FA8', primary: '#5B4FD9', violet: '#7B6CF0', lav: '#EEEBFF', bg: '#F4F2FF', navy: '#23215B', sky: '#E6F3FC' };

/** Logo mark: a speech bubble holding a two-lobed brain with clock hands ("a second to think"). */
function mark(x, y, s, mono = false) {
  const k = s / 400;
  const stroke = mono ? '#fff' : C.indigo;
  const lobe = mono ? '#fff' : 'url(#lobe)';
  const line = mono ? '#000' : '#fff';
  return `<g transform="translate(${x} ${y}) scale(${k}) translate(-200 -200)">
    <defs><linearGradient id="lobe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.primary}"/></linearGradient></defs>
    <path d="M200 40 C300 40 368 106 368 192 C368 278 300 344 200 344 C178 344 158 341 139 335 L74 372 L88 306 C52 276 32 236 32 192 C32 106 100 40 200 40Z"
      fill="${mono ? 'none' : '#fff'}" stroke="${stroke}" stroke-width="26" stroke-linejoin="round"/>
    <path d="M196 102 C160 92 124 108 116 140 C92 148 84 178 98 198 C86 222 100 252 128 256 C138 282 170 290 192 276 Z" fill="${lobe}" ${mono ? 'opacity="1"' : ''}/>
    <path d="M206 102 C242 92 278 108 286 140 C310 148 318 178 304 198 C316 222 302 252 274 256 C264 282 232 290 210 276 Z" fill="${lobe}"/>
    <g stroke="${line}" stroke-width="9" fill="none" stroke-linecap="round" ${mono ? 'opacity="0"' : ''}>
      <path d="M150 130 C162 140 160 156 148 164"/><path d="M118 198 C134 192 150 200 154 214"/><path d="M160 236 C166 222 180 220 188 226"/>
      <circle cx="252" cy="190" r="40"/><path d="M252 190 L252 164"/><path d="M252 190 L272 202"/>
    </g>
    ${mono ? '' : `<circle cx="252" cy="190" r="7" fill="#fff"/>`}
  </g>`;
}

const fontCss = `<style>@font-face{font-family:Cairo;font-weight:900;src:url('file://${FONT}/900Black/Cairo_900Black.ttf')}@font-face{font-family:Cairo;font-weight:700;src:url('file://${FONT}/700Bold/Cairo_700Bold.ttf')}</style>`;

const svg = (w, h, body, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${fontCss}${defs}</defs>${body}</svg>`;

const ASSETS = {
  'logo': [400, 400, svg(400, 400, mark(200, 200, 400))],
  'icon': [1024, 1024, svg(1024, 1024, `<rect width="1024" height="1024" fill="url(#bg)"/>${mark(512, 520, 700)}`,
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="${C.lav}"/></linearGradient>`)],
  'adaptive-foreground': [1024, 1024, svg(1024, 1024, mark(512, 520, 580))],
  'adaptive-monochrome': [1024, 1024, svg(1024, 1024, mark(512, 520, 580, true))],
  'notification-icon': [96, 96, svg(96, 96, mark(48, 48, 88, true))],
  'splash': [800, 800, svg(800, 800, `${mark(400, 290, 400)}
    <text x="400" y="580" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="78" fill="${C.navy}">Think Twice</text>
    <text x="400" y="680" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="84" fill="${C.primary}" direction="rtl">ثانية تفكير</text>`)],
  // Hero: a teen with a backpack looking at a soft city skyline.
  'hero': [720, 520, svg(720, 520, `
    <rect width="720" height="520" fill="url(#sky)"/>
    <g fill="#DCD6FF" opacity="0.9">
      <rect x="40" y="250" width="70" height="200" rx="6"/><rect x="120" y="200" width="60" height="250" rx="6"/><rect x="190" y="280" width="80" height="170" rx="6"/>
      <rect x="430" y="230" width="70" height="220" rx="6"/><rect x="510" y="170" width="56" height="280" rx="6"/><rect x="576" y="260" width="90" height="190" rx="6"/>
    </g>
    <g fill="#fff" opacity="0.9"><ellipse cx="150" cy="120" rx="70" ry="24"/><ellipse cx="190" cy="104" rx="44" ry="28"/><ellipse cx="560" cy="90" rx="80" ry="26"/><ellipse cx="600" cy="74" rx="46" ry="28"/></g>
    <g fill="#C9C1FA">${[60, 150, 250, 470, 560, 650].map((x, i) => `<ellipse cx="${x}" cy="${470 - (i % 2) * 10}" rx="${60 + (i % 3) * 14}" ry="34"/>`).join('')}</g>
    <rect x="0" y="470" width="720" height="50" fill="#D9D3FF"/>
    <g transform="translate(372 210)">
      <path d="M-70 310 C-74 200 -60 120 0 108 C60 120 74 200 70 310 Z" fill="${C.violet}"/>
      <rect x="-56" y="132" width="112" height="132" rx="34" fill="${C.navy}"/>
      <rect x="-40" y="176" width="80" height="54" rx="16" fill="#35337A"/>
      <path d="M-50 150 C-60 120 -40 110 -30 128" stroke="#35337A" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M50 150 C60 120 40 110 30 128" stroke="#35337A" stroke-width="12" fill="none" stroke-linecap="round"/>
      <rect x="-16" y="96" width="32" height="22" rx="8" fill="#E9B48C"/>
      <ellipse cx="-56" cy="66" rx="9" ry="14" fill="#E9B48C"/><ellipse cx="56" cy="66" rx="9" ry="14" fill="#E9B48C"/>
      <circle cx="0" cy="58" r="56" fill="#2B2350"/>
      <path d="M-40 20 C-20 4 20 4 40 20" stroke="#3B3270" stroke-width="8" fill="none" stroke-linecap="round"/>
    </g>`, `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1EEFF"/><stop offset="1" stop-color="#E4EEFF"/></linearGradient>`)],
};

/** Simple friendly avatars (no real people). */
function avatar(bg, skin, hair, top, extra = '') {
  return svg(200, 200, `<circle cx="100" cy="100" r="100" fill="${bg}"/>
    <path d="M40 200 C40 150 70 132 100 132 C130 132 160 150 160 200Z" fill="${top}"/>
    <rect x="88" y="112" width="24" height="26" rx="10" fill="${skin}"/>
    ${hair.back || ''}<circle cx="100" cy="86" r="38" fill="${skin}"/>${hair.front}
    <circle cx="86" cy="88" r="4" fill="#2B2350"/><circle cx="114" cy="88" r="4" fill="#2B2350"/>
    <path d="M88 104 Q100 112 112 104" stroke="#B5655A" stroke-width="4" fill="none" stroke-linecap="round"/>${extra}`);
}
Object.assign(ASSETS, {
  'avatar-mom': [200, 200, avatar('#FFE1EA', '#F2C6A0', { back: '<path d="M56 90 C52 40 148 40 144 90 L150 150 L50 150Z" fill="#3A2A2A"/>', front: '<path d="M62 80 C64 48 136 48 138 80 C120 64 84 62 62 80Z" fill="#3A2A2A"/>' }, '#E9708F')],
  'avatar-dad': [200, 200, avatar('#DDEBFF', '#E9B48C', { front: '<path d="M62 78 C62 46 138 46 138 78 C126 64 76 62 62 78Z" fill="#2D2A3A"/>' }, '#4A78D6', '<path d="M78 106 Q100 126 122 106 L122 112 Q100 134 78 112Z" fill="#2D2A3A" opacity="0.85"/>')],
  'avatar-teacher': [200, 200, avatar('#FFEBDD', '#F2C6A0', { back: '<path d="M60 92 C56 44 144 44 140 92 L136 124 L64 124Z" fill="#6B3E26"/>', front: '<path d="M64 78 C70 50 130 50 136 78 C116 66 86 64 64 78Z" fill="#6B3E26"/>' }, '#F29A5B', '<rect x="76" y="80" width="20" height="14" rx="6" fill="none" stroke="#2B2350" stroke-width="3"/><rect x="104" y="80" width="20" height="14" rx="6" fill="none" stroke="#2B2350" stroke-width="3"/><path d="M96 86 L104 86" stroke="#2B2350" stroke-width="3"/>')],
});

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(SRC, { recursive: true });
  const tmp = path.join(ROOT, '.asset-tmp');
  fs.mkdirSync(tmp, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [name, [w, h, s]] of Object.entries(ASSETS)) {
    fs.writeFileSync(path.join(SRC, `${name}.svg`), s);
    const f = path.join(tmp, `${name}.html`);
    fs.writeFileSync(f, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{display:block}</style>${s}`);
    await page.setViewportSize({ width: w, height: h });
    await page.goto('file://' + f);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, `${name}.png`), omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
    console.log('✓', name);
  }
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch((e) => { console.error(e); process.exit(1); });
