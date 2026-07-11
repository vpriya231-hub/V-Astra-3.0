import React from "react";

interface VTransLogoProps {
  className?: string;
}

export default function VTransLogo({ className = "w-6 h-6" }: VTransLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-105`}
      id="v-trans-svg-logo"
    >
      <defs>
        <linearGradient id="vTransOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff781e" />
          <stop offset="50%" stopColor="#ff5a00" />
          <stop offset="100%" stopColor="#e03e00" />
        </linearGradient>
        <filter id="vTransGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#ff5a00" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Top Curved Arrow */}
      <path
        d="M 28 20 A 34 34 0 0 1 72 20"
        stroke="url(#vTransOrangeGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 65 21 L 72 20 L 70 13"
        stroke="url(#vTransOrangeGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom Curved Arrow */}
      <path
        d="M 72 80 A 34 34 0 0 1 28 80"
        stroke="url(#vTransOrangeGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 35 79 L 28 80 L 30 87"
        stroke="url(#vTransOrangeGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left Speech Bubble with 'A' */}
      <path
        d="M 36 32 C 24 32 16 39 16 48 C 16 52 18 56 22 59 L 20 66 L 28 62 C 30 63 33 64 36 64 C 48 64 56 57 56 48 C 56 39 48 32 36 32 Z"
        fill="white"
        stroke="url(#vTransOrangeGrad)"
        strokeWidth="3"
        strokeLinejoin="round"
        filter="url(#vTransGlow)"
      />
      <text
        x="36"
        y="54"
        fill="url(#vTransOrangeGrad)"
        fontSize="18"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="900"
        textAnchor="middle"
      >
        A
      </text>

      {/* Right Speech Bubble with '文' */}
      <path
        d="M 64 36 C 52 36 44 43 44 52 C 44 56 46 60 50 63 L 48 70 L 56 66 C 58 67 61 68 64 68 C 76 68 84 61 84 52 C 84 43 76 36 64 36 Z"
        fill="white"
        stroke="url(#vTransOrangeGrad)"
        strokeWidth="3"
        strokeLinejoin="round"
        filter="url(#vTransGlow)"
      />
      <text
        x="64"
        y="58"
        fill="url(#vTransOrangeGrad)"
        fontSize="16"
        fontFamily="system-ui, sans-serif"
        fontWeight="bold"
        textAnchor="middle"
      >
        文
      </text>

      {/* Stylized 'V' in Center */}
      <path
        d="M 38 31 L 49 61 C 49.5 62.5 50.5 62.5 51 61 L 62 31 H 55 L 50 51 L 45 31 Z"
        fill="url(#vTransOrangeGrad)"
        filter="url(#vTransGlow)"
      />
    </svg>
  );
}
