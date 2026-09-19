export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const copy = {
  en: {
    languageName: "العربية",
    headline: "Teach with purpose.",
    title: "Join the teaching team at Azhari Academy",
    intro: "Share your knowledge of the Quran, Arabic, or Islamic studies with learners around the world through thoughtful, professional online teaching.",
    start: "Start your application",
    continue: "Continue an existing application",
    note: "Your progress is saved securely. You can return at any time.",
    privacy: "Privacy",
    staff: "Staff sign in",
    application: "Teacher application"
  },
  ar: {
    languageName: "English",
    headline: "علِّم برسالة.",
    title: "انضم إلى فريق المعلمين في أكاديمية أزهري",
    intro: "شارك علمك في القرآن الكريم أو اللغة العربية أو الدراسات الإسلامية مع طلاب من مختلف أنحاء العالم من خلال تعليم إلكتروني مهني وهادف.",
    start: "ابدأ طلب التقديم",
    continue: "استكمل طلبًا سابقًا",
    note: "يُحفظ تقدمك بأمان، ويمكنك العودة لاستكمال الطلب في أي وقت.",
    privacy: "الخصوصية",
    staff: "دخول فريق العمل",
    application: "طلب الانضمام للتدريس"
  }
} satisfies Record<Locale, Record<string, string>>;
