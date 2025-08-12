import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/ui/Header";
import { Toaster } from "sonner";
import Footer from "@/app/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YazilimLisans",
  description: "Uygun fiyatlı dijital lisans mağazası",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mx-auto max-w-6xl px-4">
          {/* @ts-expect-error Async Server Component */}
          <Header />
          {children}
          <Footer />
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
