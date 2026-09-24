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
    fa: 'استریمر، یوتیوبر، پادکستر و سازندهٔ The One Awards',
    en: 'Streamer, YouTuber, podcaster and creator of The One Awards',
  } satisfies Localized,
  intro: {
    fa: 'از تیم‌های رقابتی رینبو سیکس روی PS4 تا لایوهای امروز روی کیک. این صفحه همون مسیره، سال به سال.',
    en: 'From competitive Rainbow Six teams on PS4 to live shows on Kick today. This page is that path, year by year.',
  } satisfies Localized,
  /**
   * Closing line under "Today" at the end of the timeline.
   * Numbers: snapshot of 24 Sep 2026 (Kick 45,130 followers; YouTube 65.9K main, 55K EyZed Reacts, 11.6K EyZed Gaming).
   */
  today: {
    fa: 'از ۵۸۰ فالوور توییچ در ۲۰۱۸ تا امروز، هر بار که مجبور شدم بایستم، دوباره برگشتم. حالا لایوهام روی Kick پخش می‌شه و داستان هنوز داره نوشته می‌شه.',
    en: 'From 580 Twitch followers in 2018 to today, every time I had to stop, I came back. These days I stream live on Kick, and the story is still being written.',
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
        label: { fa: 'دنبال‌کننده روی توییچ، یوتیوب و کیک', en: 'followers on Twitch, YouTube and Kick' },
      },
      {
        value: { fa: '۳۶٫۵', en: '36.5K' },
        unit: { fa: 'هزار', en: '' },
        label: { fa: 'اوج بینندهٔ هم‌زمان، The One Awards', en: 'peak concurrent viewers, The One Awards' },
      },
    ],
    note: {
      fa: 'تا ۲۴ سپتامبر ۲۰۲۶. منبع: TwitchTracker، یوتیوب و کیک. ساعت‌های لایو کیک توی این عددها حساب نشده.',
      en: 'As of 24 September 2026. Sources: TwitchTracker, YouTube and Kick. Hours streamed on Kick are not included.',
    } satisfies Localized,
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
