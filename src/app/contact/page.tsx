'use client';

import React, { useState } from 'react';
import { db } from '@/lib/db';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageSquare,
  User
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Please fill in all the required fields.');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    try {
      db.addInquiry({
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim()
      });
      
      setSubmitted(true);
      setName('');
      setPhone('');
      setMessage('');
      
      // Auto dismiss success banner after 5s
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex-grow bg-transparent min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="relative py-12 text-center mt-6 max-w-7xl mx-auto crystal-glass border border-white/50 shadow-sm rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9DE8FF]/10 to-[#DDD6FF]/10 -z-10"></div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">Contact Us</h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Have questions about syllabus books, forms, or cash services? Send us a message!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="inline-block bg-white/40 text-sky-850 border border-white/60 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
                Store Location
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                Connect with KV Pustakalaya
              </h2>
              <p className="text-sm text-slate-655 font-medium leading-relaxed">
                Drop by our shop at Harari Chowk for offline services, or reach out to us using the direct channels below.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <a
                href="https://maps.app.goo.gl/57sSqyQ89uP3BFyH6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 crystal-glass-interactive p-5 rounded-2xl border border-white/50 shadow-sm group block"
              >
                <MapPin className="w-5 h-5 text-sky-655 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                    <span>Store Location</span>
                    <span className="text-3xs bg-white/60 text-sky-800 px-1.5 py-0.5 rounded border border-white font-bold uppercase tracking-wider shadow-inner">Directions</span>
                  </h3>
                  <p className="text-slate-655 text-xs mt-1 group-hover:text-sky-850 transition-colors font-medium">Harari Chowk, Bihar</p>
                </div>
              </a>

              <div className="flex items-start gap-3 crystal-glass p-5 rounded-2xl border border-white/50 shadow-sm">
                <Clock className="w-5 h-5 text-sky-655 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Working Hours</h3>
                  <p className="text-slate-655 text-xs mt-1 font-medium">09:00 AM to 08:00 PM (Daily)</p>
                  <p className="text-3xs text-sky-800 font-bold uppercase mt-0.5">Closed on festivals only</p>
                </div>
              </div>

              <div className="flex items-start gap-3 crystal-glass p-5 rounded-2xl border border-white/50 shadow-sm">
                <Phone className="w-5 h-5 text-sky-655 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Direct Call</h3>
                  <a href="tel:8340383252" className="text-sky-750 font-black text-sm hover:underline block mt-1">
                    8340383252
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 crystal-glass p-5 rounded-2xl border border-white/50 shadow-sm">
                <User className="w-5 h-5 text-sky-655 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Owner Information</h3>
                  <p className="text-slate-800 text-xs mt-1 font-bold">Owner: Prabhat Kumar Prabhakar</p>
                  <p className="text-slate-655 text-2xs mt-0.5 leading-relaxed font-medium">
                    KV Pustakalaya is managed by Prabhat Kumar Prabhakar, dedicated to providing quality stationery and cyber facilities.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <a
                href="tel:8340383252"
                className="flex-1 text-center py-3 glass-button text-[#17202A] rounded-xl text-xs font-extrabold transition-all border border-white/60 shadow-sm flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <a
                href="https://wa.me/918340383252"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 bg-gradient-to-r from-[#9DE8FF]/60 to-[#B9D9FF]/60 hover:from-[#9DE8FF]/80 hover:to-[#B9D9FF]/80 text-[#17202A] rounded-xl text-xs font-extrabold transition-all border border-white/50 shadow-sm flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current text-sky-800" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Inquiry Form & Map Embed */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Inquiry Form */}
            <div className="crystal-glass p-8 rounded-3xl border border-white/50 shadow-lg space-y-6 backdrop-blur-md">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Send Online Inquiry</h2>
                <p className="text-xs text-slate-650 mt-1 font-medium">Submit your details and we will verify the book availability or service for you.</p>
              </div>

              {submitted && (
                <div className="bg-emerald-100/50 border border-emerald-250/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-805">
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">Inquiry Sent Successfully!</p>
                    <p className="text-emerald-705 mt-0.5">Thank you. Owner Prabhat Kumar Prabhakar will get back to you shortly.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-rose-100/50 border border-rose-250/30 rounded-2xl p-4 text-rose-805 text-xs font-bold">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-2xs font-bold text-slate-500 uppercase tracking-wider block">Your Name *</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/40 border border-slate-200 rounded-xl py-2.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white/60 text-[#17202A] placeholder-slate-500 transition-all font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-2xs font-bold text-slate-500 uppercase tracking-wider block">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 8340383252"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/40 border border-slate-200 rounded-xl py-2.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white/60 text-[#17202A] placeholder-slate-500 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-2xs font-bold text-slate-500 uppercase tracking-wider block">Your Message *</label>
                  <textarea
                    placeholder="Write details of books, copies, online forms, or cash withdrawals you need..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/40 border border-slate-200 rounded-xl py-2.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white/60 text-[#17202A] placeholder-slate-500 transition-all font-medium"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full brand-gradient hover:brand-gradient-hover text-[#17202A] py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5 border border-white/45"
                >
                  <Send className="w-4 h-4 text-sky-850" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Google Map Location */}
            <div className="crystal-glass p-1 border border-white/40 shadow-lg rounded-3xl overflow-hidden aspect-video w-full bg-white/20 relative backdrop-blur-sm">
              <iframe
                title="KV Pustakalaya Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.428784381832!2d86.0825!3d26.1555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ee656413f744e1%3A0x448251f375254e32!2sKv%20Pustakalaya!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0 rounded-2xl"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
