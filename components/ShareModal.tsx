'use client';

import React, { useState } from 'react';

interface ShareModalProps {
  vibeId: string;
  vibeTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({
  vibeId,
  vibeTitle,
  isOpen,
  onClose,
}: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vibeui.app';
  const pageUrl = `${origin}/vibe/${vibeId}`;
  const embedUrl = `${origin}/embed/${vibeId}`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="480" style="border:2px solid #487A8A;" allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone" sandbox="allow-scripts allow-same-origin"></iframe>`;

  const copyToClipboard = (text: string, isEmbed: boolean) => {
    navigator.clipboard.writeText(text);
    if (isEmbed) {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border-2 border-[#487A8A] shadow-xl text-xs text-[#222]">
        
        {/* Title Bar */}
        <div className="bg-[#224466] text-white px-3 py-1 flex items-center justify-between font-bold">
          <span>🔗 SHARE &amp; EMBED (VIBE UI)</span>
          <button
            onClick={onClose}
            className="hover:bg-red-600 px-1 font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <span className="font-bold text-[#D26432]">Selected Artifact:</span>
            <div className="text-sm font-bold text-[#0000CD] mt-0.5 truncate">
              {vibeTitle}
            </div>
          </div>

          {/* Direct Link */}
          <div className="space-y-1">
            <label className="font-bold text-[#333] block">Direct Page Link:</label>
            <div className="flex items-center space-x-1">
              <input
                type="text"
                readOnly
                value={pageUrl}
                className="flex-1 bg-[#F9F9F9] border border-[#808080] px-2 py-1 text-xs select-all outline-none"
              />
              <button
                onClick={() => copyToClipboard(pageUrl, false)}
                className="bg-[#E6F4F7] border border-[#487A8A] px-2.5 py-1 font-bold text-[#0000CD] hover:bg-[#d0f0f5] cursor-pointer"
              >
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Iframe Embed */}
          <div className="space-y-1">
            <label className="font-bold text-[#333] block">
              Iframe Embed Code (External Sites):
            </label>
            <textarea
              readOnly
              rows={3}
              value={iframeCode}
              className="w-full bg-[#F9F9F9] border border-[#808080] p-1.5 text-xs font-mono select-all outline-none"
            />
            <button
              onClick={() => copyToClipboard(iframeCode, true)}
              className="w-full bg-[#FF7733] hover:bg-[#ff8844] text-white font-bold py-1 border border-[#D26432] shadow-sm mt-1 cursor-pointer"
            >
              {copiedEmbed ? 'Embed Code Copied!' : 'Copy Iframe Code'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
