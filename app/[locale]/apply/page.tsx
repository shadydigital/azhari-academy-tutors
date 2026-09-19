import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "./application-form";
import { applicationCopy } from "@/lib/application-copy";
import { copy, isLocale } from "@/lib/i18n";
import { applicationFromToken } from "@/lib/applications";
import { parseFormData } from "@/lib/form-data";

export const dynamic = "force-dynamic";

export default async function ApplyPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; mode?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  if (!isLocale(locale)) notFound();
  const otherLocale = locale === "en" ? "ar" : "en";
  const application = query.token ? await applicationFromToken(query.token) : null;
  const initialData = application ? parseFormData(application.form_data) : undefined;

  return (
    <main className="application-page">
      <header className="application-header">
        <Link href={`/${locale}`} className="brand">
          <span className="brand-mark" aria-hidden="true">ا</span>
          <span><strong>Azhari</strong><small>Academy</small></span>
        </Link>
        <Link
          className="language-link"
          href={`/${otherLocale}/apply${query.token ? `?token=${encodeURIComponent(query.token)}` : ""}`}
        >
          {copy[locale].languageName}
        </Link>
      </header>
      <ApplicationForm locale={locale} token={application ? query.token : undefined} continueMode={query.mode === "continue"} copy={applicationCopy[locale]} initialEmail={application?.email || ""} initialData={initialData} />
    </main>
  );
}
