'use client';

import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Archive } from 'lucide-react';
import JSZip from 'jszip';

interface CodeEditorProps {
  html: string;
  css?: string;
  js?: string;
  readOnly?: boolean;
  onCodeChange?: (type: 'html' | 'css' | 'js', value: string) => void;
  title?: string;
}

export default function CodeEditor({
  html,
  css = '',
  js = '',
  readOnly = true,
  onCodeChange,
  title = 'vibe-component',
}: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html':
        return html;
      case 'css':
        return css;
      case 'js':
        return js;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - Vibe UI</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
<script>
${js}
</script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportZip = async () => {
    const zip = new JSZip();
    zip.file('index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${html}
  <script src="script.js"></script>
</body>
</html>`);
    zip.file('style.css', css || '/* Custom CSS */');
    zip.file('script.js', js || '// Custom JS');

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lines = getCurrentCode().split('\n');

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e] border border-white/[0.08] font-mono text-xs">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121214] border-b border-white/[0.08]">
        {/* Language Tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              activeTab === 'html'
                ? 'bg-white/10 text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              activeTab === 'css'
                ? 'bg-white/10 text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              activeTab === 'js'
                ? 'bg-white/10 text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            JS
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 rounded border border-white/[0.1] text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
            title="Copy current tab code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>

          <button
            onClick={handleDownloadSingleHtml}
            className="flex items-center space-x-1 px-2.5 py-1 rounded border border-white/[0.1] text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
            title="Download stand-alone HTML file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HTML</span>
          </button>

          <button
            onClick={handleExportZip}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20 transition-colors"
            title="Export project as ZIP bundle"
          >
            <Archive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ZIP</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-auto relative min-h-[300px]">
        {/* Line Numbers */}
        <div className="py-3 px-2 bg-[#09090b] text-neutral-600 select-none text-right border-r border-white/[0.06] font-mono text-[11px] leading-5 w-10 flex-shrink-0">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Content Area */}
        {readOnly ? (
          <pre className="p-3 text-neutral-200 overflow-x-auto flex-1 font-mono text-[11px] leading-5 whitespace-pre selection:bg-amber-400 selection:text-black">
            <code>{getCurrentCode()}</code>
          </pre>
        ) : (
          <textarea
            value={getCurrentCode()}
            onChange={(e) => onCodeChange && onCodeChange(activeTab, e.target.value)}
            spellCheck={false}
            className="w-full h-full p-3 bg-transparent text-neutral-200 font-mono text-[11px] leading-5 resize-none outline-none selection:bg-amber-400 selection:text-black"
          />
        )}
      </div>
    </div>
  );
}
