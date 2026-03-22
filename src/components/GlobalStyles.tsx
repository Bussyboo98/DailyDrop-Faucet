const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --gold: #F5C542;
      --gold-light: #FFE08A;
      --gold-dark: #C89B1A;
      --bg: #060912;
      --surface: #0D1120;
      --surface2: #141929;
      --accent: #3B6FFF;
      --accent2: #6C3BFF;
      --text: #E8EBF4;
      --muted: #6B7399;
    }

    body { background: var(--bg); }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-18px) rotate(1deg); }
      66% { transform: translateY(-8px) rotate(-1deg); }
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes counter-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(-360deg); }
    }
    @keyframes draw {
      from { stroke-dashoffset: 283; }
      to   { stroke-dashoffset: 70; }
    }
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(245,197,66,0.3), 0 0 60px rgba(245,197,66,0.1); }
      50% { box-shadow: 0 0 40px rgba(245,197,66,0.6), 0 0 100px rgba(245,197,66,0.2); }
    }

    .animate-float    { animation: float 6s ease-in-out infinite; }
    .animate-slide-up { animation: slide-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
    .animate-fade-in  { animation: fade-in 0.8s ease both; }
    .animate-shimmer  {
      background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 40%, var(--gold) 60%, var(--gold-dark) 100%);
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.35s; }
    .delay-4 { animation-delay: 0.5s; }
    .delay-5 { animation-delay: 0.65s; }

    .font-display { font-family: 'Syne', sans-serif; }
    .font-body    { font-family: 'DM Sans', sans-serif; }

    .btn-primary {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--gold);
      color: #060912;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.03em;
      padding: 14px 32px;
      border-radius: 100px;
      border: none;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: glow-pulse 3s ease-in-out infinite;
    }
    .btn-primary:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 8px 40px rgba(245,197,66,0.5);
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: transparent;
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 15px;
      padding: 14px 32px;
      border-radius: 100px;
      border: 1px solid rgba(255,255,255,0.15);
      cursor: pointer;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
    }
    .btn-secondary:hover {
      background: rgba(255,255,255,0.07);
      border-color: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }

    .stat-card {
      background: var(--surface);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 20px;
      padding: 28px 32px;
      transition: transform 0.2s, border-color 0.2s;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(245,197,66,0.05) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .stat-card:hover { transform: translateY(-4px); border-color: rgba(245,197,66,0.2); }
    .stat-card:hover::before { opacity: 1; }

    .feature-card {
      background: var(--surface);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 24px;
      padding: 36px 32px;
      transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
      position: relative;
      overflow: hidden;
    }
    .feature-card:hover {
      transform: translateY(-6px);
      border-color: rgba(59,111,255,0.3);
      box-shadow: 0 20px 60px rgba(59,111,255,0.1);
    }

    .ticker-wrap {
      overflow: hidden;
      border-top: 1px solid rgba(255,255,255,0.06);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      background: var(--surface);
    }
    .ticker-track {
      display: flex;
      width: max-content;
      animation: ticker 28s linear infinite;
    }
    .ticker-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 40px;
      white-space: nowrap;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      color: var(--muted);
      border-right: 1px solid rgba(255,255,255,0.06);
    }
    .ticker-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }

    .nav-link {
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: var(--muted);
      text-decoration: none;
      transition: color 0.2s;
      cursor: pointer;
    }
    .nav-link:hover { color: var(--text); }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(245,197,66,0.1);
      border: 1px solid rgba(245,197,66,0.25);
      border-radius: 100px;
      padding: 6px 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: var(--gold);
      letter-spacing: 0.05em;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }

    .progress-ring circle {
      transition: stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1);
    }
  `}</style>
);

export default GlobalStyles;