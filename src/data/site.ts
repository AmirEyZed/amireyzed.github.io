import type { Lang } from '../i18n/ui';
import live from './live-stats.json';

type Localized = Record<Lang, string>;

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

/* ---------- Weekly numbers (src/data/live-stats.json, refreshed by scripts/update-stats.mjs) ---------- */
const faDigits = (text: string) => text.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!);

/** A full number: 1,094 / ۱٬۰۹۴ */
const full = (n: number): Localized => ({
  fa: faDigits(n.toLocaleString('en-US')).replace(/,/g, '٬'),
  en: n.toLocaleString('en-US'),
});

/** A short number with its unit: 132.6K → ۱۳۳ هزار / 133K; 34.98M → ۳۵ میلیون / 35.0M */
function compact(n: number): { value: Localized; unit: Localized } {
  const [size, fa, en] = n >= 1e6 ? [n / 1e6, 'میلیون', 'M'] : [n / 1e3, 'هزار', 'K'];
  const text = size >= 100 ? String(Math.round(size)) : size.toFixed(1).replace(/\.0$/, '');
  return { value: { fa: faDigits(text).replace('.', '٫'), en: text + en }, unit: { fa, en: '' } };
}

const months = {
  fa: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'جولای', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
const [liveYear, liveMonth, liveDay] = live.updatedAt.split('-').map(Number) as [number, number, number];

const youtubeSubscribers = live.youtube.reduce((sum, c) => sum + c.subscribers, 0);
const youtubeViews = live.youtube.reduce((sum, c) => sum + c.views, 0);
const youtubeVideos = live.youtube.reduce((sum, c) => sum + c.videos, 0);
const allFollowers = live.twitch.followers + live.kick.followers + youtubeSubscribers;

/** Site-wide facts shown in the header, hero, "Today" block and footer. */
export const site = {
  url: 'https://amireyzed.com',
  handle: 'amireyzed',
  /** Brand mark shown in the header (always Latin). */
  mark: 'AmirEyZed',
  name: {
    fa: 'امیر ایزد',
    en: 'Amir EyZed',
  } satisfies Localized,
  tagline: {
    fa: 'استریمر، یوتیوبر، پادکستر و برگزارکننده The One Awards',
    en: 'Streamer, YouTuber, podcaster and organizer of The One Awards',
  } satisfies Localized,
  /** His real name (he chose to show it on 2026-09-25). */
  realName: {
    fa: 'امیرصالح زارع',
    en: 'Amirsaleh Zare',
  } satisfies Localized,
  /** Short role for search engines (JSON-LD jobTitle). */
  role: {
    fa: 'استریمر و یوتیوبر',
    en: 'Streamer and YouTuber',
  } satisfies Localized,
  /** Birth date for search engines (30 Esfand 1375, confirmed by him on 2026-09-25). */
  birthDate: '1997-03-20',
  /** Awards for search engines (JSON-LD), from the 2025 The One Awards entry. */
  awards: {
    fa: ['بهترین استریمر سال، The One Awards ۲۰۲۵', 'بهترین محتواساز ری‌اکشن، The One Awards ۲۰۲۵'],
    en: ['Streamer of the Year, The One Awards 2025', 'Best Reaction Creator, The One Awards 2025'],
  },
  /** His official photo (The One Awards red carpet), at a fixed address for search engines. */
  photo: '/amir-eyzed-the-one-awards.jpg',
  intro: {
    fa: 'امیرصالح زارع هستم، ملقب به امیر ایزد (AmirEyZed)؛ استریمر و یوتیوبر، و برنده جایزه بهترین استریمر سال در The One Awards. اینجا مسیر کاری منو سال به سال می‌بینی؛ از رینبو و مسابقات رقابتی تا استریم، یوتیوب، پادکست، The One Awards و پروژه‌هایی که برای کامیونیتی ساختم. کنار اتفاق‌های مهم عکس و لینک منبعش هست و آخر صفحه هم کل این مسیر رو تو چند عدد جمع کردم.',
    en: 'I’m Amirsaleh Zare, known as AmirEyZed: a streamer and YouTuber, and Streamer of the Year at The One Awards. Here you’ll find my career, year by year: from Rainbow Six and competitive play to streaming, YouTube, podcasts, The One Awards and the projects I built for the community. The key moments come with photos and links to their sources, and the end of the page sums the whole path up in a few numbers.',
  } satisfies Localized,
  /**
   * Closing line under "Today" at the end of the timeline.
   * Numbers: snapshot of 24 Sep 2026 (Kick 45,130 followers; YouTube 65.9K main, 55K EyZed Reacts, 11.6K EyZed Gaming).
   */
  today: {
    fa: 'از ۵۸۰ فالوور توییچ تا امروز، چند بار مجبور شدم دوباره از صفر شروع کنم. الان خونه لایوهام کیکه؛ بقیه‌ش رو همین‌جا اضافه می‌کنم.',
    en: 'From 580 Twitch followers to today, I’ve had to start over from scratch more than once. Kick is home for my streams now; I’ll add the rest right here.',
  } satisfies Localized,
  /**
   * Career totals under "Today".
   * Weekly (src/data/live-stats.json, scripts/update-stats.mjs): Kick and Twitch followers, and YouTube
   * subscribers, views and videos of the three channels; the "as of" date follows that file.
   * Fixed, from TwitchTracker on 24 Sep 2026: 7,717 h live over 1,368 days and 2,206,296 h watched on Twitch;
   * peak from The One Awards.
   * Kick records: 15.4K peak on 17 Aug 2026 (Kick stats), 2 billion toman in one stream on 4 Jun 2026,
   * 5,724 subs gifted by one supporter (Kick gifter leaderboard). Kick does not publish total hours streamed.
   */
  stats: {
    items: [
      {
        value: { fa: '۷٬۷۱۷', en: '7,717' },
        label: { fa: 'ساعت پخش زنده در ۱٬۳۶۸ روز، فقط روی توییچ', en: 'hours live over 1,368 days, on Twitch alone' },
      },
      {
        value: { fa: '۲٫۲', en: '2.2M' },
        unit: { fa: 'میلیون', en: '' },
        label: { fa: 'ساعت تماشا روی توییچ', en: 'hours watched on Twitch' },
      },
      {
        ...compact(allFollowers),
        label: { fa: 'مجموع فالوورها و سابسکرایبرها در Twitch، YouTube و Kick', en: 'followers and subscribers across Twitch, YouTube and Kick' },
      },
      {
        ...compact(live.kick.followers),
        label: { fa: 'فالوور کیک', en: 'followers on Kick' },
      },
      {
        ...compact(youtubeSubscribers),
        label: { fa: 'سابسکرایبر در سه کانال یوتیوب', en: 'subscribers across three YouTube channels' },
      },
      {
        ...compact(live.twitch.followers),
        label: { fa: 'فالوور توییچ', en: 'followers on Twitch' },
      },
      /** Kick records: each links to the milestone that holds its source (Kick stats, stream video, gifter leaderboard). */
      {
        value: { fa: '۱۵٫۴', en: '15.4K' },
        unit: { fa: 'هزار', en: '' },
        label: { fa: 'اوج بیننده هم‌زمان در کیک؛ رکورد استریمرهای ایرانی کیک', en: 'peak concurrent viewers on Kick, the record among Iranian Kick streamers' },
        href: '#2026-kick-record',
      },
      {
        value: { fa: '۲', en: '2B' },
        unit: { fa: 'میلیارد تومن', en: 'toman' },
        label: { fa: 'دونیت در یک استریم؛ رکورد استریم فارسی', en: 'in donations in a single stream, the record for a Persian stream' },
        href: '#2026-records',
      },
      {
        value: { fa: '۵٬۷۲۴', en: '5,724' },
        label: { fa: 'ساب گیفتی فقط از یک حامی؛ رکورد ساب کیک بین استریمرهای فارسی', en: 'subs gifted by a single supporter, the Kick sub record among Persian streamers' },
        href: '#2026-records',
      },
      {
        ...compact(youtubeViews),
        label: { fa: 'بازدید در سه کانال یوتیوب', en: 'views across three YouTube channels' },
      },
      {
        value: full(youtubeVideos),
        label: { fa: 'ویدیوی منتشرشده در یوتیوب', en: 'videos published on YouTube' },
      },
      {
        value: { fa: '۳۶٫۵', en: '36.5K' },
        unit: { fa: 'هزار', en: '' },
        label: { fa: 'اوج بیننده هم‌زمان، The One Awards', en: 'peak concurrent viewers, The One Awards' },
        /** The YouTube Studio screenshot sits in this milestone. */
        href: '#2025-the-one-awards',
      },
    ],
    asOf: {
      fa: `تا ${faDigits(String(liveDay))} ${months.fa[liveMonth - 1]} ${faDigits(String(liveYear))}.`,
      en: `As of ${liveDay} ${months.en[liveMonth - 1]} ${liveYear}.`,
    } satisfies Localized,
    /** Public pages where each number can be checked. */
    sources: [
      { label: { fa: 'آمار توییچ در TwitchTracker', en: 'Twitch stats on TwitchTracker' }, url: 'https://twitchtracker.com/amireyzed/statistics' },
      { label: { fa: 'یوتیوب AmirEyZed', en: 'AmirEyZed on YouTube' }, url: 'https://www.youtube.com/@AmirEyZed' },
      { label: { fa: 'یوتیوب EyZed Reacts', en: 'EyZed Reacts on YouTube' }, url: 'https://www.youtube.com/@EyZedMoments' },
      { label: { fa: 'یوتیوب EyZed Gaming', en: 'EyZed Gaming on YouTube' }, url: 'https://www.youtube.com/@EyZedGaming' },
      { label: { fa: 'کیک', en: 'Kick' }, url: 'https://kick.com/amireyzed' },
    ],
    notes: [
      {
        fa: 'فالوورها و سابسکرایبرهای سه پلتفرم با هم جمع شده‌اند؛ بنابراین ممکنه یک نفر روی چند پلتفرم جداگانه حساب شده باشه.',
        en: 'Followers and subscribers from the three platforms are added together, so one person may be counted on more than one platform.',
      },
      { fa: 'ساعت‌های لایو کیک توی این عددها حساب نشده.', en: 'Hours streamed on Kick are not included.' },
      {
        fa: 'فالوورها، سابسکرایبرها، بازدیدها و تعداد ویدیوها هر هفته خودکار به‌روز میشن؛ تعداد سابسکرایبرها رو خود یوتیوب گرد شده نشون میده.',
        en: 'Followers, subscribers, views and video counts update automatically every week; YouTube itself shows subscriber counts rounded.',
      },
    ] satisfies Localized[],
  },
  /** Contact email. Empty = hidden everywhere. */
  email: '',
  /** Handles confirmed in the Telegram channel export. */
  socials: [
    { id: 'kick', label: 'Kick', url: 'https://kick.com/amireyzed' },
    { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@amireyzed' },
    { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/amireyzed' },
    { id: 'telegram', label: 'Telegram', url: 'https://t.me/amireyzed' },
    { id: 'x', label: 'X', url: 'https://x.com/AmirEyZed_' },
    { id: 'twitch', label: 'Twitch', url: 'https://www.twitch.tv/amireyzed' },
  ] satisfies SocialLink[],
} as const;
