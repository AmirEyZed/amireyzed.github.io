// Weekly stats: Kick and Twitch followers, and subscribers, views and video counts of the three YouTube channels.
// Writes src/data/live-stats.json, which site.ts turns into the stat cards under "Today".
// Run by .github/workflows/update-stats.yml every week, or by hand with `npm run stats`.
// A number that cannot be read, or that drops by more than 30%, keeps its last good value.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'live-stats.json');
const old = JSON.parse(readFileSync(file, 'utf8'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

async function get(url, accept = 'text/html') {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: accept, 'Accept-Language': 'en-US,en;q=0.9', Cookie: 'CONSENT=YES+1; SOCS=CAI' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

/** "68.5K subscribers" → 68500, "12,578,767 views" → 12578767 */
function parseCount(text) {
  const m = String(text).replace(/,/g, '').match(/([\d.]+)\s*([KMB])?/i);
  if (!m) return NaN;
  const scale = { K: 1e3, M: 1e6, B: 1e9 }[(m[2] ?? '').toUpperCase()] ?? 1;
  return Math.round(Number(m[1]) * scale);
}

/** Keep the old value when the new one is missing or suspiciously low. */
function pick(name, next, prev) {
  if (!Number.isFinite(next) || next <= 0) {
    console.warn(`! ${name}: could not read, keeping ${prev}`);
    return prev;
  }
  if (prev && next < prev * 0.7) {
    console.warn(`! ${name}: ${next} is far below ${prev}, keeping ${prev}`);
    return prev;
  }
  console.log(`${name}: ${prev ?? '-'} -> ${next}`);
  return next;
}

/** Up to three tries, a few seconds apart; Kick and YouTube sometimes answer oddly once. */
async function tryRead(name, fn, ok = (v) => Number.isFinite(v)) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const value = await fn();
      if (ok(value)) return value;
      console.warn(`! ${name}: unexpected answer (try ${attempt})`);
    } catch (error) {
      console.warn(`! ${name}: ${error.message} (try ${attempt})`);
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, 4000));
  }
  return NaN;
}

const kickFollowers = await tryRead('kick', async () =>
  Number(JSON.parse(await get('https://kick.com/api/v2/channels/amireyzed', 'application/json')).followers_count),
);
const twitchFollowers = await tryRead('twitch', async () => parseCount(await get('https://decapi.me/twitch/followcount/amireyzed', 'text/plain')));

const youtube = [];
for (const channel of old.youtube) {
  const html = await tryRead(
    `youtube ${channel.handle}`,
    () => get(`https://www.youtube.com/@${channel.handle}/about`),
    (page) => typeof page === 'string' && page.includes('aboutChannelViewModel'),
  );
  const about = typeof html === 'string' ? html.slice(html.indexOf('aboutChannelViewModel')) : '';
  const field = (key) => parseCount((about.match(new RegExp(`"${key}":"([^"]+)"`)) ?? [])[1] ?? '');
  youtube.push({
    handle: channel.handle,
    subscribers: pick(`${channel.handle} subscribers`, field('subscriberCountText'), channel.subscribers),
    views: pick(`${channel.handle} views`, field('viewCountText'), channel.views),
    videos: pick(`${channel.handle} videos`, field('videoCountText'), channel.videos),
  });
}

const next = {
  updatedAt: new Date().toISOString().slice(0, 10),
  kick: { followers: pick('kick followers', kickFollowers, old.kick.followers) },
  twitch: { followers: pick('twitch followers', twitchFollowers, old.twitch.followers) },
  youtube,
};

writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
console.log(`written ${file}`);
