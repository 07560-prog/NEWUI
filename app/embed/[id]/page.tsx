'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { getLocalVibes } from '@/lib/storage';
import { Vibe } from '@/types';

function EmbedContent() {
  const params = useParams();
  const vibeId = params?.id as string;
  const [vibe, setVibe] = useState<Vibe | null>(null);

  useEffect(() => {
    if (!vibeId) return;
    const all = getLocalVibes();
    const found = all.find((v) => v.id === vibeId);
    if (found) setVibe(found);
  }, [vibeId]);

  if (!vibe) {
    return (
      <div className="h-screen w-screen bg-[#09090b] text-neutral-400 font-mono text-xs flex items-center justify-center">
        LOADING ARTIFACT...
      </div>
    );
  }

  const compiledHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #09090b;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    ${vibe.css_code}
  </style>
</head>
<body>
  ${vibe.html_code}
  <script>
    try {
      ${vibe.js_code}
    } catch (e) {
      console.error(e);
    }
  </script>
</body>
</html>`;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#09090b]">
      <iframe
        srcDoc={compiledHtml}
        title={vibe.title}
        sandbox="allow-scripts allow-modals allow-same-origin"
        className="w-full h-full border-0"
      />
      
      {/* Discreet watermark */}
      <a
        href={`/vibe/${vibe.id}`}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 text-[10px] font-mono text-neutral-400 hover:text-amber-400 rounded transition-colors select-none"
      >
        VIBE UI
      </a>
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#09090b] text-neutral-500 font-mono text-xs flex items-center justify-center">INITIALIZING SANDBOX...</div>}>
      <EmbedContent />
    </Suspense>
  );
}
