import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FestivePopup from "@/components/FestivePopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KV Pustakalaya - Stationery & Book Store, Harari Chowk",
  description: "KV Pustakalaya at Harari Chowk is your perfect learning partner. Find school books, notebooks, pens, school supplies, competitive books, plus online form filling and cash withdrawal services.",
  keywords: ["KV Pustakalaya", "Stationery Shop Harari Chowk", "Book Store Harari Chowk", "Cash Withdrawal Harari Chowk", "Online Form Filling Harari Chowk", "School books", "Prabhat Kumar Prabhakar"],
  authors: [{ name: "Prabhat Kumar Prabhakar" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 font-sans">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-grow flex flex-col w-full">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <FestivePopup />
      </body>
    </html>
  );
}
