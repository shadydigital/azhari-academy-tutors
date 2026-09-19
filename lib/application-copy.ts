import type { Locale } from "./i18n";

export const applicationCopy = {
  en: {
    title: "Teacher application",
    subtitle: "Complete the sections below. Your progress is saved as you go.",
    step: "Step",
    required: "Required fields",
    back: "Back",
    next: "Save & continue",
    submit: "Submit application",
    saving: "Saving…",
    startTitle: "Start your application",
    startText: "Enter your email address. We will send you a secure link to continue your application.",
    email: "Email address",
    sendLink: "Send secure link",
    sentTitle: "Check your inbox",
    sentText: "We sent a secure application link to your email address.",
    successTitle: "Application received",
    successText: "Thank you for applying to Azhari Academy. We have sent a confirmation to your email.",
    sections: ["Personal", "Qualifications", "Teaching", "Experience", "Readiness", "Review"]
  },
  ar: {
    title: "طلب الانضمام للتدريس",
    subtitle: "أكمل الأقسام التالية. يُحفظ تقدمك تلقائيًا أثناء التقديم.",
    step: "الخطوة",
    required: "الحقول المطلوبة",
    back: "السابق",
    next: "حفظ ومتابعة",
    submit: "إرسال الطلب",
    saving: "جارٍ الحفظ…",
    startTitle: "ابدأ طلب التقديم",
    startText: "أدخل بريدك الإلكتروني وسنرسل إليك رابطًا آمنًا لبدء الطلب أو استكماله.",
    email: "البريد الإلكتروني",
    sendLink: "إرسال الرابط الآمن",
    sentTitle: "تحقق من بريدك",
    sentText: "أرسلنا رابطًا آمنًا إلى بريدك الإلكتروني لاستكمال طلب التقديم.",
    successTitle: "تم استلام طلبك",
    successText: "شكرًا لتقديمك إلى أكاديمية أزهري. أرسلنا رسالة تأكيد إلى بريدك الإلكتروني.",
    sections: ["البيانات", "المؤهلات", "التدريس", "الخبرة", "الجاهزية", "المراجعة"]
  }
} satisfies Record<Locale, { [key: string]: string | string[] }>;
