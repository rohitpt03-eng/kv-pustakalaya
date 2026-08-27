'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThreeDHero from '@/components/ThreeDHero';
import { db, Product, Category } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import { 
  CreditCard, 
  FileText, 
  Phone, 
  MessageSquare, 
  Search, 
  ChevronRight, 
  BookOpen, 
  Award, 
  Clock, 
  Star, 
  ShieldCheck, 
  Zap, 
  MapPin,
  ChevronLeft,
  X,
  Sparkles,
  ShoppingBag,
  Heart,
  Printer,
  FileCheck,
  CheckCircle2,
  ThumbsUp,
  Coins
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const { addToCart } = useCart();

  // Load from database on mount
  useEffect(() => {
    setProducts(db.getProducts());
    setCategories(db.getCategories());
    
    // Load wishlist
    const storedWishlist = localStorage.getItem('kv_wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => {
      const updated = prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id];
      localStorage.setItem('kv_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  const targetCategorySlugs = [
    'school-books',
    'office-stationery',
    'notebook',
    'competitive-books',
    'art-craft',
    'files-folders'
  ];

  const categoriesToDisplay = categories.filter(c => targetCategorySlugs.includes(c.slug));

  const testimonials = [
    { name: 'Aman Kumar', role: 'College Student', review: 'KV Pustakalaya is my primary source for competitive exam books. Prabhat Bhaiya always guides us with the latest editions, and their form filling service is incredibly fast and hassle-free!', rating: 5 },
    { name: 'Sadhana Mishra', role: 'Teacher', review: 'I purchase drawing books and notebooks in bulk for school students. The quality of paper is excellent, and they have competitive prices compared to others at Harari Chowk.', rating: 5 },
    { name: 'Rajesh Yadav', role: 'Local Resident', review: 'Their Cash Withdrawal service is a lifesaver. Since ATMs are often crowded, I easily withdraw cash here when buying supplies. Highly convenient!', rating: 5 }
  ];

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:py-20 lg:py-24 min-h-[85vh] flex items-center bg-transparent">
        {/* Background 3D Book Animation */}
        <ThreeDHero />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50/90 border border-sky-100/50 text-sky-850 text-2xs sm:text-xs font-extrabold shadow-2xs backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                <span>Harari Chowk's Trusted Stationery Store</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900">
                Everything You Need <br />
                <span className="text-sky-750">to Study Better.</span>
              </h1>
              
              <p className="text-xl sm:text-2xl font-serif text-sky-800 font-extrabold italic tracking-wide">
                “पढ़ाई का Perfect Partner”
              </p>
              
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Books, notebooks, stationery, exam preparation materials and everyday study essentials — all in one place.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/products"
                  className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-extrabold px-8 py-3.5 rounded-xl shadow-md hover:shadow-sky-100 transition-all flex items-center gap-2 hover:scale-102"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </Link>
                <Link
                  href="/category/school-books"
                  className="bg-white/80 hover:bg-white text-slate-700 text-sm font-extrabold px-8 py-3.5 rounded-xl transition-all border border-slate-200/60 shadow-2xs hover:scale-102"
                >
                  Explore Books
                </Link>
              </div>
            </div>

            {/* Right Hero Column - Floating Product Composition & Badges */}
            <div className="lg:col-span-6 flex justify-center w-full relative pt-10 lg:pt-0">
              
              {/* Main composition container */}
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-white/40 to-sky-50/20 p-4 border border-white/50 shadow-xl backdrop-blur-md flex items-center justify-center">
                
                {/* Floating trust badge: Trusted Local Store */}
                <div className="absolute -top-4 -left-4 bg-white/95 border border-slate-100 px-4 py-2 rounded-2xl shadow-md flex items-center gap-2 animate-float-slow z-20">
                  <span className="text-sm">📍</span>
                  <span className="text-2xs font-extrabold text-slate-800">Trusted Local Store</span>
                </div>

                {/* Floating trust badge: Quality Products */}
                <div className="absolute bottom-6 -right-6 bg-white/95 border border-slate-100 px-4 py-2 rounded-2xl shadow-md flex items-center gap-2 animate-float-medium z-20">
                  <span className="text-sm">⭐</span>
                  <span className="text-2xs font-extrabold text-slate-800">Quality Products</span>
                </div>

                {/* Floating trust badge: Easy Shopping */}
                <div className="absolute top-1/3 -right-8 bg-white/95 border border-slate-100 px-4 py-2 rounded-2xl shadow-md flex items-center gap-2 animate-float-slow delay-500 z-20">
                  <span className="text-sm">🛍️</span>
                  <span className="text-2xs font-extrabold text-slate-800">Easy Shopping</span>
                </div>

                {/* Layered Product Images mockup */}
                <div className="w-full h-full relative rounded-2xl overflow-hidden border-2 border-white/80 shadow-inner flex items-center justify-center bg-sky-50/30">
                  <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full h-full p-3">
                    {/* Notebook grid entry */}
                    <div className="relative rounded-xl overflow-hidden border border-white shadow-2xs group">
                      <Image 
                        src="https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&auto=format&fit=crop&q=60" 
                        alt="Premium Notebooks" 
                        fill 
                        className="object-cover transition-transform group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Notebooks</span>
                      </div>
                    </div>
                    {/* Pens grid entry */}
                    <div className="relative rounded-xl overflow-hidden border border-white shadow-2xs group">
                      <Image 
                        src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&auto=format&fit=crop&q=60" 
                        alt="Branded Pens" 
                        fill 
                        className="object-cover transition-transform group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Pens & Markers</span>
                      </div>
                    </div>
                    {/* Exam books grid entry */}
                    <div className="relative rounded-xl overflow-hidden border border-white shadow-2xs group">
                      <Image 
                        src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&auto=format&fit=crop&q=60" 
                        alt="Competitive Exam Books" 
                        fill 
                        className="object-cover transition-transform group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Exam Guides</span>
                      </div>
                    </div>
                    {/* Geometry box entry */}
                    <div className="relative rounded-xl overflow-hidden border border-white shadow-2xs group">
                      <Image 
                        src="https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=300&auto=format&fit=crop&q=60" 
                        alt="Geometry Boxes" 
                        fill 
                        className="object-cover transition-transform group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Supplies</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY SECTION */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              Find exactly what you need sorted into our premium curated categories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categoriesToDisplay.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-100 rounded-2xl p-4 transition-all hover:scale-103 shadow-2xs"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center mb-3">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full group-hover:scale-108 transition-transform"
                  />
                </div>
                <span className="text-xs font-black text-slate-800 text-center group-hover:text-sky-850 transition-colors line-clamp-1">
                  {category.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  {category.count} items
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Popular Study Essentials) */}
      <section className="py-16 sm:py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular Study Essentials
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Our highly recommended items chosen for their outstanding quality and value.
              </p>
            </div>
            <Link
              href="/products"
              className="group text-sky-700 hover:text-sky-800 text-xs sm:text-sm font-extrabold flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Grid Layout: responsive 4-column desktop, 2-column mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((p) => (
              <div 
                key={p.id} 
                className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all hover:scale-101 flex flex-col justify-between"
              >
                {/* Wishlist and Badge overlay */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <button 
                    onClick={(e) => toggleWishlist(p.id, e)}
                    className="bg-white/90 hover:bg-white text-slate-500 p-1.5 rounded-full border border-slate-100 shadow-2xs hover:scale-105 transition-all"
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlist.includes(p.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  </button>
                </div>

                <div 
                  className="relative aspect-square w-full bg-slate-50 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(p)}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  {p.offerBadge && (
                    <span className="absolute top-2.5 left-2.5 bg-sky-100 border border-sky-200/50 text-sky-900 font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs">
                      {p.offerBadge}
                    </span>
                  )}
                </div>

                <div className="p-3.5 flex flex-col flex-grow justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-sky-800 uppercase tracking-widest block">
                      {p.category.replace('-', ' & ')}
                    </span>
                    <h3 
                      onClick={() => setSelectedProduct(p)}
                      className="text-xs sm:text-sm font-black text-slate-900 hover:text-sky-750 transition-colors line-clamp-1 mt-0.5 cursor-pointer"
                    >
                      {p.name}
                    </h3>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-sm sm:text-base font-black text-slate-900">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-slate-400 line-through text-[10px] sm:text-xs font-semibold">₹{p.originalPrice}</span>
                      )}
                    </div>
                    
                    {/* Status badge */}
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.25 rounded-md border mt-1.5 ${
                      p.stockStatus === 'in_stock' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : p.stockStatus === 'low_stock' 
                          ? 'bg-amber-50 text-amber-750 border-amber-100' 
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {p.stockStatus.replace('_', ' ')}
                    </span>

                    {/* Buy/Add-to-cart layout actions */}
                    <div className="grid grid-cols-2 gap-1.5 pt-3.5">
                      <button
                        onClick={() => addToCart(p)}
                        className="bg-sky-50 hover:bg-sky-100 text-sky-800 text-[10px] sm:text-xs font-black py-2 rounded-lg transition-colors border border-sky-100 flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                      <a
                        href={`https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%20want%20to%20order%20${encodeURIComponent(p.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-black py-2 rounded-lg transition-colors border border-emerald-100 flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <MessageSquare className="w-3 h-3 fill-current" />
                        <span>Inquire</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <section className="my-8 py-14 bg-gradient-to-r from-sky-700 via-sky-850 to-indigo-850 text-white text-center rounded-2xl max-w-7xl mx-auto px-4 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-black tracking-tight">Ready for Your Next Study Session?</h2>
          <p className="text-sky-100 text-sm font-medium">
            Find books, notebooks, drawing supplies, exam study materials and all classroom essentials at KV Pustakalaya.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="bg-white hover:bg-slate-50 text-sky-900 font-extrabold text-sm px-8 py-3 rounded-xl transition-all shadow-md inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SERVICES SECTION (CSC & Cyber services) */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              More Than Just a Bookstore
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              We offer essential digital desk utilities and local financial service options for students and parents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="bg-sky-100 text-sky-800 w-9 h-9 rounded-xl flex items-center justify-center mb-3.5">
                <Coins className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Cash Withdrawal</h3>
                <p className="text-2xs text-slate-500 mt-1.5 leading-relaxed font-semibold">
                  Aadhaar Cash Withdrawal (AEPS) and Micro ATM transactions for cash withdrawals at Harari Chowk.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="bg-indigo-100 text-indigo-800 w-9 h-9 rounded-xl flex items-center justify-center mb-3.5">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Online Form Filling</h3>
                <p className="text-2xs text-slate-500 mt-1.5 leading-relaxed font-semibold">
                  Submit job profiles, board entrance examinations, admissions, and prints cleanly.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="bg-sky-100 text-sky-800 w-9 h-9 rounded-xl flex items-center justify-center mb-3.5">
                <Printer className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Photocopy & Printing</h3>
                <p className="text-2xs text-slate-500 mt-1.5 leading-relaxed font-semibold">
                  High-speed photocopying, color printing, laminations, and scan document processing services.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="bg-indigo-100 text-indigo-800 w-9 h-9 rounded-xl flex items-center justify-center mb-3.5">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">CSC / Digital Services</h3>
                <p className="text-2xs text-slate-500 mt-1.5 leading-relaxed font-semibold">
                  CSC services including utility bills payment, pan card creation, and certificates updates.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="bg-sky-100 text-sky-800 w-9 h-9 rounded-xl flex items-center justify-center mb-3.5">
                <FileCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Exam & Document Desk</h3>
                <p className="text-2xs text-slate-500 mt-1.5 leading-relaxed font-semibold">
                  Get updates on board calendars, buy application forms booklets, and competitive guidebooks.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TRUST SECTION (Why Choose KV Pustakalaya) */}
      <section className="py-16 sm:py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-750">Your Trusted Partner</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-905 tracking-tight">
                Why Choose KV Pustakalaya?
              </h2>
              <p className="text-xs sm:text-sm text-slate-550 leading-relaxed font-semibold">
                KV Pustakalaya has been helping students, teachers, and parents at Harari Chowk find genuine notebooks, books, and digital services.
              </p>
            </div>

            {/* Right compact trust cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="flex gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">Genuine & Quality Products</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-relaxed">
                    Direct stock from Classmate, NCERT, CBSE publishers, and authentic drawing sets.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
                <ThumbsUp className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">Affordable Prices</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-relaxed">
                    Fair competitive retail and student packages compared to elsewhere in town.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">Local Customer Support</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-relaxed">
                    Friendly service with instant WhatsApp book checks and digital support.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
                <BookOpen className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">Everything for Your Studies</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-relaxed">
                    A single desk for competitive exam papers, registers, printing, and cash withdraw.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. ABOUT LOCAL STORY */}
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 rounded-full px-3 py-1">Local Business Story</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Trusted Stationery Destination at Harari Chowk</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
            Founded by Prabhat Kumar Prabhakar, KV Pustakalaya has grown into a cornerstone for educational supplies at Harari Chowk. We strive to provide premium stationery, competitive examination publications, school notebooks, and fast digital form-filling portals. We exist to be your perfect learning partner.
          </p>
        </div>
      </section>

      {/* 8. TESTIMONIAL SLIDER */}
      <section className="py-16 bg-transparent">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-10 font-semibold">
            Feedback from students and local residents at Harari Chowk.
          </p>

          <div className="relative bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm min-h-[220px] flex flex-col justify-between">
            <div className="text-sky-200/40 text-7xl font-serif absolute top-1 left-5 pointer-events-none select-none">
              “
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex justify-center gap-1 text-sky-400">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-sky-400" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-slate-750 italic leading-relaxed font-semibold">
                "{testimonials[activeTestimonial].review}"
              </p>
              <div className="pt-2">
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {testimonials[activeTestimonial].name}
                </p>
                <p className="text-[10px] text-sky-750 font-bold uppercase tracking-wider mt-0.5">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={handlePrevTestimonial}
                className="p-1.5 rounded-full hover:bg-slate-50 text-slate-700 border border-slate-150 shadow-2xs"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={handleNextTestimonial}
                className="p-1.5 rounded-full hover:bg-slate-50 text-slate-700 border border-slate-150 shadow-2xs"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION */}
      <section className="py-16 bg-transparent border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Contact details */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-2xs">
              <div className="space-y-3">
                <span className="inline-block bg-sky-50 text-sky-850 border border-sky-100 rounded-full px-3 py-1 text-2xs font-extrabold uppercase tracking-wider">
                  Contact Us
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                  Get in Touch
                </h2>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                  We are situated at Harari Chowk. Drop by to select stationery and books, fill out application forms, or withdraw cash.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                
                <a
                  href="https://maps.app.goo.gl/57sSqyQ89uP3BFyH6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-slate-100 hover:border-sky-100/50 transition-colors group"
                >
                  <MapPin className="w-4.5 h-4.5 text-sky-700 mt-0.5 shrink-0 group-hover:scale-108 transition-transform" />
                  <div>
                    <h3 className="font-extrabold text-slate-905 flex items-center gap-1.5">
                      <span>Address</span>
                      <span className="text-[9px] bg-sky-100 text-sky-900 px-1.5 py-0.25 rounded font-bold uppercase tracking-wider shadow-inner">Map Location</span>
                    </h3>
                    <p className="text-slate-600 mt-0.5 font-medium text-xs">Harari Chowk, Bihar</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Clock className="w-4.5 h-4.5 text-sky-700 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-slate-905">Store Hours</h3>
                    <p className="text-slate-600 mt-0.5 font-medium text-xs">09:00 AM to 08:00 PM (Daily)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Phone className="w-4.5 h-4.5 text-sky-700 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-slate-905">Phone Inquiry</h3>
                    <a href="tel:8340383252" className="text-sky-750 font-black hover:underline block mt-0.5 text-xs">
                      8340383252
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="tel:8340383252"
                  className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-extrabold transition-all border border-slate-200"
                >
                  Call Now
                </a>
                <a
                  href="https://wa.me/918340383252"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Map Frame */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-2xs border border-slate-100 min-h-80 bg-slate-50 relative p-1.5">
              <iframe
                title="KV Pustakalaya Location at Harari Chowk"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.428784381832!2d86.0825!3d26.1555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ee656413f744e1%3A0x448251f375254e32!2sKv%20Pustakalaya!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0 rounded-2xl"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCT QUICK VIEW DIALOG */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[95vh] animate-scale-in">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-slate-50 text-slate-700 p-1.5 rounded-full shadow-md transition-all"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="relative aspect-square w-full md:w-1/2 bg-slate-50 shrink-0">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
              {selectedProduct.offerBadge && (
                <span className="absolute top-4 left-4 bg-sky-100 border border-sky-200 text-sky-905 font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-2xs">
                  {selectedProduct.offerBadge}
                </span>
              )}
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-sky-850 uppercase tracking-widest block">
                  {selectedProduct.category.replace('-', ' & ')}
                </span>
                <h3 className="text-base font-black text-slate-905 leading-snug">{selectedProduct.name}</h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-950">₹{selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-slate-400 line-through text-xs font-semibold">₹{selectedProduct.originalPrice}</span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold">{selectedProduct.description}</p>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">Status:</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${
                    selectedProduct.stockStatus === 'in_stock' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                      : selectedProduct.stockStatus === 'low_stock' 
                        ? 'bg-amber-50 text-amber-800 border-amber-100' 
                        : 'bg-rose-50 text-rose-800 border-rose-100'
                  }`}>
                    {selectedProduct.stockStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                
                <a
                  href={`https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%20want%20to%2520buy%20${encodeURIComponent(selectedProduct.name)}%2520for%20Rs.%2520${selectedProduct.price}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-650 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
