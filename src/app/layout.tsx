import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

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
      <body className="min-h-full flex flex-col bg-[#F4F8FC] text-[#17202A] font-sans relative overflow-x-hidden">
        <CartProvider>
          {/* Soft atmospheric gradients and liquid glass blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 h-full w-full">
            {/* Backdrop Gradients */}
            <div className="absolute top-0 left-[-10%] w-[80vw] h-[80vw] sm:w-[50vw] sm:h-[50vw] rounded-full bg-gradient-to-tr from-[#DDF4FF]/45 to-[#DDD6FF]/40 blur-[100px] sm:blur-[120px] animate-pulse duration-[10000ms]"></div>
            <div className="absolute top-[35%] right-[-10%] w-[90vw] h-[90vw] sm:w-[60vw] sm:h-[60vw] rounded-full bg-gradient-to-br from-[#B9D9FF]/35 to-[#9DE8FF]/35 blur-[120px] sm:blur-[150px] animate-pulse duration-[8000ms]"></div>
            <div className="absolute bottom-0 left-[5%] w-[70vw] h-[70vw] sm:w-[45vw] sm:h-[45vw] rounded-full bg-gradient-to-r from-[#DDF4FF]/35 via-[#DDD6FF]/40 to-transparent blur-[100px] sm:blur-[120px]"></div>

            {/* Smooth floating liquid glass blobs */}
            <div className="absolute top-[12%] right-[15%] w-48 h-48 sm:w-72 sm:h-72 bg-white/20 rounded-full border border-white/30 backdrop-blur-2xl shadow-[inset_0_4px_30px_rgba(185,217,255,0.2)] animate-float-slow"></div>
            <div className="absolute top-[60%] left-[8%] w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full border border-white/20 backdrop-blur-3xl shadow-[inset_0_8px_40px_rgba(157,232,255,0.15)] animate-float-medium"></div>
          </div>

          <AnnouncementBar />
          <Navbar />
          <main className="flex-grow flex flex-col w-full relative">
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </main>
          <Footer />
          <WhatsAppButton />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
