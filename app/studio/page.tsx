'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YachiyoSidebar from '@/components/YachiyoSidebar';
import IframeSandbox from '@/components/IframeSandbox';
import CodeEditor from '@/components/CodeEditor';
import { VibeCategory } from '@/types';
import { createVibeLocal, getActiveUser } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

const PRESET_TEMPLATES = [
  {
    name: 'Kinetic Kanji Poster',
    category: 'Typography' as VibeCategory,
    tags: ['Japanese', 'Kinetic', 'Typography'],
    description: 'Minimalist editorial poster with vertical typography and mouse tilt physics.',
    html: `<div class="poster">
  <div class="top-meta">ARCHIVE // 09</div>
  <div class="kanji-wrap">
    <div class="kanji">呼吸</div>
    <div class="en-sub">BREATHE // STILLNESS</div>
  </div>
  <div class="bottom-meta">TOKYO DESIGN SYSTEM</div>
</div>`,
    css: `body {
  background: #09090b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  font-family: monospace;
}
.poster {
  border: 1px solid rgba(255,255,255,0.15);
  padding: 32px;
  width: 300px;
  height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #111114;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  transition: transform 0.2s ease;
}
.poster:hover {
  transform: translateY(-4px);
  border-color: #f59e0b;
}
.top-meta, .bottom-meta {
  font-size: 10px;
  letter-spacing: 2px;
  color: #71717a;
}
.kanji {
  writing-mode: vertical-rl;
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 8px;
  color: #f59e0b;
  margin: 0 auto;
}
.en-sub {
  font-size: 9px;
  letter-spacing: 3px;
  color: #a1a1aa;
  text-align: center;
  margin-top: 14px;
}`,
    js: `console.log("Kinetic poster loaded.");`,
  },
  {
    name: 'Zen Pulse Button',
    category: 'Minimal' as VibeCategory,
    tags: ['Button', 'Micro-interaction', 'Zen'],
    description: 'Precision Japanese tactile button with ripple aura and tactile sound simulation.',
    html: `<div class="container">
  <button class="zen-btn" id="btn">
    <span class="btn-text">EXPLORE // 探索</span>
    <span class="aura"></span>
  </button>
  <div class="counter" id="count">ACTIONS: 0</div>
</div>`,
    css: `body {
  background: #09090b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  font-family: monospace;
}
.container { text-align: center; }
.zen-btn {
  position: relative;
  background: #000;
  border: 1px solid #333;
  color: #fafafa;
  padding: 14px 32px;
  font-size: 12px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}
.zen-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
}
.counter {
  margin-top: 20px;
  font-size: 10px;
  color: #666;
  letter-spacing: 1px;
}`,
    js: `let clicks = 0;
document.getElementById('btn').onclick = () => {
  clicks++;
  document.getElementById('count').innerText = 'ACTIONS: ' + clicks;
};`,
  },
  {
    name: 'Cyber Grid Radar',
    category: 'Cyberpunk' as VibeCategory,
    tags: ['Cyberpunk', 'Radar', 'Matrix'],
    description: 'Rotating radar scanner grid with neon green blips.',
    html: `<div class="radar">
  <div class="sweep"></div>
  <div class="blip" style="top:30%; left:40%;"></div>
  <div class="blip" style="top:60%; left:70%;"></div>
  <div class="coord">SECTOR // TOKYO-03</div>
</div>`,
    css: `body {
  background: #000;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-family: monospace;
}
.radar {
  width: 240px;
  height: 240px;
  border: 1px solid rgba(74, 222, 128, 0.4);
  border-radius: 50%;
  position: relative;
  background: radial-gradient(circle, rgba(74,222,128,0.05) 0%, #000 70%);
  overflow: hidden;
}
.sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, rgba(74,222,128,0.5) 0%, transparent 70%);
  transform-origin: top left;
  animation: sweep 4s linear infinite;
}
@keyframes sweep { 100% { transform: rotate(360deg); } }
.blip {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 8px #4ade80;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
.coord {
  position: absolute;
  bottom: 12px;
  width: 100%;
  text-align: center;
  font-size: 9px;
  color: #4ade80;
  letter-spacing: 2px;
}`,
    js: `console.log("Radar scanner activated.");`,
  },
];

export default function StudioPage() {
  const router = useRouter();
  const [title, setTitle] = useState('Untitled Kinetic Artifact');
  const [description, setDescription] = useState('An experimental web UI component written in HTML/CSS/JS.');
  const [category, setCategory] = useState<VibeCategory>('Typography');
  const [tagInput, setTagInput] = useState('Japanese, Minimal, Editorial');

  const [htmlCode, setHtmlCode] = useState(PRESET_TEMPLATES[0].html);
  const [cssCode, setCssCode] = useState(PRESET_TEMPLATES[0].css);
  const [jsCode, setJsCode] = useState(PRESET_TEMPLATES[0].js);

  const [studioTab, setStudioTab] = useState<'editor' | 'preview' | 'split'>('split');
  const [isPublishing, setIsPublishing] = useState(false);

  const handleTemplateSelect = (idx: number) => {
    const tmpl = PRESET_TEMPLATES[idx];
    setTitle(tmpl.name);
    setDescription(tmpl.description);
    setCategory(tmpl.category);
    setTagInput(tmpl.tags.join(', '));
    setHtmlCode(tmpl.html);
    setCssCode(tmpl.css);
    setJsCode(tmpl.js);
  };

  const handlePublish = () => {
    if (!title.trim() || !htmlCode.trim()) {
      alert('Please provide an artifact title and HTML code.');
      return;
    }

    setIsPublishing(true);
    const activeUser = getActiveUser();
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const created = createVibeLocal({
      user_id: activeUser.id,
      title: title.trim(),
      description: description.trim(),
      category,
      tags,
      html_code: htmlCode,
      css_code: cssCode,
      js_code: jsCode,
      is_featured: false,
      author: activeUser,
    });

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF7733', '#87D4DA', '#FFD700'],
    });

    setTimeout(() => {
      setIsPublishing(false);
      router.push(`/vibe/${created.id}`);
    }, 500);
  };

  return (
    <div className="yachiyo-container">
      <YachiyoSidebar />

      <main className="yachiyo-main-content space-y-4 text-xs">
        {/* Top Header Banner */}
        <div className="bg-[#E6F4F7] border-2 border-[#487A8A] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="font-bold text-sm text-[#224466]">
              ◆ VIBE STUDIO // Code Creation Workshop
            </div>
            <div className="text-[11px] text-[#555]">
              Edit HTML, CSS, and JS in real time and publish directly to the gallery ☆
            </div>
          </div>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-[#FF7733] hover:bg-[#ff8844] text-white font-bold px-4 py-1.5 border-2 border-[#D26432] shadow-sm self-start sm:self-auto cursor-pointer"
          >
            {isPublishing ? 'Publishing...' : '★ PUBLISH ARTIFACT'}
          </button>
        </div>

        {/* Starter Template Selection */}
        <div className="yachiyo-panel p-3 flex items-center flex-wrap gap-2 text-xs">
          <span className="font-bold text-[#333]">Load Starter Template:</span>
          {PRESET_TEMPLATES.map((t, idx) => (
            <button
              key={t.name}
              onClick={() => handleTemplateSelect(idx)}
              className="bg-white border border-[#487A8A] px-2 py-0.5 text-[#0000CD] hover:bg-[#E0F7FA] underline font-bold cursor-pointer"
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Metadata Inputs */}
        <div className="yachiyo-panel p-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-bold text-[#333] block mb-1">Artifact Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-[#808080] p-1.5 text-xs outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#333] block mb-1">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VibeCategory)}
              className="w-full bg-white border border-[#808080] p-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="Typography">Typography</option>
              <option value="Minimal">Minimal</option>
              <option value="Cyberpunk">Cyberpunk</option>
              <option value="Brutalist">Brutalist</option>
              <option value="Glassmorphism">Glassmorphism</option>
              <option value="Interactive">Interactive</option>
              <option value="Retro">Retro</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#333] block mb-1">Tags (comma-separated):</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full bg-white border border-[#808080] p-1.5 text-xs outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#333] block mb-1">Short Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-[#808080] p-1.5 text-xs outline-none"
            />
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 border-b border-[#487A8A] pb-1 text-[11px]">
          <button
            onClick={() => setStudioTab('split')}
            className={`px-3 py-0.5 border cursor-pointer ${
              studioTab === 'split'
                ? 'bg-[#487A8A] text-white border-[#487A8A] font-bold'
                : 'bg-white text-[#333] border-[#ccc]'
            }`}
          >
            SPLIT VIEW
          </button>
          <button
            onClick={() => setStudioTab('editor')}
            className={`px-3 py-0.5 border cursor-pointer ${
              studioTab === 'editor'
                ? 'bg-[#487A8A] text-white border-[#487A8A] font-bold'
                : 'bg-white text-[#333] border-[#ccc]'
            }`}
          >
            EDITOR ONLY
          </button>
          <button
            onClick={() => setStudioTab('preview')}
            className={`px-3 py-0.5 border cursor-pointer ${
              studioTab === 'preview'
                ? 'bg-[#487A8A] text-white border-[#487A8A] font-bold'
                : 'bg-white text-[#333] border-[#ccc]'
            }`}
          >
            PREVIEW ONLY
          </button>
        </div>

        {/* Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
          {(studioTab === 'split' || studioTab === 'editor') && (
            <div className={`h-[500px] border-2 border-[#808080] ${studioTab === 'editor' ? 'lg:col-span-2' : ''}`}>
              <CodeEditor
                html={htmlCode}
                css={cssCode}
                js={jsCode}
                readOnly={false}
                title={title}
                onCodeChange={(type, val) => {
                  if (type === 'html') setHtmlCode(val);
                  if (type === 'css') setCssCode(val);
                  if (type === 'js') setJsCode(val);
                }}
              />
            </div>
          )}

          {(studioTab === 'split' || studioTab === 'preview') && (
            <div
              className={`border-2 border-[#808080] bg-black h-[500px] flex flex-col shadow-inner ${
                studioTab === 'preview' ? 'lg:col-span-2' : ''
              }`}
            >
              <IframeSandbox
                html={htmlCode}
                css={cssCode}
                js={jsCode}
                viewportControls={true}
                className="w-full h-full"
                title="Live Sandbox"
              />
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}
