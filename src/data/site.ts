import type { Lang } from '../i18n/ui';

type Localized = Record<Lang, string>;

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

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
  intro: {
    fa: 'اینجا مسیر کاری منو سال به سال می‌بینی؛ از رینبو و مسابقات رقابتی تا استریم، یوتیوب، پادکست، The One Awards و پروژه‌هایی که برای کامیونیتی ساختم. کنار اتفاق‌های مهم عکس و لینک منبعش هست و آخر صفحه هم کل این مسیر رو تو چند عدد جمع کردم.',
    en: 'Here you’ll find my career, year by year: from Rainbow Six and competitive play to streaming, YouTube, podcasts, The One Awards and the projects I built for the community. The key moments come with photos and links to their sources, and the end of the page sums the whole path up in a few numbers.',
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
   * Career totals under "Today". Snapshot of 24 Sep 2026:
   * Twitch lifetime from TwitchTracker (7,717 h live, 1,368 days, 2,206,296 h watched, 148,339 followers);
   * YouTube from each channel (12,461,385 + 20,501,540 + 1,476,806 views; 370 + 530 + 194 videos;
   * 65.9K + 55K + 11.6K subscribers); Kick 45,130 followers (kick.com API); peak from The One Awards.
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
        value: { fa: '۳۴٫۴', en: '34.4M' },
        unit: { fa: 'میلیون', en: '' },
        label: { fa: 'بازدید در سه کانال یوتیوب', en: 'views across three YouTube channels' },
      },
      {
        value: { fa: '۱٬۰۹۴', en: '1,094' },
        label: { fa: 'ویدیوی منتشرشده در یوتیوب', en: 'videos published on YouTube' },
      },
      {
        value: { fa: '۳۲۶', en: '326K' },
        unit: { fa: 'هزار', en: '' },
        label: { fa: 'مجموع فالوورها و سابسکرایبرها در Twitch، YouTube و Kick', en: 'followers and subscribers across Twitch, YouTube and Kick' },
      },
      {
        value: { fa: '۳۶٫۵', en: '36.5K' },
        unit: { fa: 'هزار', en: '' },
        label: { fa: 'اوج بیننده هم‌زمان، The One Awards', en: 'peak concurrent viewers, The One Awards' },
        /** The YouTube Studio screenshot sits in this milestone. */
        href: '#2025-the-one-awards',
      },
    ],
    asOf: { fa: 'تا ۲۴ سپتامبر ۲۰۲۶.', en: 'As of 24 September 2026.' } satisfies Localized,
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
