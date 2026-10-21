'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RotateCw, Maximize2, Monitor, Tablet, Smartphone } from 'lucide-react';

interface IframeSandboxProps {
  html: string;
  css?: string;
  js?: string;
  className?: string;
  title?: string;
  interactive?: boolean;
  viewportControls?: boolean;
  scale?: number;
}

export default function IframeSandbox({
  html,
  css = '',
  js = '',
  className = '',
  title = 'UI Preview',
  interactive = true,
  viewportControls = false,
  scale = 1,
}: IframeSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [key, setKey] = useState(0);

  // Construct complete HTML document
  const compiledSrcDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset & dark canvas defaults */
    html, body {
      margin: 0;
      padding: 0;
      background: #09090b;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow-x: hidden;
      min-height: 100vh;
    }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch(err) {
      console.error("Vibe execution error:", err);
    }
  </script>
</body>
</html>
  `;

  const reloadIframe = () => {
    setKey((prev) => prev + 1);
  };

  const getViewportWidth = () => {
    if (!viewportControls) return '100%';
    switch (deviceMode) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  return (
    <div className={`relative flex flex-col items-center w-full h-full ${className}`}>
      {/* Viewport Control Bar if enabled */}
      {viewportControls && (
        <div className="w-full flex items-center justify-between px-4 py-2 bg-[#121214] border-b border-white/[0.08] text-xs font-mono text-neutral-400">
          <div className="flex items-center space-x-1 bg-black/40 p-0.5 rounded border border-white/[0.06]">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded transition-colors ${
                deviceMode === 'desktop' ? 'bg-white/10 text-white' : 'hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded transition-colors ${
                deviceMode === 'tablet' ? 'bg-white/10 text-white' : 'hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded transition-colors ${
                deviceMode === 'mobile' ? 'bg-white/10 text-white' : 'hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[11px] text-neutral-500 font-mono">
            {deviceMode === 'desktop' ? 'DESKTOP: 100%' : deviceMode === 'tablet' ? 'TABLET: 768px' : 'MOBILE: 375px'}
          </div>

          <button
            onClick={reloadIframe}
            className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            title="Reload Sandbox"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sandboxed iframe container */}
      <div
        className="w-full h-full flex items-center justify-center transition-all duration-300 overflow-hidden relative"
        style={{
          width: getViewportWidth(),
          maxWidth: '100%',
        }}
      >
        <iframe
          key={key}
          ref={iframeRef}
          srcDoc={compiledSrcDoc}
          title={title}
          sandbox="allow-scripts allow-modals allow-same-origin"
          className={`w-full h-full border-0 bg-[#09090b] ${
            !interactive ? 'pointer-events-none select-none' : ''
          }`}
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top left',
          }}
          loading="lazy"
        />
      </div>
    </div>
  );
}
