'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Vibe, ViewMode } from '@/types';
import IframeSandbox from './IframeSandbox';
import { toggleStarLocal } from '@/lib/storage';
import confetti from 'canvas-confetti';

interface VibeCardProps {
  vibe: Vibe;
  index: number;
  viewMode?: ViewMode;
  onStarUpdate?: (vibeId: string, newCount: number, hasStarred: boolean) => void;
}

export default function VibeCard({
  vibe,
  index,
  viewMode = 'grid',
  onStarUpdate,
}: VibeCardProps) {
  const [isStarred, setIsStarred] = useState(vibe.has_starred || false);
  const [starCount, setStarCount] = useState(vibe.star_count);

  const handleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = toggleStarLocal(vibe.id);
    setIsStarred(result.hasStarred);
    setStarCount(result.newCount);

    if (result.hasStarred) {
      try {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#FF7733', '#87D4DA', '#FFD700'],
        });
      } catch {
        // Safe fallback
      }
    }

    if (onStarUpdate) {
      onStarUpdate(vibe.id, result.newCount, result.hasStarred);
    }
  };

  const catalogNum = String(index + 1).padStart(2, '0');

  // LIST VIEW LAYOUT
  if (viewMode === 'list') {
    return (
      <div className="yachiyo-panel p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 min-w-0">
          <span className="font-bold text-[#D26432]">[{catalogNum}]</span>
          <div className="w-16 h-12 bg-black border border-[#808080] overflow-hidden flex-shrink-0">
            <IframeSandbox
              html={vibe.html_code}
              css={vibe.css_code}
              js={vibe.js_code}
              interactive={false}
              className="w-full h-full scale-50 origin-top-left pointer-events-none"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#E0F7FA] text-[#006064] border border-[#006064] px-1 text-[10px] font-bold">
                {vibe.category}
              </span>
              {vibe.is_featured && (
                <span className="text-[#e11d48] font-bold text-[10px]">★FEATURED★</span>
              )}
            </div>
            <Link
              href={`/vibe/${vibe.id}`}
              className="font-bold text-sm text-[#0000CD] hover:text-[#ff6600] underline truncate block mt-0.5"
            >
              {vibe.title}
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4 self-end md:self-center">
          <span className="text-[#e67e22] font-bold">★ {vibe.avg_rating.toFixed(1)}</span>
          <button
            onClick={handleStar}
            className={`px-2 py-0.5 border text-xs font-bold ${
              isStarred
                ? 'bg-[#FF7733] text-white border-[#D26432]'
                : 'bg-white text-[#333] border-[#808080] hover:bg-[#fff5ee]'
            }`}
          >
            ★ {starCount}
          </button>
          <Link
            href={`/vibe/${vibe.id}`}
            className="text-[#0000CD] hover:text-[#ff6600] underline font-bold"
          >
            [View Artifact]
          </Link>
        </div>
      </div>
    );
  }

  // GRID VIEW LAYOUT
  return (
    <div className="yachiyo-panel flex flex-col justify-between overflow-hidden">
      {/* Title Bar */}
      <div className="px-3 py-1.5 bg-[#E6F4F7] border-b-2 border-[#487A8A] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 font-bold">
          <span className="text-[#D26432]">No.{catalogNum}</span>
          <span className="text-[#487A8A]">|</span>
          <span className="text-[#006064] text-[10px] bg-white border border-[#006064] px-1">
            {vibe.category}
          </span>
        </div>
        {vibe.is_featured && (
          <span className="text-[#e11d48] font-bold text-[10px]">★FEATURED★</span>
        )}
      </div>

      {/* Title */}
      <div className="px-3 pt-2">
        <Link
          href={`/vibe/${vibe.id}`}
          className="text-sm font-bold text-[#0000CD] hover:text-[#ff6600] underline line-clamp-1 block"
        >
          {vibe.title}
        </Link>
        <p className="text-[11px] text-[#666] line-clamp-2 mt-0.5">
          {vibe.description}
        </p>
      </div>

      {/* Live Preview Monitor Frame */}
      <div className="m-3 bg-black border-2 border-[#808080] shadow-inner relative h-56 overflow-hidden">
        <IframeSandbox
          html={vibe.html_code}
          css={vibe.css_code}
          js={vibe.js_code}
          interactive={false}
          className="w-full h-full"
        />

        <Link
          href={`/vibe/${vibe.id}`}
          className="absolute inset-0 bg-black/40 hover:bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <span className="bg-white border-2 border-[#487A8A] px-3 py-1 text-xs font-bold text-[#0000CD] shadow">
            ▶ Preview &amp; Code
          </span>
        </Link>
      </div>

      {/* Bottom Info Bar */}
      <div className="px-3 py-2 bg-[#F9F9F9] border-t border-[#487A8A] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#555]">
          By: <strong className="text-[#222]">@{vibe.author?.username || 'anonymous'}</strong>
        </span>

        <div className="flex items-center space-x-2">
          <span className="text-[#e67e22] font-bold">★ {vibe.avg_rating.toFixed(1)}</span>
          <button
            onClick={handleStar}
            className={`px-2 py-0.5 border text-xs font-bold transition-transform active:scale-95 ${
              isStarred
                ? 'bg-[#FF7733] text-white border-[#D26432]'
                : 'bg-white text-[#333] border-[#808080] hover:bg-[#fff5ee]'
            }`}
          >
            ★ {starCount}
          </button>
        </div>
      </div>
    </div>
  );
}
