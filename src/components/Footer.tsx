'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide on admin dashboard pages
  if (pathname.startsWith('/admin/dashboard')) {
    return null;
  }

  return (
    <footer className="bg-white text-[#17202A] border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Logo & Brand Column */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-11 h-11 bg-slate-50 rounded-full p-0.5 shadow-2xs flex items-center justify-center overflow-hidden border border-slate-100">
                <Image
                  src="/logo.png"
                  alt="KV Pustakalaya Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-sky-850 transition-colors">
                  KV Pustakalaya
                </span>
                <span className="text-xs font-bold text-sky-850 -mt-1 font-serif">
                  पढ़ाई का Perfect Partner
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Your one-stop destination for quality stationery, textbooks, school supplies, competitive exam materials, cash withdrawal services, and online form filling at Harari Chowk.
            </p>
            <div className="flex space-x-3 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-sky-50 hover:text-sky-800 transition-all border border-slate-100"
                aria-label="Facebook Page"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-pink-50 hover:text-pink-700 transition-all border border-slate-100"
                aria-label="Instagram Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-slate-905 text-xs font-black tracking-wider uppercase mb-5">
              Explore
            </h3>
            <ul className="space-y-3 text-xs text-slate-600 font-semibold">
              <li>
                <Link href="/" className="hover:text-sky-700 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-sky-700 transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-700 transition-colors">
                  About Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-700 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Details Column */}
          <div>
            <h3 className="text-slate-905 text-xs font-black tracking-wider uppercase mb-5">
              Store Info
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-500 font-semibold">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-slate-800">Working Hours</p>
                  <p className="mt-0.5">09:00 AM to 08:00 PM</p>
                  <p className="text-[10px] font-bold text-sky-750 mt-0.5">(Open All Days)</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-slate-800">Location</p>
                  <p className="mt-0.5">Harari Chowk, Bihar</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-slate-800">Call Support</p>
                  <a href="tel:8340383252" className="text-sky-700 hover:text-sky-850 transition-colors">
                    8340383252
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Owner & Contact Column */}
          <div>
            <h3 className="text-slate-905 text-xs font-black tracking-wider uppercase mb-5">
              Management
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
                  Owner
                </p>
                <p className="text-sm font-black text-slate-900 mt-1">
                  Prabhat Kumar Prabhakar
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-2 font-semibold">
                  Dedicated to providing the best stationery, books, cash withdrawals, and form filling facilities at Harari Chowk.
                </p>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">
                <p>© {new Date().getFullYear()} KV Pustakalaya.</p>
                <p className="mt-0.5">All rights reserved.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
