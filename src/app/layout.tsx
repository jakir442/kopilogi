import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kopilogi — Coffee, Food & Good Moments",
    template: "%s",
  },
  description:
    "Jelajahi Kopilogi, tempat untuk menikmati kopi, makanan, dan pengalaman bersama dalam suasana modern.",

  // Untuk tampilan saat di searching di browser
  openGraph: {
    siteName: "Kopilogi Kita",
    title: "Kopilogi Kita — Ngopi Bareng, Cerita Bareng",
    description:
      "Temukan menu, cabang, cerita, dan informasi terbaru Kopilogi Kita. Tempat ngopi, makan, dan menikmati momen bersama.",
    type: "website",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  // Verifikasi untuk Google Search Console, agar saat di search di google atau chrome web yang telah di deploy muncul
  verification: {
    google: "L84BRxhPhd1yH63MSQ9ulTUNomYpjkKG9py_L8sI-5s",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}

        <Toaster position="top-right" richColors />

        <Script
          src="https://viora-ai-widget.vercel.app/widget.js"
          data-organization-id="org_3KmbuL0dIPDwicuCTLkR290MzDr"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
