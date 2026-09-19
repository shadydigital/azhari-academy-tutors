import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="locale-shell">
      {children}
    </div>
  );
}
