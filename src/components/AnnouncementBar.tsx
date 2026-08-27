'use client';

import { usePathname } from 'next/navigation';
import { CreditCard, FileText } from 'lucide-react';

export default function AnnouncementBar() {
  const pathname = usePathname();

  // Hide on admin dashboard pages
  if (pathname.startsWith('/admin/dashboard')) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#DDF4FF]/80 via-[#9DE8FF]/40 to-[#DDF4FF]/80 text-[#17202A] border-b border-[#B9D9FF]/30 py-2 px-4 text-center text-2xs sm:text-xs font-bold flex items-center justify-center gap-3 sm:gap-6 overflow-hidden select-none">
      <span className="flex items-center gap-1.5 shrink-0 text-sky-905">
        <CreditCard className="w-3.5 h-3.5 text-sky-655" />
        Cash Withdrawal Available (नकद निकासी सुविधा)
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></span>
      <span className="flex items-center gap-1.5 shrink-0 text-indigo-905">
        <FileText className="w-3.5 h-3.5 text-indigo-655" />
        Online Form Filling Available (ऑनलाइन फॉर्म सुविधा)
      </span>
    </div>
  );
}
