import type { Lang } from '../i18n/ui';

type Localized = Record<Lang, string>;

export interface AboutItem {
  question: Localized;
  answer: Localized;
  /** Optional short list under the answer. */
  points?: Record<Lang, string[]>;
}

/**
 * "Who is Amir EyZed?": short, direct answers for people and for search and AI assistants.
 * Every fact comes from a timeline entry (see its source comment) or from site.ts.
 * Birth date: confirmed by him on 2026-09-25 (30 Esfand 1375).
 */
export const about: AboutItem[] = [
  {
    question: { fa: 'امیر ایزد کیست؟', en: 'Who is Amir EyZed?' },
    answer: {
      fa: 'امیر ایزد (AmirEyZed) با اسم واقعی امیرصالح زارع، متولد ۳۰ اسفند ۱۳۷۵ (۲۰ مارس ۱۹۹۷)، استریمر، یوتیوبر و پادکستر ایرانی و برگزارکننده The One Awards است. مسیرش رو سال ۲۰۱۷ با رینبو سیکس رقابتی و استریم روی توییچ شروع کرد و در The One Awards برنده جایزه بهترین استریمر سال شد.',
      en: 'Amir EyZed (AmirEyZed), born Amirsaleh Zare on March 20, 1997, is an Iranian streamer, YouTuber and podcaster, and the organizer of The One Awards. He started in 2017 with competitive Rainbow Six and streaming on Twitch, and he won Streamer of the Year at The One Awards.',
    },
  },
  {
    question: {
      fa: 'امیر ایزد در The One Awards چه جایزه‌ای گرفت؟',
      en: 'What did Amir EyZed win at The One Awards?',
    },
    answer: {
      fa: 'در The One Awards ۲۰۲۵ برنده جایزه بهترین استریمر سال و جایزه بهترین محتواساز ری‌اکشن شد. برنده‌ها با ۷۰ درصد رای مردم و ۳۰ درصد رای داورها انتخاب شدن. خود The One Awards، مراسم جوایز یوتیوبرها و استریمرهای فارسی، رو هم امیر ایزد برگزار کرد و ویدیوی کامل مراسم در یوتیوب از یک میلیون بازدید گذشته.',
      en: 'At The One Awards 2025 he won Streamer of the Year and Best Reaction Creator. Winners were chosen 70% by public vote and 30% by the judges. He also organized The One Awards itself, the awards ceremony for Persian YouTubers and streamers, and the full ceremony video has passed one million views on YouTube.',
    },
  },
  {
    question: { fa: 'امیر ایزد کجا استریم می‌کنه؟', en: 'Where does Amir EyZed stream?' },
    answer: {
      fa: 'از اکتبر ۲۰۲۵ همه لایوهاش روی کیک (kick.com/amireyzed) پخش میشه و پارتنر کیک است. قبل از اون از ۲۰۱۷ روی توییچ استریم می‌کرد، پارتنر توییچ بود و ۷٬۷۱۷ ساعت فقط روی توییچ لایو رفت. یوتیوب برای خلاصه‌ها و ویدیوهای ادیت‌شده‌ست؛ روی کانال اصلی AmirEyZed، کانال هایلایت استریم‌ها و EyZed Gaming.',
      en: 'Since October 2025 all his live streams are on Kick (kick.com/amireyzed), where he is a partner. Before that he streamed on Twitch from 2017, as a Twitch partner, with 7,717 hours live on Twitch alone. YouTube carries highlights and edited videos, on the main AmirEyZed channel, a stream-highlights channel and EyZed Gaming.',
    },
  },
  {
    question: {
      fa: 'افتخارات و رکوردهای امیر ایزد چیه؟',
      en: 'What are Amir EyZed’s titles and records?',
    },
    answer: {
      fa: 'مهم‌ترین‌هاش، هر کدوم با منبع در همین صفحه:',
      en: 'The main ones, each with its source on this page:',
    },
    points: {
      fa: [
        'بهترین استریمر سال و بهترین محتواساز ری‌اکشن در The One Awards ۲۰۲۵',
        'قهرمان فصل سوم پرشین پرولیگ رینبو سیکس با Critical Gaming در ۲۰۱۷',
        'اول مشترک «مسابقه ۵۰ یوتوبر برای ۱۰۰ میلیون» بنیامین در ۲۰۲۴',
        'قهرمان «گل یا پوچ با یوتوبرها» در ۲۰۲۴',
        'رکورد بیشترین بیننده هم‌زمان بین استریمرهای ایرانی کیک: ۱۵٫۴ هزار نفر در اوت ۲۰۲۶',
        'رکورد بیشترین دونیت در یک استریم فارسی: ۲ میلیارد تومن در ژوئن ۲۰۲۶',
      ],
      en: [
        'Streamer of the Year and Best Reaction Creator at The One Awards 2025',
        'Champion of the Persian Pro League Rainbow Six Siege, season 3, with Critical Gaming in 2017',
        'Joint winner of TheBeniamin’s “50 YouTubers for 100 Million” in 2024',
        'Winner of “Gol ya Pooch with YouTubers” in 2024',
        'Record for concurrent viewers among Iranian Kick streamers: 15.4K in August 2026',
        'Record for donations in a single Persian stream: 2 billion toman in June 2026',
      ],
    },
  },
  {
    question: {
      fa: 'برنامه‌ها و پادکست‌های امیر ایزد کدوم‌ها هستن؟',
      en: 'Which shows and podcasts has Amir EyZed made?',
    },
    answer: {
      fa: '«صندلی داغ» (۲۰۲۰)، «Hot MoZ» (۲۰۲۱)، «موزکست» و «میدنایت» (۲۰۲۳)، «چهل‌وپنج دقیقه» (۲۰۲۵) و «شورگج»، اولین پادکست زنده فارسی روی کیک (۲۰۲۵). مهمون پادکست‌هایی مثل فیوز، Cozy Corner و Manganeh هم بوده.',
      en: 'Hot Seat (2020), Hot MoZ (2021), MoZCast and MidNight (2023), 45 Minutes (2025) and SHEVARGEJ, the first live Persian podcast on Kick (2025). He has also been a guest on podcasts such as Fuse, Cozy Corner and Manganeh.',
    },
  },
  {
    question: {
      fa: 'حساب‌های رسمی امیر ایزد کدوم‌ها هستن؟',
      en: 'What are Amir EyZed’s official accounts?',
    },
    answer: {
      fa: 'سایت رسمی amireyzed.com و حساب‌های Kick، YouTube، Instagram، Telegram، X و Twitch با نام AmirEyZed. لینک همه‌شون پایین همین صفحه هست.',
      en: 'The official site amireyzed.com and the AmirEyZed accounts on Kick, YouTube, Instagram, Telegram, X and Twitch. All of them are linked at the bottom of this page.',
    },
  },
];
