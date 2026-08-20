'use client';

import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Clock, CreditCard, FileText } from 'lucide-react';

export default function AnnouncementBar() {
  const pathname = usePathname();

  // Hide on admin dashboard pages
  if (pathname.startsWith('/admin/dashboard')) {
    return null;
  }

  return (
    <div className="bg-white/20 backdrop-blur-md text-[#17202A] border-b border-white/30 overflow-hidden">
      {/* Top Ticker Ticker Bar */}
      <div className="h-9 relative flex items-center border-b border-white/20 bg-[#DDF4FF]/40">
        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#9DE8FF]/80 to-[#B9D9FF]/80 text-[#17202A] font-extrabold text-2xs uppercase px-4 py-1 flex items-center z-10 border-r border-white/30 shadow-md">
          Announcement
        </div>
        <div className="w-full flex overflow-x-hidden relative h-full items-center">
          <div className="animate-ticker whitespace-nowrap flex items-center gap-12 text-xs font-semibold select-none">
            <span className="flex items-center gap-1.5 text-sky-900">
              <CreditCard className="w-3.5 h-3.5 text-sky-600" />
              Cash Withdrawal Available (नकद निकासी सुविधा उपलब्ध है)
            </span>
            <span className="w-2 h-2 rounded-full bg-white/50 border border-white"></span>
            <span className="flex items-center gap-1.5 text-indigo-900">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Online Form Filling Available (सभी प्रकार के ऑनलाइन फॉर्म भरे जाते हैं)
            </span>
            <span className="w-2 h-2 rounded-full bg-white/50 border border-white"></span>
            <span className="flex items-center gap-1.5 text-slate-800">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              Timing: 09:00 AM to 08:00 PM (Daily)
            </span>
            <span className="w-2 h-2 rounded-full bg-white/50 border border-white"></span>
            <span className="text-[#17202A]">
              📍 Harari Chowk, KV Pustakalaya
            </span>
            
            {/* Duplicate for seamless loop */}
            <span className="flex items-center gap-1.5 text-sky-900">
              <CreditCard className="w-3.5 h-3.5 text-sky-600" />
              Cash Withdrawal Available (नकद निकासी सुविधा उपलब्ध है)
            </span>
            <span className="w-2 h-2 rounded-full bg-white/50 border border-white"></span>
            <span className="flex items-center gap-1.5 text-indigo-900">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Online Form Filling Available (सभी प्रकार के ऑनलाइन फॉर्म भरे जाते हैं)
            </span>
            <span className="w-2 h-2 rounded-full bg-white/50 border border-white"></span>
            <span className="flex items-center gap-1.5 text-slate-800">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              Timing: 09:00 AM to 08:00 PM (Daily)
            </span>
          </div>
        </div>
      </div>

      {/* Main Info Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
        <div className="flex items-center gap-4 text-slate-700">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-500" />
            09:00 AM - 08:00 PM
          </span>
          <span className="hidden sm:inline border-r border-slate-300 h-4"></span>
          <span>📍 Harari Chowk</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <a
            href="tel:8340383252"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 glass-button text-[#17202A] px-4 py-1.5 rounded-full transition-all text-xs font-extrabold border border-white/60 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-sky-600" />
            <span>Call: 8340383252</span>
          </a>
          <a
            href="https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%20have%20an%20inquiry%20regarding..."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#9DE8FF]/60 to-[#B9D9FF]/60 hover:from-[#9DE8FF]/80 hover:to-[#B9D9FF]/80 text-[#17202A] px-4 py-1.5 rounded-full transition-all text-xs font-extrabold border border-white/50 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-700 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
