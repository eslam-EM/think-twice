/**
 * End-to-end walkthrough of all 13 screens against the web export (RTL, phone viewport).
 * Usage: node tests/e2e.js <web-export-dir> <screenshot-dir>
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const WEB = path.resolve(process.argv[2] || 'dist');
const SHOTS = path.resolve(process.argv[3] || 'docs/screenshots');
fs.mkdirSync(SHOTS, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.png': 'image/png', '.ttf': 'font/ttf', '.wav': 'audio/wav', '.json': 'application/json' };

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

(async () => {
  const srv = http.createServer((req, res) => {
    let p = path.join(WEB, decodeURIComponent(req.url.split('?')[0]));
    if (!p.startsWith(WEB) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(WEB, 'index.html');
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const BASE = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'ar-EG', isMobile: true, hasTouch: true })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  // Share sheet is unavailable in headless Chromium; the app must still continue.
  await page.addInitScript(() => { navigator.share = undefined; });
  const tid = (id) => page.getByTestId(id).filter({ visible: true }).last();
  const shot = (n) => page.screenshot({ path: path.join(SHOTS, n) });

  try {
    await page.goto(BASE);
    await tid('start').waitFor({ timeout: 20000 });
    check('document is RTL', (await page.evaluate(() => document.documentElement.dir)) === 'rtl');
    await shot('01-home.png');
    await tid('start').click();
    await tid('section-kalma').waitFor();
    await shot('02-sections.png');

    // كلمة بداية flow
    await tid('section-kalma').click();
    await tid('situation-help').waitFor();
    await shot('03-kalma-situations.png');
    await tid('situation-help').click();
    await tid('person-mom').waitFor();
    check('"التالي" disabled until a person is chosen', (await tid('next').getAttribute('aria-disabled')) === 'true');
    await tid('person-mom').click();
    await shot('04-kalma-person.png');
    await tid('next').click();
    await tid('opener-text').waitFor();
    const opener = await tid('opener-text').innerText();
    check('opener addresses mom (masculine default)', opener.startsWith('ماما') && opener.includes('محتاج مساعدتك'), opener);
    await shot('05-kalma-opener.png');
    await tid('edit-opener').click();
    await tid('opener-input').fill('ماما، ممكن نتكلم شوية؟');
    await tid('edit-opener').click();
    check('opener can be edited', (await tid('opener-text').innerText()).includes('ممكن نتكلم شوية'));
    await tid('use-opener').click();
    await tid('choice-help').waitFor();
    await tid('choice-help').click();
    await shot('06-kalma-choice.png');
    await tid('next').click();
    await tid('result-title').waitFor();
    check('best choice gets positive feedback', (await tid('result-title').innerText()).includes('ممتاز'));
    await shot('07-kalma-result.png');
    await tid('new-challenge').click();
    await tid('situation-conflict').waitFor();
    check('"تحدي جديد" returns to situations', true);
    // a weaker choice shows the better alternative
    await tid('situation-conflict').click();
    await tid('person-friend').click();
    await tid('next').click();
    await tid('skip-opener').click();
    await tid('choice-harsh').click();
    await tid('next').click();
    await tid('result-title').waitFor();
    check('harsh choice is flagged and best answer shown', (await page.getByText('الاختيار الأفضل هنا: أرد بلطف').count()) === 1);

    // ثانية تفكير flow
    await page.goto(BASE + '/digital');
    await tid('category-news').waitFor();
    await shot('08-digital-home.png');
    await tid('category-news').click();
    await tid('topic-fake-news').waitFor();
    await shot('09-digital-topics.png');
    await tid('topic-fake-news').click();
    await tid('begin').waitFor();
    await shot('10-exercise.png');
    await tid('begin').click();
    await page.getByRole('radio', { name: 'أتحقق من الصفحة الرسمية للوزارة أو المدرسة الأول' }).filter({ visible: true }).click();
    await tid('next').click();
    await tid('result-title').waitFor();
    check('verifying the source is rated excellent', (await page.getByText('إجابتك كانت ممتازة.').count()) >= 1);
    await shot('11-evaluation.png');
    await tid('new-challenge').click();
    await tid('begin').waitFor();
    const nextQ = await tid('situation').innerText();
    check('"تحدي جديد" opens a different scenario', !nextQ.includes('الدراسة اتلغت'), nextQ.slice(0, 40));

    // Progress
    await page.goto(BASE + '/progress');
    await tid('progress-text').waitFor();
    const digitalTxt = await tid('progress-text').innerText();
    check('digital progress counts 1 challenge', digitalTxt.includes('أكملت 1 من 5'), digitalTxt);
    await shot('12-progress.png');
    await tid('tab-kalma').click();
    check('kalma progress counts 2 distinct challenges', (await tid('progress-text').innerText()).includes('أكملت 2 من 5'));

    // Settings + persistence + gender
    await page.goto(BASE + '/settings');
    await tid('name-input').fill('سلمى');
    await tid('gender-f').click();
    await tid('name-input').press('Tab');
    await page.waitForTimeout(500);
    await shot('13-settings.png');
    await page.goto(BASE);
    await tid('start').waitFor();
    check('name persisted after restart', (await page.getByText('أهلًا يا سلمى!').count()) === 1);
    await page.goto(BASE + '/kalma/opener?situation=help&person=mom');
    await tid('opener-text').waitFor();
    check('opener switches to feminine forms', (await tid('opener-text').innerText()).includes('محتاجة مساعدتك'));
    await page.goto(BASE + '/progress');
    await tid('progress-text').waitFor();
    check('progress persisted after restart', (await tid('progress-text').innerText()).includes('أكملت 1'));
    await page.goto(BASE + '/help');
    await page.getByText('16000', { exact: false }).first().waitFor();
    await shot('14-help.png');
    await page.goto(BASE + '/about');
    await shot('15-about.png');

    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto(BASE + '/sections');
    await tid('section-kalma').waitFor();
    check('no horizontal overflow at 360px', !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)));
  } catch (e) {
    check('walkthrough completed without exceptions', false, String(e).slice(0, 300));
    await shot('zz-failure.png').catch(() => undefined);
  }
  check('no uncaught page errors', errors.length === 0, errors.slice(0, 2).join(' | '));
  fs.writeFileSync(path.join(SHOTS, 'e2e-results.json'), JSON.stringify(results, null, 2));
  await browser.close();
  srv.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
})();
