import React from 'react';
import { motion } from 'framer-motion';
import { config } from '../config';

// ─── Cute birthday character SVG ─────────────────────────────────
const CelebrateSVG: React.FC = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="160" height="160">
    {/* Background circle */}
    <circle cx="100" cy="100" r="92" fill="#fce4ec" />

    {/* Confetti scattered */}
    {[
      {x:30, y:35, c:'#f48fb1', r:4},
      {x:165,y:30, c:'#ffb74d', r:3},
      {x:50, y:160,c:'#64b5f6', r:3.5},
      {x:155,y:158,c:'#81c784', r:4},
      {x:170,y:80, c:'#ce93d8', r:3},
      {x:25, y:100,c:'#fff176', r:4},
    ].map((s,i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity="0.8"/>)}

    {/* Cake */}
    <rect x="60" y="130" width="80" height="30" rx="3" fill="#f9c4d4" />
    <rect x="57" y="115" width="86" height="18" rx="2" fill="white" />
    <path d="M57 115 Q70 106 83 115 Q96 106 109 115 Q122 106 135 115 Q143 106 143 115" fill="#fce4ec" />

    {/* Happy Birthday banner above */}
    <rect x="30" y="60" width="140" height="24" rx="5" fill="#f48fb1" />
    <text x="100" y="76" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">HAPPY BIRTHDAY</text>

    {/* Character body */}
    <ellipse cx="100" cy="108" rx="22" ry="20" fill="#ffe0b2" />
    {/* Face */}
    <circle cx="93" cy="105" r="2.5" fill="#5d4037" />
    <circle cx="107" cy="105" r="2.5" fill="#5d4037" />
    <path d="M94 113 Q100 118 106 113" stroke="#5d4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Cheeks */}
    <ellipse cx="88" cy="111" r="4" fill="#f48fb1" opacity="0.45" />
    <ellipse cx="112" cy="111" r="4" fill="#f48fb1" opacity="0.45" />

    {/* Party hat */}
    <polygon points="100,72 88,95 112,95" fill="#e91e8c" />
    <polygon points="100,72 93,88 107,88" fill="#f48fb1" opacity="0.5" />
    <circle cx="100" cy="72" r="3" fill="#fff176" />

    {/* Arms waving */}
    <ellipse cx="74" cy="118" rx="10" ry="5" fill="#ffe0b2" transform="rotate(-40 74 118)" />
    <ellipse cx="126" cy="118" rx="10" ry="5" fill="#ffe0b2" transform="rotate(40 126 118)" />

    {/* Stars around */}
    <text x="42" y="88"  fontSize="14" fill="#f9a825">✦</text>
    <text x="152" y="85" fontSize="12" fill="#f9a825">✦</text>
    <text x="40"  y="145" fontSize="10" fill="#f48fb1">✦</text>
    <text x="155" y="148" fontSize="10" fill="#f48fb1">✦</text>
  </svg>
);

// ─── WishScene Component ─────────────────────────────────────────
interface WishSceneProps {
  onMadeWish: () => void;
}

const WishScene: React.FC<WishSceneProps> = ({ onMadeWish }) => {
  return (
    <div
      className="fixed inset-0 overflow-y-auto flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(160deg, #fff5f0 0%, #ffeef5 50%, #fff5f8 100%)',
      }}
    >
      {/* Background sparkles */}
      {[
        {x:15,y:20,c:'#f48fb1',d:0},
        {x:80,y:15,c:'#ffb74d',d:0.3},
        {x:88,y:70,c:'#ce93d8',d:0.7},
        {x:10,y:75,c:'#64b5f6',d:1.0},
        {x:50,y:5, c:'#f48fb1',d:1.3},
      ].map((s,i) => (
        <div
          key={i}
          className="sparkle-anim absolute"
          style={{
            left:`${s.x}%`, top:`${s.y}%`,
            '--delay':`${s.d}s`,
          } as React.CSSProperties}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={s.c}>
            <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"/>
          </svg>
        </div>
      ))}

      <motion.div
        className="bg-white/95 backdrop-blur-sm rounded-[32px] p-7 sm:p-9 shadow-2xl border border-pink-100/70 flex flex-col items-center gap-4 text-center max-w-sm sm:max-w-md w-full my-auto relative z-10"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Character illustration */}
        <motion.div
          className="float-anim"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              width: 170,
              height: 170,
              background: '#fff9fa',
              boxShadow: '0 8px 30px rgba(244,143,177,0.2)',
              border: '1.5px solid #fce4ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CelebrateSVG />
          </div>
        </motion.div>

        {/* Uppercase Tracked Label */}
        <div className="flex items-center justify-center mt-1">
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.28em',
              color: '#9e6d82',
              textTransform: 'uppercase',
            }}
          >
            {config.wish.label}
          </span>
        </div>

        {/* Main heading */}
        <h1
          style={{
            fontFamily: "'Lora', serif",
            fontSize: 'clamp(21px, 5.2vw, 28px)',
            fontWeight: 600,
            color: '#c2185b',
            lineHeight: 1.25,
          }}
        >
          {config.wish.heading}
        </h1>

        {/* Centered dot divider with gradient lines */}
        <div className="flex items-center justify-center w-full max-w-[140px] my-0.5">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#d85a8a] mx-2" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
        </div>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 13,
            color: '#8a5a6e',
            fontWeight: 500,
          }}
        >
          {config.wish.subtext}
        </p>

        {/* Modern Kawaii Pill Button */}
        <motion.button
          onClick={onMadeWish}
          className="relative mt-2 px-9 py-3.5 rounded-full font-bold text-white shadow-lg cursor-pointer overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
            border: '1.5px solid rgba(255,255,255,0.7)',
            fontFamily: "'Nunito', sans-serif",
            fontSize: 14,
            letterSpacing: '0.05em',
            boxShadow: '0 10px 28px -4px rgba(236,72,153,0.5), 0 4px 12px rgba(244,114,182,0.3)',
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Top glass reflection */}
          <span
            className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-full"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)',
            }}
          />
          <span className="relative z-10 flex items-center gap-2">
            <span>{config.wish.buttonLabel}</span>
            <span className="text-xs font-bold opacity-90">✦</span>
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WishScene;
