import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Teach with Azhari Academy",
    template: "%s | Azhari Academy"
  },
  description: "Apply to join the teaching team at Azhari Academy.",
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
