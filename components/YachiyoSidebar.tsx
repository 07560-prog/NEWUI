'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getActiveUser, setActiveUser } from '@/lib/storage';
import { MOCK_PROFILES } from '@/lib/mock-data';
import { Profile } from '@/types';

function SidebarNavLinks() {
  const pathname = usePathname();

  return (
    <ul className="yachiyo-menu-list">
      <li>
        <span className="yachiyo-menu-icon">◆</span>{' '}
        <Link href="/" className={pathname === '/' ? 'text-[#ff6600] font-black' : ''}>
          TOP (Home)
        </Link>
      </li>
      <li>
        <span className="yachiyo-menu-icon">◆</span>{' '}
        <Link href="/#gallery" className={pathname === '/#gallery' ? 'text-[#ff6600] font-black' : ''}>
          GALLERY (Artifacts)
        </Link>
      </li>
      <li>
        <span className="yachiyo-menu-icon">◆</span>{' '}
        <Link href="/studio" className={pathname === '/studio' ? 'text-[#ff6600] font-black' : ''}>
          STUDIO (Code Editor)
        </Link>{' '}
        <span className="yachiyo-new-tag">New!</span>
      </li>
      <li>
        <span className="yachiyo-menu-icon">◆</span>{' '}
        <Link href="/#bbs">
          BBS (Guestbook / Chat)
        </Link>
      </li>
      <li>
        <span className="yachiyo-menu-icon">◆</span>{' '}
        <Link href="/admin" className={pathname === '/admin' ? 'text-[#ff6600] font-black' : ''}>
          ADMIN (Webmaster)
        </Link>
      </li>
      <li>
        <span className="yachiyo-menu-icon">◆</span>{' '}
        <a href="#alliance">
          LINKS (Webring)
        </a>
      </li>
    </ul>
  );
}

function SidebarContent() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    setCurrentUser(getActiveUser());
  }, []);

  const handleSwitch = (p: Profile) => {
    setActiveUser(p);
    setCurrentUser(p);
    setUserDropdown(false);
  };

  return (
    <aside className="yachiyo-sidebar text-xs">
      {/* Menu Header */}
      <div className="yachiyo-menu-header">
        <span>VIBE UI</span><br />
        <span className="text-[11px] font-normal">- MENU -</span>
      </div>

      {/* Navigation List in Suspense */}
      <Suspense fallback={<div className="h-40" />}>
        <SidebarNavLinks />
      </Suspense>

      {/* User / Persona Switcher */}
      <div className="p-2 bg-white/70 border border-[#cc9966] text-[11px] relative">
        <div className="text-[10px] text-[#666] font-bold mb-1">
          CURRENT USER:
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#0000CD]">@{currentUser?.username || 'Guest'}</span>
          <span className="bg-[#cc9966]/20 text-[#D26432] px-1 text-[9px] uppercase font-bold">
            [{currentUser?.role}]
          </span>
        </div>
        <button
          onClick={() => setUserDropdown(!userDropdown)}
          className="mt-1 text-[10px] text-[#ff6600] underline block"
        >
          [Switch User / Role]
        </button>

        {userDropdown && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#cc9966] shadow-md z-30 p-1 space-y-1">
            {MOCK_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSwitch(p)}
                className="w-full text-left px-1.5 py-0.5 hover:bg-[#FDFAC8] text-[11px] flex justify-between"
              >
                <span>{p.username}</span>
                <span className="text-[#999]">({p.role})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Link Info & Direct Link Warning */}
      <div className="text-[11px] text-[#222] leading-tight border-t border-dotted border-[#cc9966] pt-2">
        <span>Linking is completely free!</span><br />
        <span>Link exchanges welcome ☆</span><br />
        <span className="text-[#666]">Please save banners before linking.</span><br />
        <strong className="text-rose-600 block mt-1">※ NO DIRECT LINKING ※</strong>
      </div>

      {/* 88x31 Banner Area */}
      <div className="text-center py-1">
        <div className="yachiyo-badge-88 mx-auto bg-gradient-to-r from-sky-600 to-indigo-700 text-white font-mono shadow">
          VIBE UI
        </div>
        <div className="text-[9px] text-[#777] mt-1">200x40 / 88x31</div>
      </div>

      {/* Language Switcher */}
      <div className="text-[11px] text-[#333] border-t border-dotted border-[#cc9966] pt-2 text-center">
        <span className="text-[#666] mr-1">Lang:</span>
        <span className="font-bold text-[#0000CD] cursor-pointer hover:underline">EN</span>
        <span className="mx-1 text-[#999]">|</span>
        <span className="font-bold text-[#0000CD] cursor-pointer hover:underline">JA</span>
        <span className="mx-1 text-[#999]">|</span>
        <span className="font-bold text-[#0000CD] cursor-pointer hover:underline">TH</span>
      </div>

      {/* Notice */}
      <div className="text-[10px] text-[#555] text-center leading-snug">
        VIBE UI // 2026<br />
        Artifact Repository
      </div>
    </aside>
  );
}

export default function YachiyoSidebar() {
  return (
    <Suspense fallback={<div className="w-[250px] bg-[#FDFAC8]" />}>
      <SidebarContent />
    </Suspense>
  );
}
