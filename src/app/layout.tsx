import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kopilogi — Coffee, Food & Good Moments",
    template: "%s | Kopilogi",
  },
  description:
    "Jelajahi Kopilogi, tempat untuk menikmati kopi, makanan, dan pengalaman bersama dalam suasana modern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='id' className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className='min-h-screen bg-background text-foreground antialiased'>
        {children}

        <Toaster position='top-right' richColors />

        <Script
          src='https://viora-ai-widget.vercel.app/widget.js'
          data-organization-id='org_3KmbuL0dIPDwicuCTLkR290MzDr'
          strategy='afterInteractive'
        />
      </body>
    </html>
  );
}
