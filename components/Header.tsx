'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Header() {
  const [claps, setClaps] = useState<number>(1420);
  const [visitorCount, setVisitorCount] = useState<string>('048291');
  const [showClapThanks, setShowClapThanks] = useState(false);

  useEffect(() => {
    const savedClaps = localStorage.getItem('vibeui_webclaps');
    if (savedClaps) setClaps(parseInt(savedClaps, 10));
    else localStorage.setItem('vibeui_webclaps', '1420');

    const count = 48290 + (Math.floor(Date.now() / 60000) % 500);
    setVisitorCount(String(count).padStart(6, '0'));
  }, []);

  const handleClap = () => {
    const newCount = claps + 1;
    setClaps(newCount);
    localStorage.setItem('vibeui_webclaps', String(newCount));
    setShowClapThanks(true);

    try {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.3 },
        colors: ['#FF7733', '#87D4DA', '#FDFAC8'],
      });
    } catch {
      // Safe fallback
    }

    setTimeout(() => {
      setShowClapThanks(false);
    }, 2500);
  };

  return (
    <div className="w-full flex flex-col items-center mb-6 text-center select-none">
      {/* Top Banner Row */}
      <div className="flex items-center justify-center gap-3 my-2">
        <span className="text-2xl text-[#224466]">✦</span>
        <h1 className="text-2xl sm:text-4xl font-black tracking-widest text-[#224466] drop-shadow-[1px_1px_0_#fff]">
          VIBE UI
        </h1>
        <span className="text-2xl text-[#224466]">✦</span>
      </div>

      <div className="text-xs font-bold text-[#111] drop-shadow-[1px_1px_0_#fff] px-2 leading-relaxed">
        ★★★ WELCOME! AN INTERACTIVE HTML / CSS / JS WEB ARTIFACT REPOSITORY ★★★
      </div>

      {/* Retro Marquee Warning Bar */}
      <div className="w-full yachiyo-warning-bar overflow-hidden my-3">
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <div className="flex items-center justify-center space-x-3 text-xs tracking-wider animate-pulse">
          <span className="text-amber-300">★</span>
          <span className="text-emerald-300">★</span>
          <span className="text-purple-300">★</span>
          <span>VIBE UI 2026 ARCHIVE IS NOW LIVE &bull; EXPLORE CODE EXPERIMENTS &bull; SUBMIT YOUR CREATIONS</span>
          <span className="text-purple-300">★</span>
          <span className="text-emerald-300">★</span>
          <span className="text-amber-300">★</span>
        </div>
      </div>

      {/* 7-Segment Visitor Counter Area */}
      <div className="flex flex-col items-center justify-center my-2 text-xs text-[#222]">
        <div className="flex items-center gap-2">
          <span>YOU ARE VISITOR NO.</span>
          <div className="yachiyo-counter-box">
            {visitorCount}
          </div>
          <span>!</span>
        </div>

        <div className="text-[11px] text-[#555] mt-1.5 flex items-center justify-center gap-2">
          <span>Milestone hits? Leave feedback via</span>
          <button
            onClick={handleClap}
            className="yachiyo-clap-btn"
          >
            👏 Web Clap ({claps})
          </button>
          <span>or on the BBS ☆</span>
        </div>

        {/* Clap popup feedback */}
        {showClapThanks && (
          <div className="mt-2 text-xs font-bold text-[#D26432] bg-white border border-[#D26432] px-3 py-1 rounded shadow animate-bounce">
            ＼ Thank you for clapping! It keeps the creators inspired! ☆ ／
          </div>
        )}
      </div>
    </div>
  );
}
