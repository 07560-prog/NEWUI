'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YachiyoSidebar from '@/components/YachiyoSidebar';
import IframeSandbox from '@/components/IframeSandbox';
import CodeEditor from '@/components/CodeEditor';
import CommentsSection from '@/components/CommentsSection';
import RatingModal from '@/components/RatingModal';
import ShareModal from '@/components/ShareModal';
import { getLocalVibes, getLocalComments, getActiveUser, toggleStarLocal } from '@/lib/storage';
import { Vibe, Comment, Profile } from '@/types';
import Link from 'next/link';
import confetti from 'canvas-confetti';

function VibeDetailContent() {
  const params = useParams();
  const vibeId = params?.id as string;

  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'code'>('split');
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [isStarred, setIsStarred] = useState(false);
  const [avgRating, setAvgRating] = useState(5.0);
  const [ratingCount, setRatingCount] = useState(1);

  useEffect(() => {
    if (!vibeId) return;
    const allVibes = getLocalVibes();
    const found = allVibes.find((v) => v.id === vibeId);
    if (found) {
      setVibe(found);
      setStarCount(found.star_count);
      setIsStarred(found.has_starred || false);
      setAvgRating(found.avg_rating);
      setRatingCount(found.rating_count || 1);
      setComments(getLocalComments(found.id));
    }
    setCurrentUser(getActiveUser());
  }, [vibeId]);

  if (!vibe) {
    return (
      <div className="p-12 text-center text-xs">
        <div className="font-bold text-red-600 mb-2">Artifact Not Found (404)</div>
        <Link href="/" className="text-[#0000CD] underline font-bold">
          ◀ Return to Home
        </Link>
      </div>
    );
  }

  const handleStarToggle = () => {
    const res = toggleStarLocal(vibe.id);
    setIsStarred(res.hasStarred);
    setStarCount(res.newCount);

    if (res.hasStarred) {
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#FF7733', '#87D4DA', '#FFD700'],
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleRatingSubmit = (newAvg: number, newCount: number) => {
    setAvgRating(newAvg);
    setRatingCount(newCount);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between bg-[#E6F4F7] border-2 border-[#487A8A] px-3 py-1.5 font-bold">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-[#0000CD] underline">
            Home
          </Link>
          <span>&gt;</span>
          <Link href="/#gallery" className="text-[#0000CD] underline">
            Gallery
          </Link>
          <span>&gt;</span>
          <span className="text-[#D26432]">{vibe.title}</span>
        </div>
        <span className="bg-white border border-[#487A8A] px-1 text-[10px]">
          Category: {vibe.category}
        </span>
      </div>

      {/* Main Showcase Panel */}
      <div className="yachiyo-panel p-4 space-y-4">
        {/* Title & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-dotted border-[#487A8A] gap-2">
          <div>
            <h1 className="text-xl font-bold text-[#224466]">
              {vibe.title}
            </h1>
            <p className="text-[11px] text-[#555] mt-0.5">
              Creator: <strong className="text-[#0000CD]">@{vibe.author?.username}</strong> &bull; Published: {new Date(vibe.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="bg-white border-2 border-[#e67e22] text-[#e67e22] px-2.5 py-1 font-bold hover:bg-[#fff9f0] shadow-sm cursor-pointer"
            >
              ★ Rate ({avgRating.toFixed(1)} / 5.0)
            </button>

            <button
              onClick={handleStarToggle}
              className={`px-3 py-1 font-bold border-2 transition-transform active:scale-95 cursor-pointer ${
                isStarred
                  ? 'bg-[#FF7733] text-white border-[#D26432]'
                  : 'bg-white text-[#333] border-[#808080] hover:bg-[#fff5ee]'
              }`}
            >
              ★ Star ({starCount})
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="bg-[#0000CD] text-white px-2.5 py-1 font-bold border border-[#00008B] hover:bg-blue-800 cursor-pointer"
            >
              Share / Embed
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="p-2.5 bg-[#F9F9F9] border border-[#ccc] text-[#333] leading-relaxed">
          {vibe.description}
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center justify-between border-b border-[#487A8A] pb-1 text-[11px]">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-0.5 border ${
                viewMode === 'split'
                  ? 'bg-[#487A8A] text-white border-[#487A8A] font-bold'
                  : 'bg-white text-[#333] border-[#ccc]'
              }`}
            >
              SPLIT VIEW
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-0.5 border ${
                viewMode === 'preview'
                  ? 'bg-[#487A8A] text-white border-[#487A8A] font-bold'
                  : 'bg-white text-[#333] border-[#ccc]'
              }`}
            >
              PREVIEW ONLY
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-0.5 border ${
                viewMode === 'code'
                  ? 'bg-[#487A8A] text-white border-[#487A8A] font-bold'
                  : 'bg-white text-[#333] border-[#ccc]'
              }`}
            >
              CODE ONLY
            </button>
          </div>

          <span className="text-[#666]">
            Running safely inside an isolated iframe sandbox
          </span>
        </div>

        {/* Preview & Editor Window */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={`border-2 border-[#808080] bg-black h-[500px] shadow-inner flex flex-col ${
                viewMode === 'preview' ? 'lg:col-span-2' : ''
              }`}
            >
              <IframeSandbox
                html={vibe.html_code}
                css={vibe.css_code}
                js={vibe.js_code}
                viewportControls={true}
                className="w-full h-full"
                title={vibe.title}
              />
            </div>
          )}

          {(viewMode === 'split' || viewMode === 'code') && (
            <div className={`h-[500px] border-2 border-[#808080] ${viewMode === 'code' ? 'lg:col-span-2' : ''}`}>
              <CodeEditor
                html={vibe.html_code}
                css={vibe.css_code}
                js={vibe.js_code}
                readOnly={true}
                title={vibe.title}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 pt-2">
          <span className="font-bold text-[#555]">Tags:</span>
          {vibe.tags.map((t) => (
            <span
              key={t}
              className="bg-white border border-[#487A8A] px-1.5 py-0.5 text-[10px] text-[#0000CD]"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Discussion / BBS Section */}
      <section id="bbs" className="yachiyo-panel p-4">
        <CommentsSection
          vibeId={vibe.id}
          initialComments={comments}
          currentUser={currentUser}
        />
      </section>

      {/* Modals */}
      <RatingModal
        vibeId={vibe.id}
        vibeTitle={vibe.title}
        currentAvg={avgRating}
        ratingCount={ratingCount}
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onRated={handleRatingSubmit}
      />

      <ShareModal
        vibeId={vibe.id}
        vibeTitle={vibe.title}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}

export default function VibeDetailPage() {
  return (
    <div className="yachiyo-container">
      <YachiyoSidebar />
      <main className="yachiyo-main-content">
        <Suspense fallback={<div className="p-8 text-center text-xs">Loading artifact...</div>}>
          <VibeDetailContent />
        </Suspense>
        <Footer />
      </main>
    </div>
  );
}
