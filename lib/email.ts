import nodemailer from "nodemailer";

function transporter() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined
  });
}

export async function sendApplicationAccessEmail({ email, locale, url }: { email: string; locale: "en" | "ar"; url: string }) {
  const mailer = transporter();
  if (!mailer) {
    if (process.env.NODE_ENV !== "production") console.info(`Application access link for ${email}: ${url}`);
    return false;
  }
  const arabic = locale === "ar";
  await mailer.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: arabic ? "رابط طلب التقديم — أكاديمية أزهري" : "Your teacher application — Azhari Academy",
    text: arabic
      ? `استخدم الرابط الآمن التالي لبدء طلبك أو استكماله:\n\n${url}\n\nتنتهي صلاحية الرابط خلال 48 ساعة.`
      : `Use the secure link below to start or continue your application:\n\n${url}\n\nThis link expires in 48 hours.`
  });
  return true;
}

export async function sendApplicationConfirmation({ email, locale, reference }: { email: string; locale: "en" | "ar"; reference: string }) {
  const mailer = transporter();
  if (!mailer) return false;
  const arabic = locale === "ar";
  await mailer.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: arabic ? `تم استلام طلبك — ${reference}` : `Application received — ${reference}`,
    text: arabic
      ? `شكرًا لتقديمك للانضمام إلى فريق أكاديمية أزهري. رقم الطلب: ${reference}.`
      : `Thank you for applying to join Azhari Academy. Your application reference is ${reference}.`
  });
  return true;
}
