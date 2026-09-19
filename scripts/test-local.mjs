const baseUrl = process.env.APP_URL || "http://localhost:3000";
const email = `local.test.${Date.now()}@example.com`;

async function json(url, options = {}) {
  const response = await fetch(`${baseUrl}${url}`, options);
  const body = await response.json();
  if (!response.ok) throw new Error(`${options.method || "GET"} ${url} failed (${response.status}): ${body.message || JSON.stringify(body)}`);
  return { response, body };
}

const start = await json("/api/applications/start", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, locale: "en" })
});

if (!start.body.devToken) throw new Error("Development bypass token was not returned.");
const token = start.body.devToken;
const applicationData = {
  email,
  fullNameEnglish: "Local Test Teacher",
  fullNameArabic: "معلم تجريبي محلي",
  phone: "+201000000000",
  country: "Egypt",
  city: "Cairo",
  timezone: "Africa/Cairo",
  gender: "male",
  over18: true,
  azharStatus: "graduate",
  institution: "Al-Azhar University",
  faculty: "Faculty of Languages",
  qualification: "Bachelor's degree",
  graduationYear: "2020",
  hasIjazah: "yes",
  ijazahDetails: "Test ijazah record",
  specializations: ["quran", "tajweed"],
  ageGroups: ["children", "adults"],
  teachingLanguages: "Arabic, English",
  yearsExperience: "5",
  onlineExperience: "Five years teaching Quran and Tajweed online.",
  previousWork: "Local integration test academy.",
  motivation: "I would like to help learners study the Quran through structured online lessons.",
  childScenario: "I use short activities, questions, and positive feedback to restore focus.",
  device: "Laptop",
  internet: "Stable broadband with mobile backup",
  teachingSpace: true,
  videoTools: ["Zoom", "Google Meet", "Screen sharing"],
  weeklyHours: "20",
  availability: "Sunday to Thursday, 4–9 PM Cairo time",
  earliestStart: "2026-10-01",
  videoUrl: "",
  consentAccuracy: true,
  consentPrivacy: true
};

await json("/api/applications/draft", {
  method: "PATCH",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ step: 5, data: applicationData, locale: "en" })
});

const submitted = await json("/api/applications/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ data: applicationData, locale: "en" })
});

const login = await json("/api/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@azhariacademy.local", password: process.env.ADMIN_PASSWORD })
});
const cookie = login.response.headers.get("set-cookie")?.split(";")[0];
if (!cookie) throw new Error("Admin session cookie was not created.");

const listResponse = await fetch(`${baseUrl}/admin/applicants`, { headers: { Cookie: cookie } });
const listHtml = await listResponse.text();
if (!listResponse.ok || !listHtml.includes(submitted.body.reference)) throw new Error("Submitted application was not visible in the admin list.");

const idMatch = listHtml.match(new RegExp(`/admin/applicants/(\\d+)[^>]*>[^<]*<strong>Local Test Teacher`));
const fallbackMatch = listHtml.match(/\/admin\/applicants\/(\d+)/);
const applicationId = idMatch?.[1] || fallbackMatch?.[1];
if (!applicationId) throw new Error("Unable to identify the test application in the admin list.");

await json(`/api/admin/applications/${applicationId}/notes`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Cookie: cookie },
  body: JSON.stringify({ note: "Local end-to-end test completed successfully." })
});

await json(`/api/admin/applications/${applicationId}/status`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Cookie: cookie },
  body: JSON.stringify({ status: "under_review", reason: "Local test workflow" })
});

const detailResponse = await fetch(`${baseUrl}/admin/applicants/${applicationId}`, { headers: { Cookie: cookie } });
const detailHtml = await detailResponse.text();
if (!detailResponse.ok || !detailHtml.includes("Local Test Teacher") || !detailHtml.includes("Local end-to-end test completed successfully.")) {
  throw new Error("Applicant detail did not include the expected profile and note.");
}

console.log("Local end-to-end test passed.");
console.log(`Reference: ${submitted.body.reference}`);
console.log(`Admin detail: ${baseUrl}/admin/applicants/${applicationId}`);
