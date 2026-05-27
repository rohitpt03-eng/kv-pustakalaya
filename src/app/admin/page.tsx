'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect directly to dashboard
    const isLoggedIn = sessionStorage.getItem('kv_admin_session');
    if (isLoggedIn === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay to simulate verification
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('kv_admin_session', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Invalid username or password. Please use admin / admin123.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex-grow bg-slate-950 flex flex-col justify-center items-center p-4 relative min-h-screen">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Homepage</span>
        </Link>

        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="relative w-18 h-18 bg-white rounded-full p-0.5 mx-auto shadow-md flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="KV Pustakalaya Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">KV Pustakalaya</h1>
            <p className="text-2xs text-sky-400 font-bold uppercase tracking-wider mt-0.5">Admin Security Login</p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/35 rounded-xl p-3.5 text-rose-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Username</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl py-2.5 pl-9 pr-4 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                required
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl py-2.5 pl-9 pr-10 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-350 absolute right-3 top-3.5 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full brand-gradient hover:brand-gradient-hover text-white py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-sky-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Verify Credentials</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-3xs text-slate-500 leading-relaxed uppercase tracking-wider">
            Owner Profile: Prabhat Kumar Prabhakar
          </p>
        </div>

      </div>
    </div>
  );
}
