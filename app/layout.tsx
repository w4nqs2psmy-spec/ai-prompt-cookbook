import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import PrivacyBanner from "@/components/PrivacyBanner";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["600", "700", "900"],
  style: ["normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Prompt Cookbook",
  description: "Testattuja AI-prompteja opettajille",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        {/* Decorative top bar */}
        <div
          aria-hidden="true"
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, #1A7A6D 0%, #145f55 40%, #C4725A 100%)",
          }}
        />
        <Providers>
          <Header />
          <div className="flex flex-col min-h-[calc(100vh-4rem-1px)]">
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
          <PrivacyBanner />
        </Providers>
      </body>
    </html>
  );
}
