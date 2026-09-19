import Link from "next/link";
import { notFound } from "next/navigation";
import { copy, isLocale } from "@/lib/i18n";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = copy[locale];
  const otherLocale = locale === "en" ? "ar" : "en";

  return (
    <main className="landing">
      <header className="site-header">
        <Link href={`/${locale}`} className="brand" aria-label="Azhari Academy home">
          <span className="brand-mark" aria-hidden="true">ا</span>
          <span><strong>Azhari</strong><small>Academy</small></span>
        </Link>
        <Link className="language-link" href={`/${otherLocale}`}>{content.languageName}</Link>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">{content.headline}</p>
          <h1>{content.title}</h1>
          <p className="hero-intro">{content.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/${locale}/apply`}>{content.start}</Link>
            <Link className="button button-secondary" href={`/${locale}/apply?mode=continue`}>{content.continue}</Link>
          </div>
          <p className="assurance"><span aria-hidden="true">✓</span>{content.note}</p>
        </div>
        <div className="hero-emblem" aria-hidden="true">
          <div className="emblem-ring"><span>العلم<br />رسالة</span></div>
        </div>
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Azhari Academy</span>
        <nav aria-label="Footer">
          <Link href={`/${locale}/privacy`}>{content.privacy}</Link>
          <Link href="/admin/login">{content.staff}</Link>
        </nav>
      </footer>
    </main>
  );
}
