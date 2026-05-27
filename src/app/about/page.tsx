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
    <div className="flex-grow bg-slate-50 min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-14 text-center border-b border-sky-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">About KV Pustakalaya</h1>
          <p className="text-sm sm:text-base text-sky-200">
            Learn more about Harari Chowk's primary partner for academic resources.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-snug">
              Serving the Harari Chowk community with pride
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              KV Pustakalaya was founded with a single mission: to be the <strong>“पढ़ाई का Perfect Partner”</strong> (Perfect Partner in Studies) for students in our region. Over the years, we have grown from a modest book stall into a comprehensive educational supply and cyber hub.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We understand the challenges faced by students preparing for competitive exams, school admissions, or projects. That is why we consolidate premium stationery, official syllabus books, and crucial online services under one roof.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="/products"
                className="brand-gradient hover:brand-gradient-hover text-white text-xs font-bold px-6 py-3 rounded-full shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>Browse Products</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-6 py-3 rounded-full border border-slate-200 transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full aspect-video max-w-lg rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-white">
              <Image
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
                alt="KV Pustakalaya Storefront backdrop"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* OWNER INFORMATION SECTION */}
        <div className="bg-sky-900 rounded-3xl text-white overflow-hidden shadow-xl border border-sky-950">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side Owner Info Text */}
            <div className="lg:col-span-8 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <span className="inline-block bg-sky-500/20 text-sky-300 border border-sky-500/35 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-widest align-self-start">
                Management Profile
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Owner Information
              </h2>
              <blockquote className="text-base sm:text-lg text-sky-100 font-medium italic border-l-4 border-sky-400 pl-4 py-1 leading-relaxed">
                “KV Pustakalaya is proudly managed by Prabhat Kumar Prabhakar, dedicated to providing quality stationery, books, school supplies, cash withdrawal services, and online form filling facilities at Harari Chowk.”
              </blockquote>
              <div className="pt-2">
                <p className="text-lg font-black text-white">Prabhat Kumar Prabhakar</p>
                <p className="text-xs text-sky-300 font-bold uppercase tracking-wider mt-0.5">Founder & Owner, KV Pustakalaya</p>
              </div>
            </div>

            {/* Right side Visual / Avatar Placeholder */}
            <div className="lg:col-span-4 bg-sky-950 flex flex-col items-center justify-center p-8 sm:p-12 text-center border-t lg:border-t-0 lg:border-l border-sky-900/60">
              <div className="w-24 h-24 rounded-full bg-sky-900/60 flex items-center justify-center border-4 border-sky-800 shadow-inner mb-4">
                <User className="w-12 h-12 text-sky-300" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">Store Manager</p>
              <p className="text-base font-bold text-white mt-1">Owner: Prabhat Kumar Prabhakar</p>
              <p className="text-xs text-slate-400 mt-2 max-w-xs">
                Available directly in-store at Harari Chowk or via WhatsApp/Call to answer all student queries.
              </p>
            </div>

          </div>
        </div>

        {/* Business Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">What Sets Us Apart</h2>
            <p className="text-sm text-slate-500 mt-2">
              Our core highlights reflect our commitment to supporting education and ease of services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {highlights.map((h, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 p-6.5 shadow-sm flex items-start gap-4 hover-scale transition-all"
              >
                <div className="bg-sky-50 text-sky-600 p-3 rounded-xl shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{h.title}</h3>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
