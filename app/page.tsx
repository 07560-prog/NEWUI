'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YachiyoSidebar from '@/components/YachiyoSidebar';
import VibeGrid from '@/components/VibeGrid';
import { getLocalVibes } from '@/lib/storage';
import { Vibe } from '@/types';
import Link from 'next/link';

export default function HomePage() {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setVibes(getLocalVibes());
    setMounted(true);
  }, []);

  return (
    <div className="yachiyo-container">
      {/* Left Sidebar */}
      <YachiyoSidebar />

      {/* Main Content Area */}
      <main className="yachiyo-main-content">
        {/* Header Banner & Visitor Counter */}
        <Header />

        {/* Introduction & Site Notice Box */}
        <div className="yachiyo-panel p-4 my-4 space-y-2 text-xs">
          <div className="font-bold text-sm text-[#224466] border-b border-dotted border-[#487A8A] pb-1 flex items-center justify-between">
            <span>【ABOUT VIBE UI】</span>
            <span className="text-[11px] text-[#666]">Last Updated: 2026/02/26</span>
          </div>
          <p className="text-[#333] leading-relaxed">
            Welcome to <strong>VIBE UI</strong> — an open-source online archive dedicated to creative interactive UI components, generative canvas physics, and kinetic typography built with raw HTML, CSS, and JavaScript.<br />
            Every project runs live inside an isolated, secure iframe sandbox. If you discover a vibe you love, feel free to give it stars (★), leave ratings, and join the discussion on the BBS!
          </p>
          <div className="flex flex-wrap gap-2 pt-1 font-bold">
            <Link
              href="/studio"
              className="bg-[#FF7733] text-white px-3 py-1 border border-[#D26432] shadow-sm hover:bg-[#ff8844] inline-block"
            >
              ★ Submit an Artifact (VIBE STUDIO)
            </Link>
            <a
              href="#gallery"
              className="bg-white text-[#0000CD] underline px-3 py-1 border border-[#487A8A] hover:bg-[#F0F8FF] inline-block"
            >
              ▼ Explore Gallery ({vibes.length} artifacts)
            </a>
          </div>
        </div>

        {/* Update History Table */}
        <div className="my-6 space-y-1">
          <div className="font-bold text-xs text-[#224466]">
            ■ UPDATE LOG
          </div>
          <table className="yachiyo-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Date</th>
                <th style={{ width: '120px' }}>Section</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center font-bold">2026.02.26</td>
                <td className="text-center text-[#0000CD] font-bold">Gallery</td>
                <td>Added fluid physics &ldquo;Zen Calligraphy Wave Ripple&rdquo; and &ldquo;Zen Harmonic Chrono&rdquo;!</td>
              </tr>
              <tr>
                <td className="text-center font-bold">2026.02.22</td>
                <td className="text-center text-[#0000CD] font-bold">Studio</td>
                <td>HTML5 real-time sandbox preview &amp; ZIP export features activated.</td>
              </tr>
              <tr>
                <td className="text-center font-bold">2026.02.15</td>
                <td className="text-center text-[#0000CD] font-bold">Launch</td>
                <td>VIBE UI Repository officially online. Link exchanges welcome ☆</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Gallery / Feed Stream */}
        <section className="my-6">
          {mounted && <VibeGrid initialVibes={vibes} />}
        </section>

        {/* Bottom Footer with Alliance Links */}
        <Footer />
      </main>
    </div>
  );
}
