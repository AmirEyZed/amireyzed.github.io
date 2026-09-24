// Generates public/og.png (1200x630), the image shown when the site is shared.
// Run: npm run og
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../public/og.png', import.meta.url));

const W = 1200;
const H = 630;
const night = '#0f0e0e';
const warm = '#fffdf2';
const muted = '#aaa698';
const line = '#2c2a29';
const olive = '#939458';
const lime = '#e2e565';
const kick = '#53fc18';

// The wire: lit up to "today", LEDs on the way.
const railY = 486;
const x1 = 96;
const x2 = W - 96;
const stops = [0, 0.18, 0.36, 0.54, 0.72, 0.9];
const lit = 0.9;
const leds = stops
  .map((p) => {
    const x = x1 + (x2 - x1) * p;
    const on = p <= lit;
    const last = p === lit;
    return `${last ? `<circle cx="${x}" cy="${railY}" r="24" fill="${kick}" fill-opacity="0.18"/>` : ''}
      <circle cx="${x}" cy="${railY}" r="${last ? 11 : 8}" fill="${on ? kick : night}" stroke="${on ? kick : '#77746a'}" stroke-width="3"/>`;
  })
  .join('');

// The MozGang banana (official mark, the same path as the favicon), in brand yellow with a soft glow.
const bananaPath = readFileSync(fileURLToPath(new URL('../public/favicon.svg', import.meta.url)), 'utf8').match(/ d="([^"]+)"/)[1];
const banana = `
  <g transform="translate(905 44) scale(0.8)">
    <path d="${bananaPath}" fill="#f4d037" opacity="0.5" filter="url(#glow)"/>
    <path d="${bananaPath}" fill="#f4d037"/>
  </g>`;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="wall" cx="30%" cy="10%" r="80%">
      <stop offset="0" stop-color="${olive}" stop-opacity="0.38"/>
      <stop offset="0.5" stop-color="#3c4f34" stop-opacity="0.14"/>
      <stop offset="1" stop-color="${night}" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>
    <filter id="neon" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="b1"/>
      <feFlood flood-color="${lime}" flood-opacity="0.55"/>
      <feComposite in2="b1" operator="in" result="g1"/>
      <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b2"/>
      <feFlood flood-color="#f4ed99" flood-opacity="0.7"/>
      <feComposite in2="b2" operator="in" result="g2"/>
      <feMerge><feMergeNode in="g1"/><feMergeNode in="g2"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="${night}"/>
  <rect width="${W}" height="${H}" fill="url(#wall)"/>
  ${banana}
  <text x="92" y="250" font-family="Segoe UI, Arial, sans-serif" font-size="124" font-weight="800" fill="${warm}" letter-spacing="-4" filter="url(#neon)">AmirEyZed</text>
  <text x="96" y="318" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="${lime}">Streamer, YouTuber, podcaster and creator of The One Awards</text>
  <text x="96" y="366" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="${muted}">My path, year by year, from 2017 to today</text>
  <rect x="${x1}" y="${railY - 2}" width="${x2 - x1}" height="4" rx="2" fill="${line}"/>
  <rect x="${x1}" y="${railY - 2}" width="${(x2 - x1) * lit}" height="4" rx="2" fill="${kick}"/>
  ${leds}
  <text x="96" y="578" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="600" fill="${warm}">amireyzed.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log(`og image written to ${out}`);
