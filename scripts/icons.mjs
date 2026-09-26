// Site icons from the MozGang mark: the banana on its yellow tile with the cut corner.
// Writes public/favicon.svg, favicon.ico (16/32/48), icon-48/96/192/512.png and apple-touch-icon.png.
// Run with `node scripts/icons.mjs` after changing the mark.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const YELLOW = '#f4cf36';
const INK = '#132421';
const TEAL = '#1b3f3f';

// The banana of the official MozGang mark, traced from the brand image into 64-unit tile space.
const banana = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'mozgang-banana.svgpath'), 'utf8').trim();

// The corner is cut from 74% down the left edge to 24% along the bottom, as on the official mark.
const mark = (withTeal = false) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${withTeal ? '-9 -9 82 82' : '0 0 64 64'}">
  <title>AmirEyZed</title>
  <!-- The MozGang mark: the banana on its yellow tile with the cut corner. -->
${withTeal ? `  <rect x="-9" y="-9" width="82" height="82" fill="${TEAL}"/>\n` : ''}  <path fill="${YELLOW}" d="M0 0H64V64H15.6L0 47.5Z"/>
  <path fill="${INK}" fill-rule="evenodd" d="${banana}"/>
</svg>
`;

writeFileSync(join(pub, 'favicon.svg'), mark());

const png = (size, withTeal = false) => sharp(Buffer.from(mark(withTeal)), { density: 72 * (size / 64) * 2 }).resize(size, size).png().toBuffer();

for (const size of [48, 96, 192, 512]) writeFileSync(join(pub, `icon-${size}.png`), await png(size));
// iOS fills transparency with black, so the touch icon sits on the brand teal.
writeFileSync(join(pub, 'apple-touch-icon.png'), await png(180, true));

// favicon.ico with PNG-compressed 16, 32 and 48 px images.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(images[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += images[i].length;
  return e;
});
writeFileSync(join(pub, 'favicon.ico'), Buffer.concat([header, ...entries, ...images]));
console.log('icons written');
