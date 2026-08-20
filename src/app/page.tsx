'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db, Product, Category, Offer } from '@/lib/db';
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
  X
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Load from database on mount
  useEffect(() => {
    setProducts(db.getProducts());
    setCategories(db.getCategories());
    setOffers(db.getOffers());
  }, []);

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = products.filter(p => p.newArrival).slice(0, 4);

  const testimonials = [
    { name: 'Aman Kumar', role: 'College Student', review: 'KV Pustakalaya has been my primary source for competitive exam books. Prabhat Bhaiya always guides us with the latest editions, and their form filling service is incredibly fast and hassle-free!', rating: 5 },
    { name: 'Sadhana Mishra', role: 'Teacher', review: 'I purchase drawing books and notebooks in bulk for school students. The quality of paper is excellent, and they have competitive prices compared to others at Harari Chowk.', rating: 5 },
    { name: 'Rajesh Yadav', role: 'Local Resident', review: 'Their Cash Withdrawal service is a life saver. Since ATMs are often crowded, I easily withdraw cash here when buying supplies. Highly convenient!', rating: 5 }
  ];

  const stats = [
    { label: 'Happy Customers', value: '5,000+' },
    { label: 'Forms Filled', value: '1,200+' },
    { label: 'Product Varieties', value: '150+' },
    { label: 'Years of Trust', value: '8+' }
  ];

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO BANNER & SERVICES HIGHLIGHT */}
      <section className="relative overflow-hidden bg-transparent text-[#17202A] pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/40 border border-white/60 text-sky-855 text-xs sm:text-sm font-bold shadow-sm backdrop-blur-sm">
                <SparklesIcon className="w-4 h-4 animate-spin text-sky-500" />
                <span>Harari Chowk's Most Trusted Stationery Hub</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 drop-shadow-sm">
                KV Pustakalaya
              </h1>
              <p className="text-2xl sm:text-3xl font-serif text-sky-800 font-extrabold italic tracking-wide">
                “पढ़ाई का Perfect Partner”
              </p>
              <p className="text-base sm:text-lg text-slate-650 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Explore a premium collection of notebooks, pens, school textbooks, competitive study materials, and more. Backed by direct customer care and local services.
              </p>
 
              {/* Glowing badges/cards right in Hero section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0 pt-4">
                {/* Cash Withdrawal Badge */}
                <div className="glow-pulse-blue crystal-glass rounded-2xl p-4 flex items-center gap-3.5 border border-white/50 text-left">
                  <div className="bg-[#9DE8FF]/60 p-2.5 rounded-xl text-sky-900 border border-white/60">
                    <CreditCard className="w-5 h-5 text-sky-900" />
                  </div>
                  <div>
                    <h3 className="text-2xs text-sky-800 uppercase tracking-widest font-extrabold">ATM Service</h3>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">Cash Withdrawal Available</p>
                    <p className="text-slate-650 text-2xs mt-0.5 font-medium">नकद निकासी की सुविधा</p>
                  </div>
                </div>
 
                {/* Form Filling Badge */}
                <div className="glow-pulse-cyan crystal-glass rounded-2xl p-4 flex items-center gap-3.5 border border-white/50 text-left">
                  <div className="bg-[#DDD6FF]/60 p-2.5 rounded-xl text-indigo-900 border border-white/60">
                    <FileText className="w-5 h-5 text-indigo-900" />
                  </div>
                  <div>
                    <h3 className="text-2xs text-indigo-800 uppercase tracking-widest font-extrabold">Cyber Service</h3>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">Online Form Filling</p>
                    <p className="text-slate-650 text-2xs mt-0.5 font-medium">ऑनलाइन फॉर्म भरा जाता है</p>
                  </div>
                </div>
              </div>
 
              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/products"
                  className="brand-gradient hover:brand-gradient-hover text-[#17202A] text-base font-extrabold px-8 py-3.5 rounded-full shadow-lg hover:shadow-sky-200/40 hover:scale-102 transition-all animate-pulse duration-[3000ms]"
                >
                  Shop Now
                </Link>
                <Link
                  href="/contact"
                  className="glass-button text-[#17202A] text-base font-extrabold px-8 py-3.5 rounded-full hover:scale-102 transition-all border border-white/65 shadow-sm"
                >
                  Contact Us
                </Link>
              </div>
            </div>
 
            {/* Right Hero Brand Visual */}
            <div className="lg:col-span-5 flex justify-center w-full relative">
              
              {/* Faceted crystal diamonds floating around */}
              <div className="absolute -top-10 -right-8 animate-float-slow pointer-events-none select-none z-20">
                <svg viewBox="0 0 100 100" className="w-14 h-14 drop-shadow-[0_8px_20px_rgba(185,217,255,0.4)] opacity-85">
                  <polygon points="50,5 95,35 50,95 5,35" fill="url(#hero-diamond-grad)" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
                  <polygon points="50,5 50,95" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
                  <polygon points="5,35 95,35" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
                  <polygon points="50,5 25,35 50,95 75,35" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
                  <defs>
                    <linearGradient id="hero-diamond-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                      <stop offset="35%" stopColor="#DDF4FF" stopOpacity="0.6" />
                      <stop offset="70%" stopColor="#9DE8FF" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#DDD6FF" stopOpacity="0.7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
 
              <div className="absolute -bottom-12 -left-6 animate-float-medium pointer-events-none select-none z-20">
                <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-[0_6px_15px_rgba(157,232,255,0.35)] opacity-80">
                  <polygon points="50,5 95,35 50,95 5,35" fill="url(#hero-diamond-grad-sm)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
                  <polygon points="50,5 50,95" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                  <polygon points="5,35 95,35" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                  <polygon points="50,5 25,35 50,95 75,35" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <defs>
                    <linearGradient id="hero-diamond-grad-sm" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#9DE8FF" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#DDD6FF" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
 
              <div className="relative w-full max-w-lg aspect-[3/2] rounded-2xl bg-white/20 p-2 border border-white/45 flex items-center justify-center animate-in fade-in zoom-in duration-700 shadow-2xl backdrop-blur-md">
                {/* Floating Elements */}
                <div className="absolute -top-3.5 -left-2 bg-white/50 border border-white/70 text-[#17202A] text-xs px-3.5 py-1.5 rounded-full font-extrabold shadow-md animate-bounce z-10 backdrop-blur-md">
                  ✏️ Stationery
                </div>
                <div className="absolute -bottom-3.5 -right-2 bg-white/50 border border-white/70 text-[#17202A] text-xs px-3.5 py-1.5 rounded-full font-extrabold shadow-md animate-bounce delay-300 z-10 backdrop-blur-md">
                  📚 Exam Books
                </div>
 
                <div className="w-full h-full rounded-xl overflow-hidden relative border-4 border-white/80 bg-white/10 flex items-center justify-center">
                  <Image
                    src="/banner.jpg"
                    alt="KV Digitel Center & KV Pustakalaya Banner"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
 
          </div>
        </div>
      </section>

      {/* 2. SERVICES HIGHLIGHT SECTION */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Our Premium Services
            </h2>
            <p className="text-sm text-slate-650 mt-2 font-medium">
              Beyond study stationery, we provide modern utilities to assist local residents and students.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="crystal-glass-interactive rounded-2xl p-6 border border-white/50 flex flex-col">
              <div className="bg-white/50 border border-white/70 text-sky-750 w-11 h-11 rounded-xl flex items-center justify-center mb-4 shrink-0 shadow-sm backdrop-blur-sm">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Aadhaar Cash Withdrawal</h3>
              <p className="text-xs text-slate-650 mt-2.5 leading-relaxed font-medium">
                Withdraw money safely using Aadhaar-enabled payments (AEPS) or micro ATMs without visiting distant banks.
              </p>
            </div>

            <div className="crystal-glass-interactive rounded-2xl p-6 border border-white/50 flex flex-col">
              <div className="bg-white/50 border border-white/70 text-sky-750 w-11 h-11 rounded-xl flex items-center justify-center mb-4 shrink-0 shadow-sm backdrop-blur-sm">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Online Form Filling</h3>
              <p className="text-xs text-slate-650 mt-2.5 leading-relaxed font-medium">
                Assistance with competitive examinations forms, job application portals, admissions, and printing services.
              </p>
            </div>

            <div className="crystal-glass-interactive rounded-2xl p-6 border border-white/50 flex flex-col">
              <div className="bg-white/50 border border-white/70 text-sky-750 w-11 h-11 rounded-xl flex items-center justify-center mb-4 shrink-0 shadow-sm backdrop-blur-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">School Supplies</h3>
              <p className="text-xs text-slate-650 mt-2.5 leading-relaxed font-medium">
                Complete package of class notebooks, instrument boxes, craft glitters, folders, and standard syllabus guides.
              </p>
            </div>

            <div className="crystal-glass-interactive rounded-2xl p-6 border border-white/50 flex flex-col">
              <div className="bg-white/50 border border-white/70 text-sky-750 w-11 h-11 rounded-xl flex items-center justify-center mb-4 shrink-0 shadow-sm backdrop-blur-sm">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Competitive Books</h3>
              <p className="text-xs text-slate-650 mt-2.5 leading-relaxed font-medium">
                Specialized study guides for SSC CGL, Railways, Banking exams, UPSC notes, and local recruitment exams.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Shop By Category
              </h2>
              <p className="text-sm text-slate-650 mt-1 font-medium">
                Browse our wide variety of educational and office equipment.
              </p>
            </div>
            <Link
              href="/products"
              className="group text-sky-700 hover:text-sky-800 text-sm font-extrabold flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group crystal-glass-interactive overflow-hidden flex flex-col justify-between border border-white/50 shadow-sm rounded-2xl"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/20 transition-all"></div>
                </div>
                <div className="p-4 flex flex-col items-center text-center">
                  <span className="text-sm font-extrabold text-slate-900 group-hover:text-sky-750 transition-colors">
                    {category.name}
                  </span>
                  <span className="text-2xs text-slate-600 mt-0.5 font-semibold">
                    {category.count} Products available
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS & QUICK VIEW */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-slate-650 mt-2 font-medium">
              Our highly recommended items chosen for their outstanding quality and value.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={() => setSelectedProduct(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-sm text-slate-650 mt-2 font-medium">
              Check out the latest notebooks, pen sets, and updated syllabus competitive books.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={() => setSelectedProduct(p)} />
            ))}
          </div>
        </div>
      </section>


      {/* 7. WHY CHOOSE KV PUSTAKALAYA */}
      <section className="py-16 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Why details */}
            <div className="lg:col-span-6 space-y-6 text-[#17202A]">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Why Shop At <span className="text-sky-800">KV Pustakalaya</span>?
              </h2>
              <p className="text-slate-650 text-sm font-medium leading-relaxed">
                KV Pustakalaya isn't just a shop, it's a dedicated local institution helping students and parents at Harari Chowk find the right tools for learning.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-white/40 text-sky-700 w-12 h-12 rounded-xl shrink-0 flex items-center justify-center border border-white/60 shadow-sm backdrop-blur-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">100% Genuine Supplies</h3>
                    <p className="text-xs text-slate-650 mt-1 font-medium leading-relaxed">
                      We deal directly with brands like Classmate, Camlin, Reynolds, NCERT, CBSE publishers, ensuring authentic materials.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white/40 text-sky-700 w-12 h-12 rounded-xl shrink-0 flex items-center justify-center border border-white/60 shadow-sm backdrop-blur-sm">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">All-In-One Cyber Desk</h3>
                    <p className="text-xs text-slate-650 mt-1 font-medium leading-relaxed">
                      Save trips to cyber cafes. We help you fill job application forms, print hall tickets, and do rapid cash withdrawals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white/40 text-sky-700 w-12 h-12 rounded-xl shrink-0 flex items-center justify-center border border-white/60 shadow-sm backdrop-blur-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Always Accessible</h3>
                    <p className="text-xs text-slate-650 mt-1 font-medium leading-relaxed">
                      Convenient hours from 9 AM to 8 PM, seven days a week, plus direct WhatsApp support for quick checking of book stocks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Statistics Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="crystal-glass-interactive border border-white/50 rounded-3xl p-6 text-center flex flex-col justify-center"
                >
                  <p className="text-3xl sm:text-4xl font-black text-sky-750">
                    {stat.value}
                  </p>
                  <p className="text-2xs sm:text-xs font-bold text-slate-705 mt-2 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 8. TESTIMONIAL SLIDER */}
      <section className="py-16 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            What Our Customers Say
          </h2>
          <p className="text-sm text-slate-650 mb-10 font-medium">
            Hear from local students, teachers, and parents at Harari Chowk.
          </p>

          <div className="relative crystal-glass border border-white/55 rounded-3xl p-8 sm:p-12 shadow-lg min-h-60 flex flex-col justify-between backdrop-blur-md">
            {/* Quote Icon */}
            <div className="text-sky-300/30 text-7xl font-serif absolute top-2 left-6 pointer-events-none select-none">
              “
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex justify-center gap-1 text-sky-400">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-sky-400" />
                ))}
              </div>
              <p className="text-base sm:text-lg text-slate-805 italic leading-relaxed font-semibold">
                "{testimonials[activeTestimonial].review}"
              </p>
              <div className="pt-4">
                <p className="text-base font-extrabold text-slate-900">
                  {testimonials[activeTestimonial].name}
                </p>
                <p className="text-xs text-sky-750 font-bold uppercase tracking-wider mt-0.5">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
            </div>

            {/* Slider Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handlePrevTestimonial}
                className="p-2 rounded-full glass-button text-slate-700 border border-white/60 shadow-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextTestimonial}
                className="p-2 rounded-full glass-button text-slate-700 border border-white/60 shadow-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* 9 & 10. CONTACT INFO & MAP LOCATION */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact details */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="inline-block bg-white/40 text-sky-800 border border-white/60 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
                  Find Our Shop
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Visit KV Pustakalaya
                </h2>
                <p className="text-slate-650 text-sm font-medium leading-relaxed">
                  We are conveniently situated at Harari Chowk. Drop by to select stationery and books, fill out application forms, or withdraw cash.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <a
                  href="https://maps.app.goo.gl/57sSqyQ89uP3BFyH6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 crystal-glass-interactive p-4 rounded-2xl border border-white/50 shadow-sm group block"
                >
                  <MapPin className="w-5 h-5 text-sky-655 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 flex items-center gap-1">
                      <span>Address</span>
                      <span className="text-3xs bg-white/60 text-sky-800 px-1.5 py-0.5 rounded border border-white font-bold uppercase tracking-wider shadow-inner">Directions</span>
                    </h3>
                    <p className="text-slate-650 mt-0.5 group-hover:text-sky-850 transition-colors font-medium">Harari Chowk, Bihar</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 crystal-glass p-4 rounded-2xl border border-white/50 shadow-sm">
                  <Clock className="w-5 h-5 text-sky-655 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-slate-900">Store Hours</h3>
                    <p className="text-slate-655 mt-0.5 font-medium">09:00 AM to 08:00 PM (Daily)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 crystal-glass p-4 rounded-2xl border border-white/50 shadow-sm">
                  <Phone className="w-5 h-5 text-sky-655 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-slate-900">Contact Number</h3>
                    <a href="tel:8340383252" className="text-sky-700 font-black hover:underline block mt-0.5">
                      8340383252
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="tel:8340383252"
                  className="flex-1 text-center py-3 glass-button text-[#17202A] rounded-xl text-sm font-extrabold transition-all border border-white/60 shadow-sm"
                >
                  Call Now
                </a>
                <a
                  href="https://wa.me/918340383252"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 bg-gradient-to-r from-[#9DE8FF]/60 to-[#B9D9FF]/60 hover:from-[#9DE8FF]/80 hover:to-[#B9D9FF]/80 text-[#17202A] rounded-xl text-sm font-extrabold transition-all border border-white/50 shadow-sm"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Google Map */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-lg border border-white/40 min-h-80 bg-white/20 p-1 relative backdrop-blur-sm">
              <iframe
                title="KV Pustakalaya Location at Harari Chowk"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.428784381832!2d86.0825!3d26.1555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ee656413f744e1%3A0x448251f375254e32!2sKv%20Pustakalaya!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-square w-full md:w-1/2 bg-slate-100">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
              {selectedProduct.offerBadge && (
                <span className="absolute top-4 left-4 bg-amber-500 text-white font-extrabold text-2xs uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                  {selectedProduct.offerBadge}
                </span>
              )}
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <span className="text-2xs font-semibold text-sky-600 uppercase tracking-widest block">
                  {selectedProduct.category.replace('-', ' & ')}
                </span>
                <h3 className="text-xl font-bold text-slate-950">{selectedProduct.name}</h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-950">₹{selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-slate-400 line-through text-sm font-semibold">₹{selectedProduct.originalPrice}</span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{selectedProduct.description}</p>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-bold text-slate-500">Status:</span>
                  <span className={`text-2xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    selectedProduct.stockStatus === 'in_stock' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : selectedProduct.stockStatus === 'low_stock' 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-rose-50 text-rose-700'
                  }`}>
                    {selectedProduct.stockStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href={`https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%20want%20to%20buy%20${encodeURIComponent(selectedProduct.name)}%20for%20Rs.%20${selectedProduct.price}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Send WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Single Product Card Component
function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  return (
    <div className="group crystal-glass-interactive overflow-hidden flex flex-col justify-between rounded-2xl border border-white/50 shadow-sm">
      <div className="relative aspect-square w-full bg-white/10 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-103"
        />
        {product.offerBadge && (
          <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-[#9DE8FF]/90 to-[#B9D9FF]/90 text-[#17202A] font-extrabold text-3xs uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md border border-white/50">
            {product.offerBadge}
          </span>
        )}
        
        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <button
            onClick={onOpen}
            className="bg-white/80 text-[#17202A] text-xs font-extrabold px-4.5 py-2 rounded-full shadow-lg hover:bg-white transition-all hover:scale-105 border border-white/60"
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col space-y-2">
        <span className="text-3xs font-extrabold text-sky-800 uppercase tracking-widest block">
          {product.category.replace('-', ' & ')}
        </span>
        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-850 transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-950">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-slate-500 line-through text-xs font-semibold">₹{product.originalPrice}</span>
            )}
          </div>
          <span className={`text-3xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
            product.stockStatus === 'in_stock' 
              ? 'bg-emerald-100/50 text-emerald-805 border-emerald-200/30' 
              : product.stockStatus === 'low_stock' 
                ? 'bg-amber-100/50 text-amber-805 border-amber-200/30' 
                : 'bg-rose-100/50 text-rose-805 border-rose-200/30'
          }`}>
            {product.stockStatus.replace('_', ' ')}
          </span>
        </div>

        <div className="pt-2">
          <a
            href={`https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%20want%20to%20inquire%20about%20${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 bg-[#B9D9FF]/40 hover:bg-[#B9D9FF]/70 text-[#17202A] py-2.5 rounded-xl font-extrabold text-xs transition-colors border border-white/50 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-800 fill-current" />
            <span>Order</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// Simple sparkler icon helper
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.071 4.929a10 10 0 00-14.142 14.142M19.071 4.929a10 10 0 010 14.142M19.071 4.929l-1.414 1.414"
      />
    </svg>
  );
}
