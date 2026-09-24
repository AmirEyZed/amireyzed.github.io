export const locales = ['fa', 'en'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'fa';

export const languageNames: Record<Lang, string> = {
  fa: 'فارسی',
  en: 'English',
};

export const dirOf = (lang: Lang): 'rtl' | 'ltr' => (lang === 'fa' ? 'rtl' : 'ltr');

export const ui = {
  fa: {
    'meta.title': 'امیر ایزد (AmirEyZed) | مسیر من، سال به سال',
    'meta.description':
      'مسیر کاری امیر ایزد (AmirEyZed) سال به سال: تیم‌های رقابتی، لایوها، پادکست‌ها، The One Awards و کار برای کامیونیتی، با عکس، لینک و منبع.',
    'meta.imageAlt': 'امیر ایزد پشت میز استریم',
    'a11y.skip': 'پرش به محتوا',
    'nav.home': 'خانه',
    'nav.years': 'سال‌ها',
    'nav.jump': 'پرش به سال',
    'lang.switch': 'English',
    'hero.range': 'از {from} تا امروز',
    'hero.scroll': 'از اول شروع کن',
    'hero.kick': 'لایوها در کیک',
    'hero.youtube': 'ویدیوها در یوتیوب',
    'timeline.title': 'مسیر سال به سال',
    'today.title': 'امروز',
    'today.follow': 'دنبال کردن در کیک',
    'today.email': 'ایمیل بزن',
    'footer.find': 'حساب‌های رسمی من',
    'photo.open': 'بزرگ کردن عکس',
    'photo.close': 'بستن عکس',
    'photo.prev': 'عکس قبلی',
    'photo.next': 'عکس بعدی',
    'photo.viewer': 'نمایش عکس',
    'stats.title': 'کل مسیر در چند عدد',
    'stats.sources': 'منبع‌ها',
    'why': 'چرا مهمه؟',
    'featured': 'لحظه مهم',
    'guests': 'مهمون‌های مهم',
    'notfound.title': 'این صفحه پیدا نشد',
    'notfound.body': 'شاید آدرس اشتباه باشه یا صفحه جابه‌جا شده.',
    'notfound.back': 'برگرد به خانه',
  },
  en: {
    'meta.title': 'Amir EyZed (AmirEyZed) | My path, year by year',
    'meta.description':
      "Amir EyZed's career, year by year: competitive teams, live streams, podcasts, The One Awards and community work, with photos, links and sources.",
    'meta.imageAlt': 'Amir EyZed at his streaming desk',
    'a11y.skip': 'Skip to content',
    'nav.home': 'Home',
    'nav.years': 'Years',
    'nav.jump': 'Jump to a year',
    'lang.switch': 'فارسی',
    'hero.range': 'From {from} to today',
    'hero.scroll': 'Start from the beginning',
    'hero.kick': 'Live on Kick',
    'hero.youtube': 'Videos on YouTube',
    'timeline.title': 'Year by year',
    'today.title': 'Today',
    'today.follow': 'Follow on Kick',
    'today.email': 'Send an email',
    'footer.find': 'My official accounts',
    'photo.open': 'Enlarge photo',
    'photo.close': 'Close photo',
    'photo.prev': 'Previous photo',
    'photo.next': 'Next photo',
    'photo.viewer': 'Photo viewer',
    'stats.title': 'The whole path in numbers',
    'stats.sources': 'Sources',
    'why': 'Why it matters:',
    'featured': 'Key moment',
    'guests': 'Notable guests',
    'notfound.title': 'Page not found',
    'notfound.body': 'The address may be wrong or the page has moved.',
    'notfound.back': 'Back home',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)['fa'];

/** Translate a key, with optional `{placeholders}`. */
export function t(lang: Lang, key: UIKey, vars: Record<string, string | number> = {}): string {
  let text: string = ui[lang][key] ?? ui[defaultLang][key] ?? key;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/** Convert Western digits to Persian digits. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]!);
}

/** Year label per language (Gregorian year, Persian digits in Persian). */
export function formatYear(year: number, lang: Lang): string {
  return lang === 'fa' ? toPersianDigits(year) : String(year);
}
