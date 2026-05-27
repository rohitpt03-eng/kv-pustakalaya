'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Sparkles, Gift, Phone, MessageSquare } from 'lucide-react';

export default function FestivePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show after 2 seconds on mount, but check sessionStorage so it only shows once per session
    const hasSeen = sessionStorage.getItem('kv_seen_festive_offer');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('kv_seen_festive_offer', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 p-2 rounded-full transition-all"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner Top Details */}
        <div className="brand-gradient py-8 px-6 text-center text-white relative">
          {/* Decorative Sparkles */}
          <div className="absolute top-4 left-4 text-sky-200 opacity-60">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="absolute bottom-4 right-6 text-sky-200 opacity-60">
            <Gift className="w-6 h-6 animate-bounce" />
          </div>

          <div className="relative w-20 h-20 bg-white rounded-full p-1 mx-auto shadow-md flex items-center justify-center overflow-hidden mb-3">
            <Image
              src="/logo.png"
              alt="KV Pustakalaya Logo"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">KV Pustakalaya</h2>
          <p className="text-xs text-sky-200 font-serif mt-0.5">पढ़ाई का Perfect Partner</p>
        </div>

        {/* Content Area */}
        <div className="p-6 text-center space-y-4">
          <div className="inline-block bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            🎉 Festive Offer Live
          </div>
          <h3 className="text-xl font-extrabold text-slate-950 leading-snug">
            Flat 15% OFF on notebooks & stationery packages!
          </h3>
          <p className="text-sm text-slate-600">
            Visit our store at <strong className="text-slate-800 font-semibold">Harari Chowk</strong> or inquire online to grab special combos for CBSE, NCERT, and competitive exam books!
          </p>

          <div className="bg-slate-50 border border-dashed border-sky-300 rounded-2xl p-4.5 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Mention This Promo</p>
            <p className="text-lg font-bold text-sky-700 mt-1 select-all cursor-pointer">KVSTUDENT15</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="tel:8340383252"
              className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
            <a
              href="https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%20want%20to%20avail%20the%2015%25%20Festive%20Discount!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Get Offer</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
