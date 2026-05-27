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
    <div className="flex-grow bg-slate-50 min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-12 text-center border-b border-sky-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Contact Us</h1>
          <p className="text-sm sm:text-base text-sky-200">
            Have questions about syllabus books, forms, or cash services? Send us a message!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="inline-block bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                Store Location
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                Connect with KV Pustakalaya
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Drop by our shop at Harari Chowk for offline services, or reach out to us using the direct channels below.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <MapPin className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Store Location</h3>
                  <p className="text-slate-600 text-xs mt-1">Harari Chowk, Bihar</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <Clock className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Working Hours</h3>
                  <p className="text-slate-600 text-xs mt-1">09:00 AM to 08:00 PM (Daily)</p>
                  <p className="text-3xs text-sky-600 font-semibold uppercase mt-0.5">Closed on festivals only</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <Phone className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Direct Call</h3>
                  <a href="tel:8340383252" className="text-sky-600 font-extrabold text-sm hover:underline block mt-1">
                    8340383252
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <User className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Owner Information</h3>
                  <p className="text-slate-700 text-xs mt-1 font-semibold">Owner: Prabhat Kumar Prabhakar</p>
                  <p className="text-slate-500 text-2xs mt-0.5 leading-relaxed">
                    KV Pustakalaya is managed by Prabhat Kumar Prabhakar, dedicated to providing quality stationery and cyber facilities.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <a
                href="tel:8340383252"
                className="flex-1 text-center py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <a
                href="https://wa.me/918340383252"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Inquiry Form & Map Embed */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Inquiry Form */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Send Online Inquiry</h2>
                <p className="text-xs text-slate-500 mt-1">Submit your details and we will verify the book availability or service for you.</p>
              </div>

              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">Inquiry Sent Successfully!</p>
                    <p className="text-emerald-600 mt-0.5">Thank you. Owner Prabhat Kumar Prabhakar will get back to you shortly.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-rose-50 border border-rose-150 rounded-2xl p-4 text-rose-800 text-xs font-semibold">
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full brand-gradient hover:brand-gradient-hover text-white py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Google Map Location */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200 aspect-video w-full bg-white relative">
              <iframe
                title="KV Pustakalaya Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.428784381832!2d86.0825!3d26.1555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA5JzE5LjgiTiA4NsKwMDQnNTcuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0"
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
