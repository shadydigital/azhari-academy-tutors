"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  countryOptions, EGYPT_GOVERNORATES, EGYPT_UNIVERSITIES, LANGUAGE_LEVELS,
  optionLabel, TEACHING_LANGUAGES, timeZoneOptions, WEEKDAYS
} from "@/lib/application-options";

type FormCopy = {
  [key: string]: string | string[];
  sections: string[];
};

type LanguageSkill = { language: string; level: string; otherLanguage?: string };
type AvailabilitySlot = { day: string; enabled: boolean; from: string; to: string };
type ApplicationLink = { type: string; url: string };
type ValidationIssue = { step: number; field: string; message: string };

export type Draft = {
  email: string;
  fullNameEnglish: string;
  fullNameArabic: string;
  phone: string;
  country: string;
  city: string;
  timezone: string;
  gender: string;
  over18: boolean;
  azharStatus: string;
  institution: string;
  institutionOther: string;
  faculty: string;
  qualification: string;
  graduationYear: string;
  hasIjazah: string;
  ijazahDetails: string;
  specializations: string[];
  ageGroups: string[];
  teachingLanguages: LanguageSkill[];
  yearsExperience: string;
  onlineExperience: string;
  previousWork: string;
  motivation: string;
  childScenario: string;
  device: string;
  deviceOther: string;
  internet: string;
  internetBackup: string;
  teachingSpace: boolean;
  videoTools: string[];
  weeklyHours: string;
  availability: AvailabilitySlot[];
  earliestStart: string;
  videoUrl: string;
  links: ApplicationLink[];
  consentAccuracy: boolean;
  consentPrivacy: boolean;
};

const initialDraft: Draft = {
  email: "", fullNameEnglish: "", fullNameArabic: "", phone: "", country: "", city: "", timezone: "",
  gender: "", over18: false, azharStatus: "", institution: "", institutionOther: "", faculty: "", qualification: "", graduationYear: "",
  hasIjazah: "", ijazahDetails: "", specializations: [], ageGroups: [], teachingLanguages: [], yearsExperience: "",
  onlineExperience: "", previousWork: "", motivation: "", childScenario: "", device: "", deviceOther: "", internet: "", internetBackup: "",
  teachingSpace: false, videoTools: [], weeklyHours: "", availability: WEEKDAYS.map(({ value }) => ({ day: value, enabled: false, from: "", to: "" })), earliestStart: "", videoUrl: "", links: [],
  consentAccuracy: false, consentPrivacy: false
};

const labels = {
  en: {
    fullNameEnglish: "Full name in English", fullNameArabic: "Full name in Arabic", phone: "WhatsApp / mobile number",
    country: "Country", city: "Governorate / city", timezone: "Time zone", gender: "Gender", male: "Male", female: "Female",
    over18: "I confirm that I am at least 18 years old", azharStatus: "Al-Azhar education", graduate: "Graduate",
    student: "Current student", none: "Other educational background", institution: "University or institute", institutionOther: "University or institute name",
    faculty: "Faculty and department", qualification: "Degree or qualification", graduationYear: "Graduation year",
    hasIjazah: "Do you hold a Quran ijazah?", yes: "Yes", no: "No", ijazahDetails: "Ijazah, narration, and granting sheikh",
    specializations: "Teaching specializations", quran: "Quran recitation", tajweed: "Tajweed", memorization: "Memorization",
    qiraat: "Qira'at / Ijazah", noor: "Noor Al-Bayan", arabic: "Arabic for non-native speakers", islamic: "Islamic studies",
    ageGroups: "Learner age groups", children: "Children", teens: "Teenagers", adults: "Adults",
    teachingLanguages: "Languages you can teach in", languageLevel: "Proficiency level", otherLanguage: "Language name", yearsExperience: "Total years of teaching experience",
    onlineExperience: "Describe your online teaching experience", previousWork: "Previous academies or teaching work",
    motivation: "Why would you like to teach with Azhari Academy?", childScenario: "How do you help a child who loses focus?",
    device: "Primary teaching device", deviceOther: "Device details", internet: "Primary internet connection", internetBackup: "Backup internet connection", teachingSpace: "I have a quiet, suitable teaching space",
    videoTools: "Online tools you can use", weeklyHours: "Available teaching hours per week", availability: "Available days and time ranges",
    earliestStart: "Earliest start date", videoUrl: "Introductory video link (optional)", additionalLinks: "CV, certificates, portfolio, or cloud links", addLink: "Add another link", remove: "Remove", linkType: "Link type", linkUrl: "URL", consentAccuracy: "I confirm that the information provided is accurate",
    consentPrivacy: "I agree to the privacy notice and recruitment-related communication", select: "Select…",
    reviewHelp: "Review the information below, confirm the declarations, and submit your application.", personalHelp: "Tell us how we can contact you.",
    educationHelp: "Share your academic qualifications and ijazahs.", teachingHelp: "Choose what and whom you are qualified to teach.",
    experienceHelp: "Help our team understand your teaching background.", readinessHelp: "Tell us about your setup and availability."
  },
  ar: {
    fullNameEnglish: "الاسم الكامل بالإنجليزية", fullNameArabic: "الاسم الكامل بالعربية", phone: "رقم واتساب أو الهاتف",
    country: "الدولة", city: "المحافظة أو المدينة", timezone: "المنطقة الزمنية", gender: "الجنس", male: "ذكر", female: "أنثى",
    over18: "أؤكد أن عمري 18 عامًا أو أكثر", azharStatus: "الدراسة في الأزهر", graduate: "خريج", student: "طالب حالي",
    none: "مؤهل تعليمي آخر", institution: "الجامعة أو المعهد", institutionOther: "اسم الجامعة أو المعهد", faculty: "الكلية والقسم", qualification: "الدرجة أو المؤهل",
    graduationYear: "سنة التخرج", hasIjazah: "هل تحمل إجازة في القرآن؟", yes: "نعم", no: "لا",
    ijazahDetails: "تفاصيل الإجازة والرواية والشيخ المجيز", specializations: "تخصصات التدريس", quran: "تلاوة القرآن",
    tajweed: "التجويد", memorization: "الحفظ والمراجعة", qiraat: "القراءات والإجازات", noor: "نور البيان",
    arabic: "العربية لغير الناطقين بها", islamic: "الدراسات الإسلامية", ageGroups: "الفئات العمرية", children: "الأطفال",
    teens: "المراهقون", adults: "البالغون", teachingLanguages: "اللغات التي تستطيع التدريس بها", languageLevel: "مستوى اللغة", otherLanguage: "اسم اللغة",
    yearsExperience: "إجمالي سنوات الخبرة", onlineExperience: "اشرح خبرتك في التدريس عن بُعد",
    previousWork: "الأكاديميات أو جهات التدريس السابقة", motivation: "لماذا ترغب في التدريس مع أكاديمية أزهري؟",
    childScenario: "كيف تساعد طفلًا يفقد تركيزه أثناء الحصة؟", device: "جهاز التدريس الأساسي", deviceOther: "تفاصيل الجهاز",
    internet: "اتصال الإنترنت الأساسي", internetBackup: "اتصال الإنترنت البديل", teachingSpace: "لدي مكان هادئ ومناسب للتدريس", videoTools: "أدوات التعليم التي تجيدها",
    weeklyHours: "عدد ساعات التدريس المتاحة أسبوعيًا", availability: "الأيام والفترات المتاحة", earliestStart: "أقرب تاريخ للبدء",
    videoUrl: "رابط الفيديو التعريفي (اختياري)", additionalLinks: "روابط السيرة الذاتية أو الشهادات أو معرض الأعمال أو التخزين السحابي", addLink: "إضافة رابط آخر", remove: "حذف", linkType: "نوع الرابط", linkUrl: "الرابط", consentAccuracy: "أؤكد صحة المعلومات المقدمة",
    consentPrivacy: "أوافق على سياسة الخصوصية والتواصل المتعلق بالتوظيف", select: "اختر…",
    reviewHelp: "راجع المعلومات وأكد الإقرارات ثم أرسل الطلب.", personalHelp: "أخبرنا كيف يمكننا التواصل معك.",
    educationHelp: "أضف مؤهلاتك الأكاديمية وإجازاتك.", teachingHelp: "حدد ما يمكنك تدريسه والفئات التي تجيد التعامل معها.",
    experienceHelp: "ساعد فريقنا على فهم خبرتك في التدريس.", readinessHelp: "أخبرنا عن تجهيزاتك والأوقات المتاحة."
  }
} as const;

function Field({ label, required, full, hint, error, children }: { label: string; required?: boolean; full?: boolean; hint?: string; error?: boolean; children: React.ReactNode }) {
  return <div className={`field${full ? " full" : ""}${error ? " invalid" : ""}`}><label>{label}{required && <span className="required"> *</span>}</label>{children}{hint && <span className="field-hint">{hint}</span>}</div>;
}

function hydrateDraft(email: string, saved?: Record<string, unknown>): Draft {
  const merged = { ...initialDraft, ...(saved || {}), email } as Draft;
  if (!Array.isArray(merged.teachingLanguages)) merged.teachingLanguages = [];
  if (!Array.isArray(merged.links)) merged.links = [];
  const savedSlots = Array.isArray(merged.availability) ? merged.availability : [];
  merged.availability = WEEKDAYS.map(({ value }) => savedSlots.find((slot) => slot?.day === value) || { day: value, enabled: false, from: "", to: "" });
  return merged;
}

export function ApplicationForm({ locale, token, continueMode, copy, initialEmail = "", initialData }: { locale: Locale; token?: string; continueMode: boolean; copy: FormCopy; initialEmail?: string; initialData?: Record<string, unknown> }) {
  const t = labels[locale];
  const [accessToken, setAccessToken] = useState(token || "");
  const [email, setEmail] = useState(initialEmail);
  const [draft, setDraft] = useState<Draft>(() => hydrateDraft(initialEmail, initialData));
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [complete, setComplete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const sections = copy.sections;
  const progress = useMemo(() => ((step + 1) / sections.length) * 100, [step, sections.length]);
  const countries = useMemo(() => countryOptions(locale), [locale]);
  const timeZones = useMemo(() => timeZoneOptions(), []);
  const graduationYears = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: current + 4 - 1950 + 1 }, (_, index) => String(current + 4 - index));
  }, []);

  async function startApplication(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/applications/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, locale, continueMode }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to start application");
      if (result.devToken) setAccessToken(result.devToken);
      else setSent(true);
      setDraft((value) => ({ ...value, email }));
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to start application"); }
    finally { setBusy(false); }
  }

  function clearFieldIssue(field: string) { setValidationIssues((current) => current.filter((issue) => issue.field !== field)); }
  function update<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft((current) => ({ ...current, [key]: value })); clearFieldIssue(key); }
  function toggle(key: "specializations" | "ageGroups" | "videoTools", value: string) {
    setDraft((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));
    clearFieldIssue(key);
  }
  function toggleLanguage(language: string) {
    setDraft((current) => ({
      ...current,
      teachingLanguages: current.teachingLanguages.some((item) => item.language === language)
        ? current.teachingLanguages.filter((item) => item.language !== language)
        : [...current.teachingLanguages, { language, level: "" }]
    }));
    clearFieldIssue("teachingLanguages");
  }
  function updateLanguage(language: string, changes: Partial<LanguageSkill>) {
    setDraft((current) => ({ ...current, teachingLanguages: current.teachingLanguages.map((item) => item.language === language ? { ...item, ...changes } : item) }));
    clearFieldIssue("teachingLanguages");
  }
  function updateAvailability(day: string, changes: Partial<AvailabilitySlot>) {
    setDraft((current) => ({ ...current, availability: current.availability.map((slot) => slot.day === day ? { ...slot, ...changes } : slot) }));
    clearFieldIssue("availability");
  }
  function addLink() {
    setDraft((current) => ({ ...current, links: [...current.links, { type: "cv", url: "" }] }));
    clearFieldIssue("links");
  }
  function updateLink(index: number, changes: Partial<ApplicationLink>) {
    setDraft((current) => ({ ...current, links: current.links.map((link, itemIndex) => itemIndex === index ? { ...link, ...changes } : link) }));
    clearFieldIssue("links");
  }
  function removeLink(index: number) {
    setDraft((current) => ({ ...current, links: current.links.filter((_, itemIndex) => itemIndex !== index) }));
    clearFieldIssue("links");
  }

  function validateStep(stepToValidate: number): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const required = (field: string, label: string) => issues.push({ step: stepToValidate, field, message: locale === "en" ? `${label} is required.` : `${label}: حقل مطلوب.` });
    const invalid = (field: string, label: string, detail?: string) => issues.push({ step: stepToValidate, field, message: locale === "en" ? `${label}: ${detail || "please review this field."}` : `${label}: ${detail || "يرجى مراجعة هذا الحقل."}` });

    if (stepToValidate === 0) {
      if (!draft.fullNameEnglish.trim()) required("fullNameEnglish", t.fullNameEnglish);
      if (!draft.fullNameArabic.trim()) required("fullNameArabic", t.fullNameArabic);
      if (!draft.email) required("email", copy.email as string);
      if (!draft.phone.trim()) required("phone", t.phone);
      if (!draft.country) required("country", t.country);
      if (!draft.city) required("city", t.city);
      if (!draft.timezone) required("timezone", t.timezone);
      if (!draft.gender) required("gender", t.gender);
      if (!draft.over18) required("over18", t.over18);
    }
    if (stepToValidate === 1) {
      if (!draft.azharStatus) required("azharStatus", t.azharStatus);
      if (!draft.institution) required("institution", t.institution);
      if (draft.institution === "other" && !draft.institutionOther.trim()) required("institutionOther", t.institutionOther);
      if (!draft.qualification.trim()) required("qualification", t.qualification);
      if (!draft.hasIjazah) required("hasIjazah", t.hasIjazah);
    }
    if (stepToValidate === 2) {
      if (!draft.specializations.length) required("specializations", t.specializations);
      if (!draft.ageGroups.length) required("ageGroups", t.ageGroups);
      if (!draft.teachingLanguages.length) required("teachingLanguages", t.teachingLanguages);
      if (draft.teachingLanguages.some((item) => !item.level)) invalid("teachingLanguages", t.teachingLanguages, locale === "en" ? "choose a proficiency level for every selected language." : "اختر مستوى لكل لغة محددة.");
      if (draft.teachingLanguages.some((item) => item.language === "other" && !item.otherLanguage?.trim())) required("teachingLanguages", t.otherLanguage);
    }
    if (stepToValidate === 3) {
      if (!draft.yearsExperience) required("yearsExperience", t.yearsExperience);
      if (!draft.onlineExperience.trim()) required("onlineExperience", t.onlineExperience);
      else if (draft.onlineExperience.trim().length < 10) invalid("onlineExperience", t.onlineExperience, locale === "en" ? "write at least 10 characters." : "اكتب 10 أحرف على الأقل.");
      if (!draft.motivation.trim()) required("motivation", t.motivation);
      else if (draft.motivation.trim().length < 20) invalid("motivation", t.motivation, locale === "en" ? "write at least 20 characters." : "اكتب 20 حرفًا على الأقل.");
      if (!draft.childScenario.trim()) required("childScenario", t.childScenario);
      else if (draft.childScenario.trim().length < 20) invalid("childScenario", t.childScenario, locale === "en" ? "write at least 20 characters." : "اكتب 20 حرفًا على الأقل.");
    }
    if (stepToValidate === 4) {
      if (!draft.device) required("device", t.device);
      if (draft.device === "other" && !draft.deviceOther.trim()) required("deviceOther", t.deviceOther);
      if (!draft.internet) required("internet", t.internet);
      if (!draft.internetBackup) required("internetBackup", t.internetBackup);
      if (!draft.weeklyHours) required("weeklyHours", t.weeklyHours);
      if (!draft.earliestStart) required("earliestStart", t.earliestStart);
      const enabledSlots = draft.availability.filter((slot) => slot.enabled);
      if (!enabledSlots.length) required("availability", t.availability);
      else if (enabledSlots.some((slot) => !slot.from || !slot.to)) invalid("availability", t.availability, locale === "en" ? "complete the start and end time for each selected day." : "أكمل وقت البداية والنهاية لكل يوم محدد.");
      draft.links.forEach((link, index) => {
        if (!link.url.trim()) required("links", `${t.additionalLinks} ${index + 1}`);
        else { try { new URL(link.url); } catch { invalid("links", `${t.additionalLinks} ${index + 1}`, locale === "en" ? "enter a valid link." : "أدخل رابطًا صحيحًا."); } }
      });
    }
    if (stepToValidate === 5) {
      if (!draft.consentAccuracy) required("consentAccuracy", t.consentAccuracy);
      if (!draft.consentPrivacy) required("consentPrivacy", t.consentPrivacy);
    }
    return issues;
  }

  function fieldStep(field: string) {
    if (["fullNameEnglish", "fullNameArabic", "email", "phone", "country", "city", "timezone", "gender", "over18"].includes(field)) return 0;
    if (["azharStatus", "institution", "institutionOther", "qualification", "hasIjazah"].includes(field)) return 1;
    if (["specializations", "ageGroups", "teachingLanguages"].includes(field)) return 2;
    if (["yearsExperience", "onlineExperience", "motivation", "childScenario"].includes(field)) return 3;
    if (["device", "deviceOther", "internet", "internetBackup", "weeklyHours", "earliestStart", "availability", "links"].includes(field)) return 4;
    return 5;
  }

  function fieldLabel(field: string) {
    const names: Record<string, string> = {
      fullNameEnglish: t.fullNameEnglish, fullNameArabic: t.fullNameArabic, email: copy.email as string, phone: t.phone,
      country: t.country, city: t.city, timezone: t.timezone, gender: t.gender, over18: t.over18,
      azharStatus: t.azharStatus, institution: t.institution, institutionOther: t.institutionOther, qualification: t.qualification, hasIjazah: t.hasIjazah,
      specializations: t.specializations, ageGroups: t.ageGroups, teachingLanguages: t.teachingLanguages,
      yearsExperience: t.yearsExperience, onlineExperience: t.onlineExperience, motivation: t.motivation, childScenario: t.childScenario,
      device: t.device, deviceOther: t.deviceOther, internet: t.internet, internetBackup: t.internetBackup, weeklyHours: t.weeklyHours,
      earliestStart: t.earliestStart, availability: t.availability, links: t.additionalLinks, consentAccuracy: t.consentAccuracy, consentPrivacy: t.consentPrivacy
    };
    return names[field] || field;
  }

  async function saveAndContinue() {
    const issues = validateStep(step);
    if (issues.length) { setValidationIssues(issues); setMessage(""); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/applications/draft", { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ step, data: draft, locale }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to save your progress");
      setStep((value) => Math.min(value + 1, sections.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save your progress"); }
    finally { setBusy(false); }
  }

  async function submitApplication() {
    const issues = Array.from({ length: sections.length }, (_, index) => validateStep(index)).flat();
    if (issues.length) {
      setValidationIssues(issues);
      setStep(issues[0].step);
      setMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/applications/submit", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ data: draft, locale }) });
      const result = await response.json();
      if (!response.ok) {
        if (Array.isArray(result.fields) && result.fields.length) {
          const responseIssues: ValidationIssue[] = result.fields.map((field: unknown) => {
            const name = String(field);
            return { step: fieldStep(name), field: name, message: locale === "en" ? `${fieldLabel(name)}: please review this field.` : `${fieldLabel(name)}: يرجى مراجعة هذا الحقل.` };
          });
          setValidationIssues(responseIssues);
          setStep(responseIssues[0].step);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        throw new Error(result.message || "Unable to submit application");
      }
      setComplete(true);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to submit your application"); }
    finally { setBusy(false); }
  }

  if (!accessToken) {
    return <section className="start-card"><div className="form-card">
      {sent ? <div className="completion"><div className="completion-icon">✉</div><h2>{copy.sentTitle}</h2><p>{copy.sentText}</p></div> : <>
        <div className="form-heading"><p>Azhari Academy</p><h2>{copy.startTitle}</h2><small>{copy.startText}</small></div>
        <form className="fields" onSubmit={startApplication}>
          <Field label={copy.email as string} required><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></Field>
          {message && <p className="form-message error">{message}</p>}
          <button className="button button-dark" disabled={busy}>{busy ? copy.saving : copy.sendLink}</button>
        </form>
      </>}
    </div></section>;
  }

  if (complete) return <section className="start-card"><div className="form-card completion"><div className="completion-icon">✓</div><h2>{copy.successTitle}</h2><p>{copy.successText}</p></div></section>;

  const helpers = [t.personalHelp, t.educationHelp, t.teachingHelp, t.experienceHelp, t.readinessHelp, t.reviewHelp];
  const visibleIssues = validationIssues.filter((issue) => issue.step === step);
  const hasIssue = (field: string) => visibleIssues.some((issue) => issue.field === field);

  return <div className="application-layout">
    <aside className="application-sidebar"><h1>{copy.title}</h1><p>{copy.subtitle}</p><div className="progress-track"><div className="progress-value" style={{ width: `${progress}%` }} /></div>
      <div className="steps">{sections.map((name, index) => <div className={`step-item${index === step ? " active" : ""}${index < step ? " complete" : ""}`} key={name}><span className="step-number">{index < step ? "✓" : index + 1}</span><span>{name}</span></div>)}</div>
    </aside>
    <section className="form-card">
      <div className="form-heading"><p>{copy.step} {step + 1} / {sections.length}</p><h2>{sections[step]}</h2><small>{helpers[step]}</small></div>
      {visibleIssues.length > 0 && <div className="form-message error validation-summary" role="alert"><strong>{locale === "en" ? "Please review these fields:" : "يرجى مراجعة الحقول التالية:"}</strong><ul>{visibleIssues.map((issue, index) => <li key={`${issue.field}-${index}`}>{issue.message}</li>)}</ul></div>}
      <div className="fields">
        {step === 0 && <>
          <Field label={t.fullNameEnglish} required error={hasIssue("fullNameEnglish")}><input value={draft.fullNameEnglish} onChange={(e) => update("fullNameEnglish", e.target.value)} /></Field>
          <Field label={t.fullNameArabic} required error={hasIssue("fullNameArabic")}><input value={draft.fullNameArabic} onChange={(e) => update("fullNameArabic", e.target.value)} /></Field>
          <Field label={copy.email as string} required error={hasIssue("email")} hint={locale === "en" ? "Verified through your secure email link." : "تم التحقق منه من خلال الرابط الآمن المرسل إلى بريدك."}><input value={draft.email || email} readOnly className="verified-input" /></Field>
          <Field label={t.phone} required error={hasIssue("phone")}><input type="tel" value={draft.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
          <Field label={t.country} required error={hasIssue("country")}><select value={draft.country} onChange={(e) => { update("country", e.target.value); update("city", ""); if (e.target.value === "EG" && !draft.timezone) update("timezone", "Africa/Cairo"); }}><option value="">{t.select}</option>{countries.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></Field>
          <Field label={t.city} required error={hasIssue("city")}>{draft.country === "EG" ? <select value={draft.city} onChange={(e) => update("city", e.target.value)}><option value="">{t.select}</option>{EGYPT_GOVERNORATES.map((item) => <option value={item.value} key={item.value}>{optionLabel(item, locale)}</option>)}</select> : <input value={draft.city} onChange={(e) => update("city", e.target.value)} />}</Field>
          <Field label={t.timezone} required error={hasIssue("timezone")}><select value={draft.timezone} onChange={(e) => update("timezone", e.target.value)}><option value="">{t.select}</option>{timeZones.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></Field>
          <Field label={t.gender} required error={hasIssue("gender")}><select value={draft.gender} onChange={(e) => update("gender", e.target.value)}><option value="">{t.select}</option><option value="male">{t.male}</option><option value="female">{t.female}</option></select></Field>
          <label className={`choice field full${hasIssue("over18") ? " invalid" : ""}`}><input type="checkbox" checked={draft.over18} onChange={(e) => update("over18", e.target.checked)} />{t.over18}</label>
        </>}
        {step === 1 && <>
          <Field label={t.azharStatus} required error={hasIssue("azharStatus")}><select value={draft.azharStatus} onChange={(e) => update("azharStatus", e.target.value)}><option value="">{t.select}</option><option value="graduate">{t.graduate}</option><option value="student">{t.student}</option><option value="other">{t.none}</option></select></Field>
          <Field label={t.institution} required error={hasIssue("institution")}>{draft.country === "EG" ? <select value={draft.institution} onChange={(e) => update("institution", e.target.value)}><option value="">{t.select}</option>{EGYPT_UNIVERSITIES.map((item) => <option value={item.value} key={item.value}>{optionLabel(item, locale)}</option>)}<option value="other">{locale === "en" ? "Other university or institute" : "جامعة أو معهد آخر"}</option></select> : <input value={draft.institution} onChange={(e) => update("institution", e.target.value)} />}</Field>
          {draft.institution === "other" && <Field label={t.institutionOther} required error={hasIssue("institutionOther")}><input value={draft.institutionOther} onChange={(e) => update("institutionOther", e.target.value)} /></Field>}
          <Field label={t.faculty}><input value={draft.faculty} onChange={(e) => update("faculty", e.target.value)} /></Field>
          <Field label={t.qualification} required error={hasIssue("qualification")}><input value={draft.qualification} onChange={(e) => update("qualification", e.target.value)} /></Field>
          <Field label={t.graduationYear}><select value={draft.graduationYear} onChange={(e) => update("graduationYear", e.target.value)}><option value="">{t.select}</option><option value="not_graduated">{locale === "en" ? "Not graduated yet" : "لم أتخرج بعد"}</option>{graduationYears.map((year) => <option value={year} key={year}>{year}</option>)}</select></Field>
          <Field label={t.hasIjazah} required error={hasIssue("hasIjazah")}><select value={draft.hasIjazah} onChange={(e) => update("hasIjazah", e.target.value)}><option value="">{t.select}</option><option value="yes">{t.yes}</option><option value="no">{t.no}</option></select></Field>
          {draft.hasIjazah === "yes" && <Field label={t.ijazahDetails} full><textarea value={draft.ijazahDetails} onChange={(e) => update("ijazahDetails", e.target.value)} /></Field>}
        </>}
        {step === 2 && <>
          <Field label={t.specializations} required full error={hasIssue("specializations")}><div className="choice-grid">{[["quran", t.quran], ["tajweed", t.tajweed], ["memorization", t.memorization], ["qiraat", t.qiraat], ["noor", t.noor], ["arabic", t.arabic], ["islamic", t.islamic]].map(([value, label]) => <label className="choice" key={value}><input type="checkbox" checked={draft.specializations.includes(value)} onChange={() => toggle("specializations", value)} />{label}</label>)}</div></Field>
          <Field label={t.ageGroups} required full error={hasIssue("ageGroups")}><div className="choice-grid">{[["children", t.children], ["teens", t.teens], ["adults", t.adults]].map(([value, label]) => <label className="choice" key={value}><input type="checkbox" checked={draft.ageGroups.includes(value)} onChange={() => toggle("ageGroups", value)} />{label}</label>)}</div></Field>
          <Field label={t.teachingLanguages} required full error={hasIssue("teachingLanguages")}><div className="language-list">{TEACHING_LANGUAGES.map((language) => { const skill = draft.teachingLanguages.find((item) => item.language === language.value); return <div className={`language-row${skill ? " selected" : ""}`} key={language.value}><label className="choice"><input type="checkbox" checked={Boolean(skill)} onChange={() => toggleLanguage(language.value)} />{optionLabel(language, locale)}</label>{skill && <><select aria-label={t.languageLevel} value={skill.level} onChange={(e) => updateLanguage(language.value, { level: e.target.value })}><option value="">{t.languageLevel}</option>{LANGUAGE_LEVELS.map((level) => <option value={level.value} key={level.value}>{optionLabel(level, locale)}</option>)}</select>{language.value === "other" && <input aria-label={t.otherLanguage} placeholder={t.otherLanguage} value={skill.otherLanguage || ""} onChange={(e) => updateLanguage(language.value, { otherLanguage: e.target.value })} />}</>}</div>; })}</div></Field>
        </>}
        {step === 3 && <>
          <Field label={t.yearsExperience} required error={hasIssue("yearsExperience")}><input type="number" min="0" max="60" value={draft.yearsExperience} onChange={(e) => update("yearsExperience", e.target.value)} /></Field>
          <Field label={t.onlineExperience} required full error={hasIssue("onlineExperience")}><textarea value={draft.onlineExperience} onChange={(e) => update("onlineExperience", e.target.value)} /></Field>
          <Field label={t.previousWork} full><textarea value={draft.previousWork} onChange={(e) => update("previousWork", e.target.value)} /></Field>
          <Field label={t.motivation} required full error={hasIssue("motivation")}><textarea value={draft.motivation} onChange={(e) => update("motivation", e.target.value)} /></Field>
          <Field label={t.childScenario} required full error={hasIssue("childScenario")}><textarea value={draft.childScenario} onChange={(e) => update("childScenario", e.target.value)} /></Field>
        </>}
        {step === 4 && <>
          <Field label={t.device} required error={hasIssue("device")}><select value={draft.device} onChange={(e) => update("device", e.target.value)}><option value="">{t.select}</option><option value="desktop">{locale === "en" ? "Desktop computer" : "حاسوب مكتبي"}</option><option value="laptop">{locale === "en" ? "Laptop" : "حاسوب محمول"}</option><option value="tablet">{locale === "en" ? "Tablet" : "جهاز لوحي"}</option><option value="smartphone">{locale === "en" ? "Smartphone" : "هاتف ذكي"}</option><option value="other">{locale === "en" ? "Other" : "أخرى"}</option></select></Field>
          {draft.device === "other" && <Field label={t.deviceOther} required error={hasIssue("deviceOther")}><input value={draft.deviceOther} onChange={(e) => update("deviceOther", e.target.value)} /></Field>}
          <Field label={t.internet} required error={hasIssue("internet")}><select value={draft.internet} onChange={(e) => update("internet", e.target.value)}><option value="">{t.select}</option><option value="fiber">{locale === "en" ? "Fiber" : "ألياف ضوئية"}</option><option value="vdsl">VDSL / DSL</option><option value="fixed-wireless">{locale === "en" ? "Fixed wireless" : "إنترنت لاسلكي ثابت"}</option><option value="mobile-data">{locale === "en" ? "Mobile data" : "بيانات الهاتف"}</option><option value="other">{locale === "en" ? "Other" : "أخرى"}</option></select></Field>
          <Field label={t.internetBackup} required error={hasIssue("internetBackup")}><select value={draft.internetBackup} onChange={(e) => update("internetBackup", e.target.value)}><option value="">{t.select}</option><option value="mobile-data">{locale === "en" ? "Mobile data" : "بيانات الهاتف"}</option><option value="second-line">{locale === "en" ? "Second fixed line" : "خط إنترنت ثابت ثانٍ"}</option><option value="portable-router">{locale === "en" ? "Portable router" : "راوتر متنقل"}</option><option value="other">{locale === "en" ? "Other available backup" : "بديل آخر متاح"}</option><option value="none">{locale === "en" ? "No backup connection" : "لا يوجد اتصال بديل"}</option></select></Field>
          <label className="choice field full"><input type="checkbox" checked={draft.teachingSpace} onChange={(e) => update("teachingSpace", e.target.checked)} />{t.teachingSpace}</label>
          <Field label={t.videoTools} full><div className="choice-grid">{["Zoom", "Google Meet", "Digital whiteboard", "Screen sharing"].map((value) => <label className="choice" key={value}><input type="checkbox" checked={draft.videoTools.includes(value)} onChange={() => toggle("videoTools", value)} />{value}</label>)}</div></Field>
          <Field label={t.weeklyHours} required error={hasIssue("weeklyHours")}><input type="number" min="1" max="80" value={draft.weeklyHours} onChange={(e) => update("weeklyHours", e.target.value)} /></Field>
          <Field label={t.earliestStart} required error={hasIssue("earliestStart")}><input type="date" value={draft.earliestStart} onChange={(e) => update("earliestStart", e.target.value)} /></Field>
          <Field label={t.availability} required full error={hasIssue("availability")} hint={draft.timezone ? `${locale === "en" ? "All times use" : "جميع المواعيد حسب"}: ${draft.timezone}` : undefined}><div className="availability-list">{WEEKDAYS.map((day) => { const slot = draft.availability.find((item) => item.day === day.value)!; return <div className={`availability-row${slot.enabled ? " selected" : ""}`} key={day.value}><label className="choice"><input type="checkbox" checked={slot.enabled} onChange={(e) => updateAvailability(day.value, { enabled: e.target.checked })} />{optionLabel(day, locale)}</label><label><span>{locale === "en" ? "From" : "من"}</span><input type="time" value={slot.from} disabled={!slot.enabled} onChange={(e) => updateAvailability(day.value, { from: e.target.value })} /></label><label><span>{locale === "en" ? "To" : "إلى"}</span><input type="time" value={slot.to} disabled={!slot.enabled} onChange={(e) => updateAvailability(day.value, { to: e.target.value })} /></label></div>; })}</div></Field>
          <Field label={t.videoUrl} full><input type="url" value={draft.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} placeholder="https://" /></Field>
          <Field label={t.additionalLinks} full error={hasIssue("links")}><div className="links-list">{draft.links.map((link, index) => <div className="link-row" key={index}><select aria-label={t.linkType} value={link.type} onChange={(e) => updateLink(index, { type: e.target.value })}><option value="cv">{locale === "en" ? "CV / résumé" : "السيرة الذاتية"}</option><option value="certificates">{locale === "en" ? "Certificates" : "الشهادات"}</option><option value="portfolio">{locale === "en" ? "Portfolio" : "معرض الأعمال"}</option><option value="cloud">{locale === "en" ? "Google Drive / cloud folder" : "جوجل درايف أو مجلد سحابي"}</option><option value="linkedin">LinkedIn</option><option value="other">{locale === "en" ? "Other" : "أخرى"}</option></select><input type="url" aria-label={t.linkUrl} value={link.url} onChange={(e) => updateLink(index, { url: e.target.value })} placeholder="https://" /><button className="remove-link" type="button" onClick={() => removeLink(index)}>{t.remove}</button></div>)}<button className="button button-light add-link" type="button" onClick={addLink}>+ {t.addLink}</button></div></Field>
        </>}
        {step === 5 && <>
          <div className="field full"><div className="form-message success">{locale === "en" ? `Application for ${draft.fullNameEnglish || "applicant"} · ${draft.email || email}` : `طلب المتقدم ${draft.fullNameArabic || ""} · ${draft.email || email}`}</div></div>
          <label className="choice field full"><input type="checkbox" checked={draft.consentAccuracy} onChange={(e) => update("consentAccuracy", e.target.checked)} />{t.consentAccuracy}</label>
          <label className="choice field full"><input type="checkbox" checked={draft.consentPrivacy} onChange={(e) => update("consentPrivacy", e.target.checked)} />{t.consentPrivacy}</label>
        </>}
      </div>
      {message && <p className="form-message error">{message}</p>}
      <div className="form-actions">
        <button className="button button-light" type="button" disabled={step === 0 || busy} onClick={() => setStep((value) => Math.max(0, value - 1))}>{copy.back}</button>
        {step < sections.length - 1 ? <button className="button button-dark" type="button" disabled={busy} onClick={saveAndContinue}>{busy ? copy.saving : copy.next}</button> : <button className="button button-dark" type="button" disabled={busy || !draft.consentAccuracy || !draft.consentPrivacy} onClick={submitApplication}>{busy ? copy.saving : copy.submit}</button>}
      </div>
    </section>
  </div>;
}
