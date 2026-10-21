import React from 'react';

export default function Footer() {
  return (
    <footer id="alliance" className="mt-12 pt-6 border-t-2 border-[#487A8A] text-center text-xs text-[#444]">
      {/* Alliance Links Section */}
      <div className="mb-6">
        <div className="font-bold text-base text-[#4a4a4a] mb-3">
          🍀 ALLIANCE LINKS (WEBRING 88x31 BANNERS) 🍀
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex flex-col items-center text-[10px]">
            <div className="yachiyo-badge-88 bg-gradient-to-r from-blue-700 to-cyan-500">
              NEXT.JS 15
            </div>
            <span className="text-[#0000CD] underline mt-1 font-bold">★App Router★</span>
          </div>

          <div className="flex flex-col items-center text-[10px]">
            <div className="yachiyo-badge-88 bg-gradient-to-r from-emerald-700 to-teal-500">
              SUPABASE
            </div>
            <span className="text-[#0000CD] underline mt-1 font-bold">★PostgreSQL RLS★</span>
          </div>

          <div className="flex flex-col items-center text-[10px]">
            <div className="yachiyo-badge-88 bg-gradient-to-r from-amber-600 to-yellow-500">
              NETSCAPE
            </div>
            <span className="text-[#0000CD] underline mt-1 font-bold">★NOW 4.0★</span>
          </div>

          <div className="flex flex-col items-center text-[10px]">
            <div className="yachiyo-badge-88 bg-gradient-to-r from-indigo-700 to-purple-500">
              1024x768
            </div>
            <span className="text-[#0000CD] underline mt-1 font-bold">★RECOMMENDED★</span>
          </div>

          <div className="flex flex-col items-center text-[10px]">
            <div className="yachiyo-badge-88 bg-gradient-to-r from-rose-600 to-pink-500">
              OMELET
            </div>
            <span className="text-[#0000CD] underline mt-1 font-bold">★OMELET CLUB★</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-3 bg-white/40 border border-[#487A8A] text-[11px] text-[#555] space-y-1">
        <div>
          Copyright &copy; 2026 <strong>Yachiyo&apos;s Room // VIBE UI</strong>. All Rights Reserved.
        </div>
        <div className="text-[10px] text-[#777]">
          Powered by Next.js 15, Supabase, Tailwind CSS, and 2000s Web Nostalgia.
        </div>
      </div>
    </footer>
  );
}
