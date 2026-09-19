"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

type FormCopy = {
  [key: string]: string | string[];
  sections: string[];
};

type Draft = {
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
  faculty: string;
  qualification: string;
  graduationYear: string;
  hasIjazah: string;
  ijazahDetails: string;
  specializations: string[];
  ageGroups: string[];
  teachingLanguages: string;
  yearsExperience: string;
  onlineExperience: string;
  previousWork: string;
  motivation: string;
  childScenario: string;
  device: string;
  internet: string;
  teachingSpace: boolean;
  videoTools: string[];
  weeklyHours: string;
  availability: string;
  earliestStart: string;
  videoUrl: string;
  consentAccuracy: boolean;
  consentPrivacy: boolean;
};

const initialDraft: Draft = {
  email: "", fullNameEnglish: "", fullNameArabic: "", phone: "", country: "", city: "", timezone: "",
  gender: "", over18: false, azharStatus: "", institution: "", faculty: "", qualification: "", graduationYear: "",
  hasIjazah: "", ijazahDetails: "", specializations: [], ageGroups: [], teachingLanguages: "", yearsExperience: "",
  onlineExperience: "", previousWork: "", motivation: "", childScenario: "", device: "", internet: "",
  teachingSpace: false, videoTools: [], weeklyHours: "", availability: "", earliestStart: "", videoUrl: "",
  consentAccuracy: false, consentPrivacy: false
};

const labels = {
  en: {
    fullNameEnglish: "Full name in English", fullNameArabic: "Full name in Arabic", phone: "WhatsApp / mobile number",
    country: "Country", city: "City", timezone: "Time zone", gender: "Gender", male: "Male", female: "Female",
    over18: "I confirm that I am at least 18 years old", azharStatus: "Al-Azhar education", graduate: "Graduate",
    student: "Current student", none: "Other educational background", institution: "University or institute",
    faculty: "Faculty and department", qualification: "Degree or qualification", graduationYear: "Graduation year",
    hasIjazah: "Do you hold a Quran ijazah?", yes: "Yes", no: "No", ijazahDetails: "Ijazah, narration, and granting sheikh",
    specializations: "Teaching specializations", quran: "Quran recitation", tajweed: "Tajweed", memorization: "Memorization",
    qiraat: "Qira'at / Ijazah", noor: "Noor Al-Bayan", arabic: "Arabic for non-native speakers", islamic: "Islamic studies",
    ageGroups: "Learner age groups", children: "Children", teens: "Teenagers", adults: "Adults",
    teachingLanguages: "Languages you can teach in", yearsExperience: "Total years of teaching experience",
    onlineExperience: "Describe your online teaching experience", previousWork: "Previous academies or teaching work",
    motivation: "Why would you like to teach with Azhari Academy?", childScenario: "How do you help a child who loses focus?",
    device: "Primary teaching device", internet: "Internet connection and backup plan", teachingSpace: "I have a quiet, suitable teaching space",
    videoTools: "Online tools you can use", weeklyHours: "Available teaching hours per week", availability: "Available days and time ranges",
    earliestStart: "Earliest start date", videoUrl: "Introductory video link (optional)", consentAccuracy: "I confirm that the information provided is accurate",
    consentPrivacy: "I agree to the privacy notice and recruitment-related communication", select: "Select…",
    reviewHelp: "Review the information below, confirm the declarations, and submit your application.", personalHelp: "Tell us how we can contact you.",
    educationHelp: "Share your academic qualifications and ijazahs.", teachingHelp: "Choose what and whom you are qualified to teach.",
    experienceHelp: "Help our team understand your teaching background.", readinessHelp: "Tell us about your setup and availability."
  },
  ar: {
    fullNameEnglish: "الاسم الكامل بالإنجليزية", fullNameArabic: "الاسم الكامل بالعربية", phone: "رقم واتساب أو الهاتف",
    country: "الدولة", city: "المدينة", timezone: "المنطقة الزمنية", gender: "الجنس", male: "ذكر", female: "أنثى",
    over18: "أؤكد أن عمري 18 عامًا أو أكثر", azharStatus: "الدراسة في الأزهر", graduate: "خريج", student: "طالب حالي",
    none: "مؤهل تعليمي آخر", institution: "الجامعة أو المعهد", faculty: "الكلية والقسم", qualification: "الدرجة أو المؤهل",
    graduationYear: "سنة التخرج", hasIjazah: "هل تحمل إجازة في القرآن؟", yes: "نعم", no: "لا",
    ijazahDetails: "تفاصيل الإجازة والرواية والشيخ المجيز", specializations: "تخصصات التدريس", quran: "تلاوة القرآن",
    tajweed: "التجويد", memorization: "الحفظ والمراجعة", qiraat: "القراءات والإجازات", noor: "نور البيان",
    arabic: "العربية لغير الناطقين بها", islamic: "الدراسات الإسلامية", ageGroups: "الفئات العمرية", children: "الأطفال",
    teens: "المراهقون", adults: "البالغون", teachingLanguages: "اللغات التي تستطيع التدريس بها",
    yearsExperience: "إجمالي سنوات الخبرة", onlineExperience: "اشرح خبرتك في التدريس عن بُعد",
    previousWork: "الأكاديميات أو جهات التدريس السابقة", motivation: "لماذا ترغب في التدريس مع أكاديمية أزهري؟",
    childScenario: "كيف تساعد طفلًا يفقد تركيزه أثناء الحصة؟", device: "جهاز التدريس الأساسي",
    internet: "اتصال الإنترنت والخطة البديلة", teachingSpace: "لدي مكان هادئ ومناسب للتدريس", videoTools: "أدوات التعليم التي تجيدها",
    weeklyHours: "عدد ساعات التدريس المتاحة أسبوعيًا", availability: "الأيام والفترات المتاحة", earliestStart: "أقرب تاريخ للبدء",
    videoUrl: "رابط الفيديو التعريفي (اختياري)", consentAccuracy: "أؤكد صحة المعلومات المقدمة",
    consentPrivacy: "أوافق على سياسة الخصوصية والتواصل المتعلق بالتوظيف", select: "اختر…",
    reviewHelp: "راجع المعلومات وأكد الإقرارات ثم أرسل الطلب.", personalHelp: "أخبرنا كيف يمكننا التواصل معك.",
    educationHelp: "أضف مؤهلاتك الأكاديمية وإجازاتك.", teachingHelp: "حدد ما يمكنك تدريسه والفئات التي تجيد التعامل معها.",
    experienceHelp: "ساعد فريقنا على فهم خبرتك في التدريس.", readinessHelp: "أخبرنا عن تجهيزاتك والأوقات المتاحة."
  }
} as const;

function Field({ label, required, full, hint, children }: { label: string; required?: boolean; full?: boolean; hint?: string; children: React.ReactNode }) {
  return <div className={`field${full ? " full" : ""}`}><label>{label}{required && <span className="required"> *</span>}</label>{children}{hint && <span className="field-hint">{hint}</span>}</div>;
}

export function ApplicationForm({ locale, token, continueMode, copy }: { locale: Locale; token?: string; continueMode: boolean; copy: FormCopy }) {
  const t = labels[locale];
  const [accessToken, setAccessToken] = useState(token || "");
  const [email, setEmail] = useState("");
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [complete, setComplete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const sections = copy.sections;
  const progress = useMemo(() => ((step + 1) / sections.length) * 100, [step, sections.length]);

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

  function update<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft((current) => ({ ...current, [key]: value })); }
  function toggle(key: "specializations" | "ageGroups" | "videoTools", value: string) {
    setDraft((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));
  }

  async function saveAndContinue() {
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
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/applications/submit", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ data: draft, locale }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to submit your application");
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

  return <div className="application-layout">
    <aside className="application-sidebar"><h1>{copy.title}</h1><p>{copy.subtitle}</p><div className="progress-track"><div className="progress-value" style={{ width: `${progress}%` }} /></div>
      <div className="steps">{sections.map((name, index) => <div className={`step-item${index === step ? " active" : ""}${index < step ? " complete" : ""}`} key={name}><span className="step-number">{index < step ? "✓" : index + 1}</span><span>{name}</span></div>)}</div>
    </aside>
    <section className="form-card">
      <div className="form-heading"><p>{copy.step} {step + 1} / {sections.length}</p><h2>{sections[step]}</h2><small>{helpers[step]}</small></div>
      <div className="fields">
        {step === 0 && <>
          <Field label={t.fullNameEnglish} required><input value={draft.fullNameEnglish} onChange={(e) => update("fullNameEnglish", e.target.value)} /></Field>
          <Field label={t.fullNameArabic} required><input value={draft.fullNameArabic} onChange={(e) => update("fullNameArabic", e.target.value)} /></Field>
          <Field label={copy.email as string} required><input value={draft.email || email} disabled /></Field>
          <Field label={t.phone} required><input type="tel" value={draft.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
          <Field label={t.country} required><input value={draft.country} onChange={(e) => update("country", e.target.value)} /></Field>
          <Field label={t.city} required><input value={draft.city} onChange={(e) => update("city", e.target.value)} /></Field>
          <Field label={t.timezone} required><input value={draft.timezone} onChange={(e) => update("timezone", e.target.value)} placeholder="Africa/Cairo" /></Field>
          <Field label={t.gender} required><select value={draft.gender} onChange={(e) => update("gender", e.target.value)}><option value="">{t.select}</option><option value="male">{t.male}</option><option value="female">{t.female}</option></select></Field>
          <label className="choice field full"><input type="checkbox" checked={draft.over18} onChange={(e) => update("over18", e.target.checked)} />{t.over18}</label>
        </>}
        {step === 1 && <>
          <Field label={t.azharStatus} required><select value={draft.azharStatus} onChange={(e) => update("azharStatus", e.target.value)}><option value="">{t.select}</option><option value="graduate">{t.graduate}</option><option value="student">{t.student}</option><option value="other">{t.none}</option></select></Field>
          <Field label={t.institution} required><input value={draft.institution} onChange={(e) => update("institution", e.target.value)} /></Field>
          <Field label={t.faculty}><input value={draft.faculty} onChange={(e) => update("faculty", e.target.value)} /></Field>
          <Field label={t.qualification} required><input value={draft.qualification} onChange={(e) => update("qualification", e.target.value)} /></Field>
          <Field label={t.graduationYear}><input inputMode="numeric" value={draft.graduationYear} onChange={(e) => update("graduationYear", e.target.value)} /></Field>
          <Field label={t.hasIjazah} required><select value={draft.hasIjazah} onChange={(e) => update("hasIjazah", e.target.value)}><option value="">{t.select}</option><option value="yes">{t.yes}</option><option value="no">{t.no}</option></select></Field>
          {draft.hasIjazah === "yes" && <Field label={t.ijazahDetails} full><textarea value={draft.ijazahDetails} onChange={(e) => update("ijazahDetails", e.target.value)} /></Field>}
        </>}
        {step === 2 && <>
          <Field label={t.specializations} required full><div className="choice-grid">{[["quran", t.quran], ["tajweed", t.tajweed], ["memorization", t.memorization], ["qiraat", t.qiraat], ["noor", t.noor], ["arabic", t.arabic], ["islamic", t.islamic]].map(([value, label]) => <label className="choice" key={value}><input type="checkbox" checked={draft.specializations.includes(value)} onChange={() => toggle("specializations", value)} />{label}</label>)}</div></Field>
          <Field label={t.ageGroups} required full><div className="choice-grid">{[["children", t.children], ["teens", t.teens], ["adults", t.adults]].map(([value, label]) => <label className="choice" key={value}><input type="checkbox" checked={draft.ageGroups.includes(value)} onChange={() => toggle("ageGroups", value)} />{label}</label>)}</div></Field>
          <Field label={t.teachingLanguages} required full><input value={draft.teachingLanguages} onChange={(e) => update("teachingLanguages", e.target.value)} placeholder={locale === "en" ? "Arabic, English…" : "العربية، الإنجليزية…"} /></Field>
        </>}
        {step === 3 && <>
          <Field label={t.yearsExperience} required><input type="number" min="0" max="60" value={draft.yearsExperience} onChange={(e) => update("yearsExperience", e.target.value)} /></Field>
          <Field label={t.onlineExperience} required full><textarea value={draft.onlineExperience} onChange={(e) => update("onlineExperience", e.target.value)} /></Field>
          <Field label={t.previousWork} full><textarea value={draft.previousWork} onChange={(e) => update("previousWork", e.target.value)} /></Field>
          <Field label={t.motivation} required full><textarea value={draft.motivation} onChange={(e) => update("motivation", e.target.value)} /></Field>
          <Field label={t.childScenario} required full><textarea value={draft.childScenario} onChange={(e) => update("childScenario", e.target.value)} /></Field>
        </>}
        {step === 4 && <>
          <Field label={t.device} required><input value={draft.device} onChange={(e) => update("device", e.target.value)} /></Field>
          <Field label={t.internet} required><input value={draft.internet} onChange={(e) => update("internet", e.target.value)} /></Field>
          <label className="choice field full"><input type="checkbox" checked={draft.teachingSpace} onChange={(e) => update("teachingSpace", e.target.checked)} />{t.teachingSpace}</label>
          <Field label={t.videoTools} full><div className="choice-grid">{["Zoom", "Google Meet", "Digital whiteboard", "Screen sharing"].map((value) => <label className="choice" key={value}><input type="checkbox" checked={draft.videoTools.includes(value)} onChange={() => toggle("videoTools", value)} />{value}</label>)}</div></Field>
          <Field label={t.weeklyHours} required><input type="number" min="1" max="80" value={draft.weeklyHours} onChange={(e) => update("weeklyHours", e.target.value)} /></Field>
          <Field label={t.earliestStart} required><input type="date" value={draft.earliestStart} onChange={(e) => update("earliestStart", e.target.value)} /></Field>
          <Field label={t.availability} required full><textarea value={draft.availability} onChange={(e) => update("availability", e.target.value)} placeholder={locale === "en" ? "Example: Sunday–Thursday, 4–9 PM Cairo time" : "مثال: من الأحد إلى الخميس، 4–9 مساءً بتوقيت القاهرة"} /></Field>
          <Field label={t.videoUrl} full><input type="url" value={draft.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} placeholder="https://" /></Field>
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
