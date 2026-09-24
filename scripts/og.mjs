// Link-preview cards for Telegram, X, WhatsApp and search: public/og-fa.jpg and public/og-en.jpg.
// Amir at his desk (the hero portrait) under the neon name, drawn by headless Chrome so the Persian
// name uses Vazirmatn exactly like the site. Run with `npm run og` after changing the name or tagline.
// Needs a local Chrome; set CHROME_PATH if it is not in the default Windows location.
import { rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { site } from '../src/data/site.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = (p) => pathToFileURL(join(root, p)).href;
const chrome = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const W = 1200;
const H = 630;

const card = (lang) => `<!doctype html>
<html lang="${lang}" dir="${lang === 'fa' ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="${url('node_modules/@fontsource-variable/vazirmatn/index.css')}" />
<style>
  html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: #141313; }
  .card {
    position: relative; width: ${W}px; height: ${H}px; overflow: hidden;
    font-family: 'Vazirmatn Variable', sans-serif; text-align: center;
    background:
      radial-gradient(55% 65% at 50% 30%, rgb(147 148 88 / 0.3), rgb(60 79 52 / 0.12) 55%, transparent 78%),
      #141313;
  }
  /* The portrait, lit on him and faded at the edges, as on the page. */
  .portrait {
    position: absolute; top: 22px; left: 50%; width: 940px; aspect-ratio: 1226 / 624; transform: translateX(-50%);
    -webkit-mask-image: radial-gradient(ellipse 60% 66% at 50% 38%, #000 52%, transparent 100%);
  }
  .portrait img { position: absolute; inset: 0; width: 100%; height: 100%; }
  .dim { opacity: 0.32; filter: saturate(0.45) brightness(0.85); }
  .lit { -webkit-mask-image: radial-gradient(circle 330px at 50.2% 40%, #000 0%, rgb(0 0 0 / 0.6) 45%, transparent 100%); }
  .neon { -webkit-mask-image: radial-gradient(ellipse 9.5% 23% at 86.9% 52%, #000 62%, transparent 100%); }
  .halo {
    position: absolute; top: 52%; left: 86.9%; width: 30%; aspect-ratio: 1; border-radius: 50%;
    transform: translate(-50%, -50%); mix-blend-mode: screen;
    background: radial-gradient(circle, rgb(255 238 160 / 0.32), rgb(226 229 101 / 0.1) 40%, transparent 70%);
  }
  .name {
    position: absolute; top: 368px; inset-inline: 0; margin: 0;
    color: #fffdf2; font-size: 124px; font-weight: ${lang === 'fa' ? 900 : 800}; line-height: 1.1;
    letter-spacing: ${lang === 'fa' ? '0' : '-0.02em'};
    text-shadow:
      0 0 4px rgb(255 253 242 / 0.95),
      0 0 16px rgb(244 237 153 / 0.75),
      0 0 44px rgb(226 229 101 / 0.5),
      0 0 110px rgb(147 148 88 / 0.45);
  }
  .tagline { position: absolute; top: 520px; inset-inline: 0; margin: 0; color: #f4ed99; font-size: 31px; font-weight: 600; }
  .domain { position: absolute; top: 578px; inset-inline: 0; margin: 0; color: rgb(245 245 241 / 0.5); font-size: 21px; font-weight: 600; direction: ltr; }
</style>
</head>
<body>
  <div class="card">
    <div class="portrait">
      <img class="dim" src="${url('src/assets/hero/amireyzed-studio.png')}" alt="" />
      <img class="neon" src="${url('src/assets/hero/amireyzed-studio.png')}" alt="" />
      <img class="lit" src="${url('src/assets/hero/amireyzed-studio.png')}" alt="" />
      <span class="halo"></span>
    </div>
    <p class="name">${site.name[lang]}</p>
    <p class="tagline">${site.tagline[lang]}</p>
    <p class="domain">amireyzed.com</p>
  </div>
</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-first-run', '--allow-file-access-from-files'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  for (const lang of ['fa', 'en']) {
    // A file page, so the portrait and the font load from disk.
    const html = join(tmpdir(), `amireyzed-og-${lang}.html`);
    writeFileSync(html, card(lang));
    await page.goto(pathToFileURL(html).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const shot = await page.screenshot({ type: 'png' });
    const out = join(root, 'public', `og-${lang}.jpg`);
    await sharp(shot).resize(W, H).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
    rmSync(html);
    console.log(`card written to ${out}`);
  }
} finally {
  await browser.close();
}
