'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, ShieldCheck, Heart, User, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  const highlights = [
    { title: 'Quality Stationery', desc: 'Sourced from the best manufacturers like Classmate, Camlin, Doms, Reynolds, and Nataraj.' },
    { title: 'Academic Books', desc: 'Up-to-date editions for NCERT textbooks, CBSE prep material, and State Board curriculum.' },
    { title: 'Local Cyber Hub', desc: 'Aadhaar Cash Withdrawal (AEPS), Micro-ATM cashouts, and rapid Online Form Filling services.' },
    { title: 'Competitive Materials', desc: 'Expert guides, booklets, and notes for SSC, UPSC, Banking, Railway, and Bihar Police.' }
  ];

  return (
    <div className="flex-grow bg-transparent min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="relative py-14 text-center mt-6 max-w-7xl mx-auto crystal-glass border border-white/50 shadow-sm rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9DE8FF]/10 to-[#DDD6FF]/10 -z-10"></div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950">About KV Pustakalaya</h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Learn more about Harari Chowk's primary partner for academic resources.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block bg-white/40 text-sky-850 border border-white/60 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
              Our Journey
            </span>
            <h2 className="text-3xl font-black text-slate-900 leading-snug">
              Serving the Harari Chowk community with pride
            </h2>
            <p className="text-sm text-slate-650 font-medium leading-relaxed">
              KV Pustakalaya was founded with a single mission: to be the <strong>“पढ़ाई का Perfect Partner”</strong> (Perfect Partner in Studies) for students in our region. Over the years, we have grown from a modest book stall into a comprehensive educational supply and cyber hub.
            </p>
            <p className="text-sm text-slate-655 font-medium leading-relaxed">
              We understand the challenges faced by students preparing for competitive exams, school admissions, or projects. That is why we consolidate premium stationery, official syllabus books, and crucial online services under one roof.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="/products"
                className="brand-gradient hover:brand-gradient-hover text-[#17202A] text-xs font-extrabold px-6 py-3 rounded-full shadow-md flex items-center gap-1.5 transition-all border border-white/40"
              >
                <span>Browse Products</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="glass-button hover:bg-white/80 text-slate-700 text-xs font-extrabold px-6 py-3 rounded-full border border-white/65 shadow-sm transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full aspect-video max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/45 bg-white/20 p-2 backdrop-blur-md">
              <Image
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
                alt="KV Pustakalaya Storefront backdrop"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* OWNER INFORMATION SECTION */}
        <div className="crystal-glass rounded-3xl text-[#17202A] overflow-hidden shadow-xl border border-white/50 backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side Owner Info Text */}
            <div className="lg:col-span-8 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <span className="inline-block bg-white/40 text-sky-850 border border-white/60 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-widest self-start shadow-sm backdrop-blur-sm">
                Management Profile
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                Owner Information
              </h2>
              <blockquote className="text-base sm:text-lg text-slate-805 font-semibold italic border-l-4 border-sky-400 pl-4 py-1 leading-relaxed">
                “KV Pustakalaya is proudly managed by Prabhat Kumar Prabhakar, dedicated to providing quality stationery, books, school supplies, cash withdrawal services, and online form filling facilities at Harari Chowk.”
              </blockquote>
              <div className="pt-2">
                <p className="text-lg font-black text-slate-950">Prabhat Kumar Prabhakar</p>
                <p className="text-xs text-sky-800 font-extrabold uppercase tracking-wider mt-0.5">Founder & Owner, KV Pustakalaya</p>
              </div>
            </div>

            {/* Right side Visual / Avatar Placeholder */}
            <div className="lg:col-span-4 bg-white/10 flex flex-col items-center justify-center p-8 sm:p-12 text-center border-t lg:border-t-0 lg:border-l border-white/45 backdrop-blur-sm">
              <div className="w-24 h-24 rounded-full bg-white/45 flex items-center justify-center border-4 border-white/60 shadow-sm mb-4">
                <User className="w-12 h-12 text-sky-800" />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-sky-850">Store Manager</p>
              <p className="text-sm font-extrabold text-slate-950 mt-1">Owner: Prabhat Kumar Prabhakar</p>
              <p className="text-xs text-slate-655 font-medium mt-2 max-w-xs leading-relaxed">
                Available directly in-store at Harari Chowk or via WhatsApp/Call to answer all student queries.
              </p>
            </div>

          </div>
        </div>

        {/* Business Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">What Sets Us Apart</h2>
            <p className="text-sm text-slate-650 mt-2 font-medium">
              Our core highlights reflect our commitment to supporting education and ease of services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {highlights.map((h, idx) => (
              <div
                key={idx}
                className="crystal-glass-interactive rounded-2xl p-6.5 shadow-sm flex items-start gap-4 border border-white/50"
              >
                <div className="bg-white/40 border border-white/60 text-sky-700 p-3 rounded-xl shrink-0 shadow-sm backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{h.title}</h3>
                  <p className="text-xs text-slate-650 mt-1.5 leading-relaxed font-medium">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
