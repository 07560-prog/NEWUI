import { Vibe, Profile, Comment } from '@/types';

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'user_yachiyo_admin',
    username: 'kenzo.tanaka',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Interface Architect & Minimalist Typographer. Tokyo / Kyoto.',
    role: 'admin',
    is_banned: false,
    created_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'user_rei_yamamoto',
    username: 'rei_creative',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Generative CSS poet & dark aesthetic experimenter.',
    role: 'user',
    is_banned: false,
    created_at: '2026-02-01T14:30:00Z',
  },
  {
    id: 'user_satoshi_lab',
    username: 'satoshi_k',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Exploring neo-brutalist layouts and interactive canvas physics.',
    role: 'moderator',
    is_banned: false,
    created_at: '2026-02-12T11:20:00Z',
  },
];

export const MOCK_VIBES: Vibe[] = [
  {
    id: 'vibe-01-tokyo-kinetic',
    user_id: 'user_yachiyo_admin',
    title: 'Tokyo Kinetic Typography',
    description: 'Minimalist editorial vertical typography with interactive mouse-follow tilt distortion, micro-grid coordinates, and stark aesthetics.',
    category: 'Typography',
    tags: ['Japanese', 'Typography', 'Kinetic', 'Editorial'],
    star_count: 142,
    avg_rating: 4.9,
    rating_count: 28,
    is_featured: true,
    views_count: 1820,
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
    author: MOCK_PROFILES[0],
    html_code: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #09090b;
      color: #fafafa;
      font-family: 'Courier New', monospace, sans-serif;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .poster {
      position: relative;
      width: 90%;
      max-width: 520px;
      height: 80vh;
      max-height: 680px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: radial-gradient(circle at 50% 50%, #151518 0%, #09090b 100%);
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      transition: transform 0.2s ease-out;
    }
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      letter-spacing: 2px;
      color: #71717a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }
    .center-art {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;
    }
    .kanji-vert {
      writing-mode: vertical-rl;
      font-size: 56px;
      font-weight: 900;
      letter-spacing: 12px;
      color: #f4f4f5;
      text-shadow: 0 0 20px rgba(255,255,255,0.2);
      transition: transform 0.3s ease;
      cursor: pointer;
    }
    .kanji-vert:hover {
      color: #f59e0b;
      transform: scale(1.04) translateY(-4px);
    }
    .circle-accent {
      width: 140px;
      height: 140px;
      border: 1px dashed rgba(245, 158, 11, 0.4);
      border-radius: 50%;
      position: absolute;
      animation: spin 30s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 10px;
      color: #a1a1aa;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 14px;
    }
    .badge {
      background: #f59e0b;
      color: #000;
      padding: 3px 8px;
      font-weight: bold;
      font-size: 9px;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="poster" id="card">
    <div class="grid-lines"></div>
    <div class="header-bar">
      <span>TOKYO // ARCHIVE</span>
      <span>VOL.08 - 2026</span>
      <span>[35.6762° N]</span>
    </div>
    
    <div class="center-art">
      <div class="circle-accent"></div>
      <div class="kanji-vert">静寂</div>
      <div class="kanji-vert" style="color: #a1a1aa;">美学</div>
    </div>

    <div class="footer-bar">
      <div>
        <p style="letter-spacing: 1px;">KINETIC EDITORIAL</p>
        <p style="color: #52525b; margin-top: 2px;">INTERACTION: TILT MOUSE</p>
      </div>
      <span class="badge">VIBE.SYS</span>
    </div>
  </div>

  <script>
    const card = document.getElementById('card');
    document.addEventListener('mousemove', (e) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      card.style.transform = \`rotateY(\${xAxis}deg) rotateX(\${-yAxis}deg)\`;
    });
  </script>
</body>
</html>`,
    css_code: `/* Embedded in HTML for self-contained execution */`,
    js_code: `/* Embedded in HTML */`,
  },
  {
    id: 'vibe-02-zen-clock',
    user_id: 'user_yachiyo_admin',
    title: 'Zen Harmonic Chrono Dial',
    description: 'Precision analog chrono dial with smooth second pulses, ambient coordinates, and tactile tick indicators.',
    category: 'Minimal',
    tags: ['Minimal', 'Clock', 'Japanese', 'BlackAndWhite'],
    star_count: 118,
    avg_rating: 4.8,
    rating_count: 22,
    is_featured: true,
    views_count: 1490,
    created_at: '2026-02-14T12:00:00Z',
    updated_at: '2026-02-14T12:00:00Z',
    author: MOCK_PROFILES[0],
    html_code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing: border-box; }
    body {
      background: #000;
      color: #eee;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
    }
    .clock-container {
      position: relative;
      width: 280px;
      height: 280px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 60px rgba(255, 255, 255, 0.02);
    }
    .dial-mark {
      position: absolute;
      width: 2px;
      height: 10px;
      background: #3f3f46;
    }
    .dial-mark.major {
      height: 16px;
      background: #fafafa;
      width: 2px;
    }
    .hand {
      position: absolute;
      bottom: 50%;
      left: 50%;
      transform-origin: bottom center;
      border-radius: 2px;
    }
    .hour-hand { width: 3px; height: 60px; background: #fafafa; }
    .min-hand { width: 2px; height: 90px; background: #a1a1aa; }
    .sec-hand { width: 1px; height: 105px; background: #f59e0b; }
    .center-pin {
      width: 8px;
      height: 8px;
      background: #f59e0b;
      border-radius: 50%;
      z-index: 10;
    }
    .digital-readout {
      margin-top: 30px;
      font-size: 13px;
      letter-spacing: 4px;
      color: #71717a;
      font-family: monospace;
    }
    .location-tag {
      font-size: 10px;
      color: #52525b;
      letter-spacing: 2px;
      margin-top: 6px;
    }
  </style>
</head>
<body>
  <div class="clock-container" id="clock">
    <div class="center-pin"></div>
    <div class="hand hour-hand" id="hour"></div>
    <div class="hand min-hand" id="min"></div>
    <div class="hand sec-hand" id="sec"></div>
  </div>
  <div class="digital-readout" id="digital">00:00:00 JST</div>
  <div class="location-tag">KYOTO // 135°46' E</div>

  <script>
    const clock = document.getElementById('clock');
    for (let i = 0; i < 12; i++) {
      const mark = document.createElement('div');
      mark.className = 'dial-mark' + (i % 3 === 0 ? ' major' : '');
      const angle = i * 30;
      mark.style.transform = \`rotate(\${angle}deg) translateY(-126px)\`;
      clock.appendChild(mark);
    }
    function updateClock() {
      const now = new Date();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const h = now.getHours();
      
      const sDeg = s * 6;
      const mDeg = m * 6 + s * 0.1;
      const hDeg = (h % 12) * 30 + m * 0.5;

      document.getElementById('sec').style.transform = \`translateX(-50%) rotate(\${sDeg}deg)\`;
      document.getElementById('min').style.transform = \`translateX(-50%) rotate(\${mDeg}deg)\`;
      document.getElementById('hour').style.transform = \`translateX(-50%) rotate(\${hDeg}deg)\`;
      
      document.getElementById('digital').innerText = 
        String(h).padStart(2,'0') + ':' + 
        String(m).padStart(2,'0') + ':' + 
        String(s).padStart(2,'0') + ' JST';
    }
    setInterval(updateClock, 1000);
    updateClock();
  </script>
</body>
</html>`,
    css_code: `/* Self-contained */`,
    js_code: `/* Self-contained */`,
  },
  {
    id: 'vibe-03-shibuya-hud',
    user_id: 'user_rei_yamamoto',
    title: 'Cyberpunk Telemetry HUD',
    description: 'Futuristic telemetry scanner HUD with real-time waveform canvas, electric cyan accents, and glitching coordinate indicators.',
    category: 'Cyberpunk',
    tags: ['Cyberpunk', 'Canvas', 'AudioHUD', 'Future'],
    star_count: 204,
    avg_rating: 4.95,
    rating_count: 45,
    is_featured: true,
    views_count: 3120,
    created_at: '2026-02-18T18:00:00Z',
    updated_at: '2026-02-18T18:00:00Z',
    author: MOCK_PROFILES[1],
    html_code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing: border-box; }
    body {
      background: #050508;
      color: #06b6d4;
      font-family: 'Consolas', 'Courier New', monospace;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .hud-box {
      width: 90%;
      max-width: 500px;
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 24px;
      background: rgba(6, 182, 212, 0.02);
      position: relative;
      box-shadow: 0 0 30px rgba(6, 182, 212, 0.1);
    }
    .hud-box::before {
      content: "SYS.VER // 9.84B";
      position: absolute;
      top: -10px;
      left: 20px;
      background: #050508;
      padding: 0 8px;
      font-size: 10px;
      color: #06b6d4;
    }
    .hud-top {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      margin-bottom: 16px;
      border-bottom: 1px dashed rgba(6, 182, 212, 0.2);
      padding-bottom: 8px;
    }
    canvas {
      width: 100%;
      height: 120px;
      background: rgba(0,0,0,0.5);
      border: 1px solid rgba(6, 182, 212, 0.2);
      display: block;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 16px;
    }
    .stat-cell {
      border: 1px solid rgba(6, 182, 212, 0.15);
      padding: 8px;
      text-align: center;
    }
    .stat-title { font-size: 9px; color: #67e8f9; opacity: 0.7; }
    .stat-val { font-size: 16px; font-weight: bold; margin-top: 4px; color: #fff; }
  </style>
</head>
<body>
  <div class="hud-box">
    <div class="hud-top">
      <span>SHIBUYA_NODE // 07</span>
      <span id="ping">LATENCY: 12ms</span>
    </div>
    <canvas id="waveCanvas" width="450" height="120"></canvas>
    <div class="stats-row">
      <div class="stat-cell">
        <div class="stat-title">FREQUENCY</div>
        <div class="stat-val" id="freq">432.8 Hz</div>
      </div>
      <div class="stat-cell">
        <div class="stat-title">BANDWIDTH</div>
        <div class="stat-val">10.4 GB/s</div>
      </div>
      <div class="stat-cell">
        <div class="stat-title">INTEGRITY</div>
        <div class="stat-val" style="color: #4ade80;">99.8%</div>
      </div>
    </div>
  </div>

  <script>
    const cvs = document.getElementById('waveCanvas');
    const ctx = cvs.getContext('2d');
    let offset = 0;

    function drawWave() {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;

      for (let x = 0; x < cvs.width; x++) {
        const y = cvs.height / 2 + 
          Math.sin((x + offset) * 0.05) * 25 * Math.sin(offset * 0.02) +
          Math.cos((x * 0.02) + offset * 0.03) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      offset += 2;
      requestAnimationFrame(drawWave);
    }
    drawWave();
  </script>
</body>
</html>`,
    css_code: `/* Self-contained */`,
    js_code: `/* Self-contained */`,
  },
  {
    id: 'vibe-04-wabi-sabi-card',
    user_id: 'user_satoshi_lab',
    title: 'Wabi-Sabi Ceramic Artifact',
    description: 'Raw tactile neo-brutalist interaction with ceramic grain textures, harsh 1px borders, stamp badges, and brutal typography.',
    category: 'Brutalist',
    tags: ['Brutalist', 'Japanese', 'Ceramic', 'Editorial'],
    star_count: 89,
    avg_rating: 4.7,
    rating_count: 19,
    is_featured: false,
    views_count: 980,
    created_at: '2026-02-20T08:00:00Z',
    updated_at: '2026-02-20T08:00:00Z',
    author: MOCK_PROFILES[2],
    html_code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing: border-box; }
    body {
      background: #121212;
      color: #e5e5e5;
      font-family: 'Times New Roman', serif;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wabi-card {
      width: 320px;
      background: #1a1a1a;
      border: 1px solid #333;
      padding: 24px;
      box-shadow: 8px 8px 0px #f59e0b;
      position: relative;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .wabi-card:hover {
      transform: translate(-3px, -3px);
      box-shadow: 12px 12px 0px #f59e0b;
    }
    .stamp {
      position: absolute;
      top: 20px;
      right: 20px;
      border: 1px solid #f59e0b;
      color: #f59e0b;
      padding: 2px 6px;
      font-size: 10px;
      font-family: monospace;
      letter-spacing: 2px;
      transform: rotate(4deg);
    }
    h1 {
      font-size: 26px;
      font-weight: 300;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    p {
      font-size: 13px;
      line-height: 1.6;
      color: #999;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .divider {
      height: 1px;
      background: #333;
      margin: 18px 0;
    }
    .footer-mono {
      font-family: monospace;
      font-size: 11px;
      color: #666;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="wabi-card">
    <div class="stamp">特級 // 01</div>
    <h1>不完全の美</h1>
    <p>Finding serenity within the irregular, asymmetric, and rustic textures of impermanence.</p>
    <div class="divider"></div>
    <div class="footer-mono">
      <span>REF: ARTIFACT-88</span>
      <span>PRICE: ¥0.00</span>
    </div>
  </div>
</body>
</html>`,
    css_code: `/* Self-contained */`,
    js_code: `/* Self-contained */`,
  },
  {
    id: 'vibe-05-glass-music',
    user_id: 'user_rei_yamamoto',
    title: 'Ambient Frosted Disc Player',
    description: 'Multi-layered frosted glass audio player with rotating lacquer disc, tactile progress tracker, and ambient sound aesthetic.',
    category: 'Glassmorphism',
    tags: ['Glassmorphism', 'Music', 'Blur', 'Minimal'],
    star_count: 176,
    avg_rating: 4.88,
    rating_count: 36,
    is_featured: true,
    views_count: 2410,
    created_at: '2026-02-22T15:00:00Z',
    updated_at: '2026-02-22T15:00:00Z',
    author: MOCK_PROFILES[1],
    html_code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing: border-box; }
    body {
      background: radial-gradient(circle at 30% 30%, #1f1b2e 0%, #09090d 100%);
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #fff;
    }
    .player-card {
      width: 320px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 30px 60px rgba(0,0,0,0.5);
    }
    .vinyl-box {
      width: 140px;
      height: 140px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background: repeating-radial-gradient(
        #111,
        #111 2px,
        #222 3px,
        #111 4px
      );
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      animation: spinDisc 8s linear infinite;
      animation-play-state: running;
      border: 2px solid rgba(255,255,255,0.05);
    }
    @keyframes spinDisc { 100% { transform: rotate(360deg); } }
    .vinyl-center {
      width: 44px;
      height: 44px;
      background: #f59e0b;
      border-radius: 50%;
      border: 3px solid #111;
    }
    .track-title { font-size: 16px; font-weight: 600; letter-spacing: 0.5px; }
    .artist-name { font-size: 12px; color: #a1a1aa; margin-top: 4px; }
    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      margin: 20px 0 16px;
      position: relative;
      cursor: pointer;
    }
    .progress-fill {
      width: 45%;
      height: 100%;
      background: #f59e0b;
      border-radius: 2px;
    }
    .btn-play {
      background: #fff;
      color: #000;
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.1s;
    }
    .btn-play:hover { transform: scale(1.08); }
  </style>
</head>
<body>
  <div class="player-card">
    <div class="vinyl-box" id="disc">
      <div class="vinyl-center"></div>
    </div>
    <div class="track-title">KYOTO RAIN // 嵐山の雨</div>
    <div class="artist-name">AMBIENT ENSEMBLE</div>
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>
    <button class="btn-play" id="playBtn">❚❚</button>
  </div>

  <script>
    const disc = document.getElementById('disc');
    const btn = document.getElementById('playBtn');
    let isPlaying = true;
    btn.onclick = () => {
      isPlaying = !isPlaying;
      disc.style.animationPlayState = isPlaying ? 'running' : 'paused';
      btn.innerText = isPlaying ? '❚❚' : '▶';
    };
  </script>
</body>
</html>`,
    css_code: `/* Self-contained */`,
    js_code: `/* Self-contained */`,
  },
  {
    id: 'vibe-06-water-ripple',
    user_id: 'user_satoshi_lab',
    title: 'Harmonic Fluid Wave Ripple',
    description: 'Generative liquid wave ripple physics simulated with Canvas 2D. Interactive click and drag generates harmonic fluid waves.',
    category: 'Interactive',
    tags: ['Canvas', 'Interactive', 'Zen', 'Generative'],
    star_count: 230,
    avg_rating: 4.98,
    rating_count: 52,
    is_featured: true,
    views_count: 4200,
    created_at: '2026-02-25T14:00:00Z',
    updated_at: '2026-02-25T14:00:00Z',
    author: MOCK_PROFILES[2],
    html_code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing: border-box; }
    body {
      background: #09090b;
      overflow: hidden;
      cursor: crosshair;
    }
    canvas { display: block; }
    .hint {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.4);
      font-family: monospace;
      font-size: 11px;
      letter-spacing: 2px;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <div class="hint">CLICK OR DRAG TO CAST RIPPLES (波紋)</div>

  <script>
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    let w, h;
    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    }
    window.onresize = resize;
    resize();

    const ripples = [];
    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.opacity = 1;
        this.speed = 2.4;
      }
      update() {
        this.radius += this.speed;
        this.opacity -= 0.015;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = \`rgba(245, 158, 11, \${Math.max(0, this.opacity)})\`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = \`rgba(255, 255, 255, \${Math.max(0, this.opacity * 0.5)})\`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    function addRipple(x, y) {
      ripples.push(new Ripple(x, y));
    }

    window.addEventListener('pointerdown', (e) => addRipple(e.clientX, e.clientY));
    window.addEventListener('pointermove', (e) => {
      if (e.buttons === 1) addRipple(e.clientX, e.clientY);
    });

    // Initial ambient ripple
    addRipple(w / 2, h / 2);

    function animate() {
      ctx.fillStyle = 'rgba(9, 9, 11, 0.15)';
      ctx.fillRect(0, 0, w, h);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.update();
        r.draw();
        if (r.opacity <= 0) ripples.splice(i, 1);
      }
      requestAnimationFrame(animate);
    }
    animate();
  </script>
</body>
</html>`,
    css_code: `/* Self-contained */`,
    js_code: `/* Self-contained */`,
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comm-01',
    vibe_id: 'vibe-01-tokyo-kinetic',
    user_id: 'user_rei_yamamoto',
    content: 'The perspective mouse tilt calculation is buttery smooth! Love the vertical Japanese typesetting.',
    created_at: '2026-02-11T09:12:00Z',
    author: MOCK_PROFILES[1],
  },
  {
    id: 'comm-02',
    vibe_id: 'vibe-01-tokyo-kinetic',
    user_id: 'user_satoshi_lab',
    content: 'Exported this directly for a design studio landing page. Minimalist perfection.',
    created_at: '2026-02-12T16:40:00Z',
    author: MOCK_PROFILES[2],
  },
  {
    id: 'comm-03',
    vibe_id: 'vibe-03-shibuya-hud',
    user_id: 'user_yachiyo_admin',
    content: 'The sine wave offset math looks like an actual oscillograph from an anime telemetry console.',
    created_at: '2026-02-19T20:00:00Z',
    author: MOCK_PROFILES[0],
  },
];
