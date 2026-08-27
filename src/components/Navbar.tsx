'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  if (pathname.startsWith('/admin/dashboard')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-white/80 rounded-full p-0.5 shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="KV Pustakalaya Logo"
                width={38}
                height={38}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-905 group-hover:text-sky-850 transition-colors">
                KV Pustakalaya
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-sky-800 -mt-1 font-serif">
                पढ़ाई का Perfect Partner
              </span>
            </div>
          </Link>

          {/* Desktop Search Products */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-grow max-w-sm lg:max-w-md relative"
          >
            <input
              type="text"
              placeholder="Search copies, pens, exam books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-4 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white text-slate-900 placeholder-slate-400 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 sm:top-3 text-slate-450 hover:text-sky-750"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all ${
                  isActive(link.href)
                    ? 'bg-sky-50 text-sky-800 border border-sky-100 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Cart & Mobile menu */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-sky-800 hover:bg-slate-50 rounded-xl transition-all border border-slate-105 shadow-2xs"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex lg:hidden items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100 transition-colors"
              aria-label="Open menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 border-b border-slate-150 px-4 pt-3 pb-6 space-y-4 shadow-md backdrop-blur-md">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search copies, pens, study guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 text-slate-900 placeholder-slate-400 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 text-slate-450"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  isActive(link.href)
                    ? 'bg-sky-50 text-sky-800 border-sky-100'
                    : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
