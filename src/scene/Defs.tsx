export function Defs() {
  return (
    <defs>
      <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8ea5b7" />
        <stop offset="0.6" stopColor="#c6d0d7" />
        <stop offset="1" stopColor="#dfded7" />
      </linearGradient>
      <linearGradient id="g-soil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6c5843" />
        <stop offset="1" stopColor="#4a3d2f" />
      </linearGradient>
      <pattern id="p-soil" width="80" height="50" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="12" r="2.2" fill="#857055" />
        <circle cx="46" cy="30" r="1.6" fill="#3e3226" />
        <circle cx="64" cy="8" r="1.2" fill="#9a8466" />
        <ellipse cx="28" cy="42" rx="3" ry="1.6" fill="#5e4c39" />
        <circle cx="72" cy="40" r="1" fill="#a08b6c" />
        <circle cx="38" cy="6" r="0.8" fill="#2f271e" />
      </pattern>
      <pattern id="p-concrete" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="7" r="0.7" fill="#000" opacity="0.16" />
        <circle cx="23" cy="15" r="0.5" fill="#000" opacity="0.2" />
        <circle cx="33" cy="31" r="0.8" fill="#fff" opacity="0.18" />
        <circle cx="12" cy="27" r="0.4" fill="#000" opacity="0.22" />
        <circle cx="30" cy="4" r="0.5" fill="#fff" opacity="0.2" />
        <circle cx="17" cy="36" r="0.6" fill="#000" opacity="0.12" />
      </pattern>
      <pattern id="p-lagging" width="56" height="9" patternUnits="userSpaceOnUse">
        <rect width="56" height="9" fill="#7a5d3f" />
        <path d="M0 8.5H56" stroke="#4d3a27" strokeWidth="1" />
        <path d="M4 3 Q20 2 36 4 T56 3" stroke="#6a4f35" strokeWidth="0.6" fill="none" />
        <rect x="0" y="0" width="6" height="9" fill="#46484a" />
      </pattern>
      <pattern id="p-ply" width="60" height="8" patternUnits="userSpaceOnUse">
        <rect width="60" height="8" fill="#b7773e" />
        <path d="M0 2 Q15 1 30 2.5 T60 2 M0 6 Q20 5 40 6.5 T60 6" stroke="#9a5f2c" strokeWidth="0.6" fill="none" />
      </pattern>
      <pattern id="p-mesh" width="3" height="3" patternUnits="userSpaceOnUse">
        <path d="M0 0H3M0 0V3" stroke="#2f3a2e" strokeWidth="0.5" opacity="0.7" />
      </pattern>
      <linearGradient id="g-metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b5b9bc" />
        <stop offset="0.35" stopColor="#eceff0" />
        <stop offset="1" stopColor="#8b9094" />
      </linearGradient>
      <linearGradient id="g-metal-x" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8b9094" />
        <stop offset="0.4" stopColor="#e6e9ea" />
        <stop offset="1" stopColor="#9a9fa3" />
      </linearGradient>
      <linearGradient id="g-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9db4c2" />
        <stop offset="0.5" stopColor="#5f7c8f" />
        <stop offset="1" stopColor="#7f99a9" />
      </linearGradient>
      <linearGradient id="g-shade-x" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.3" />
        <stop offset="0.45" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id="g-shade-y" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
        <stop offset="1" stopColor="#000" stopOpacity="0.22" />
      </linearGradient>
      <radialGradient id="g-light" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="#fffbe8" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fffbe8" stopOpacity="0" />
      </radialGradient>
      <filter id="f-glow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="1.4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}
