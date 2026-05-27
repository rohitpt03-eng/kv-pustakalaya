'use client';

import { usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Hide on admin dashboard pages
  if (pathname.startsWith('/admin/dashboard')) {
    return null;
  }

  return (
    <a
      href="https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%20want%20to%20inquire%20about%20your%20products/services."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-300"
      aria-label="Contact KV Pustakalaya on WhatsApp"
      title="Contact on WhatsApp"
    >
      {/* Tooltip */}
      <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap shadow-md">
        Chat with us! (8340383252)
      </span>
      
      {/* Outer pulsing rings */}
      <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping -z-10 group-hover:opacity-0 transition-opacity"></span>
      <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-40 animate-pulse -z-10"></span>
      
      {/* SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.012 2C6.485 2 2 6.485 2 12.012c0 1.766.457 3.49 1.332 5.023L2 22l5.127-1.314c1.477.808 3.14 1.233 4.885 1.233 5.527 0 10.012-4.485 10.012-10.012C22.024 6.485 17.539 2 12.012 2zm0 1.838c4.516 0 8.174 3.658 8.174 8.174 0 4.516-3.658 8.174-8.174 8.174-1.534 0-3.003-.432-4.288-1.246l-.307-.197-3.189.818.835-3.111-.214-.337A8.106 8.106 0 0 1 3.838 12.012c0-4.516 3.658-8.174 8.174-8.174zm-2.923 3.328c-.164 0-.342.02-.507.093-.207.093-.404.207-.585.358-.456.389-.705.882-.705 1.488 0 1.229.897 2.417 1.996 3.516 1.099 1.099 2.287 1.996 3.516 1.996.606 0 1.099-.249 1.488-.705.15-.181.264-.378.358-.585.073-.165.093-.343.093-.507a.389.389 0 0 0-.254-.363c-.451-.223-1.079-.534-1.246-.606-.165-.073-.343-.073-.483.125-.104.145-.404.508-.508.627-.104.119-.207.135-.373.052-.378-.187-.808-.436-1.192-.778-.383-.342-.71-.741-.892-1.078-.166-.166-.02-.26.062-.373.088-.12.228-.275.321-.389.093-.114.124-.192.187-.321.062-.124.031-.249-.016-.342-.047-.093-.415-.996-.565-1.359-.15-.363-.306-.311-.42-.311z" />
      </svg>
    </a>
  );
}
