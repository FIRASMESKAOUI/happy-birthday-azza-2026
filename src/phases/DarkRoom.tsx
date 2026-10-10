import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { config } from '../config';
import { startIntroMusic, stopIntroMusic } from '../musicEngine';

// ─── Star field ─────────────────────────────────────────────────
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: ((i * 73 + 17) % 98) + 1,
  y: ((i * 53 + 11) % 70) + 1,
  size: (i % 3) + 1,
  dur: 1.5 + (i % 4) * 0.5,
  delay: (i * 0.2) % 3,
}));

// ─── Cloud SVG ──────────────────────────────────────────────────
interface CloudProps {
  style?: React.CSSProperties;
  opacity?: number;
}

const Cloud: React.FC<CloudProps> = ({ style, opacity = 0.22 }) => (
  <svg
    viewBox="0 0 320 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <ellipse cx="160" cy="85"  rx="145" ry="38"  fill={`rgba(160,175,230,${opacity})`} />
    <ellipse cx="100" cy="68"  rx="80"  ry="42"  fill={`rgba(160,175,230,${opacity * 0.9})`} />
    <ellipse cx="220" cy="65"  rx="75"  ry="40"  fill={`rgba(160,175,230,${opacity * 0.9})`} />
    <ellipse cx="160" cy="56"  rx="60"  ry="34"  fill={`rgba(185,200,245,${opacity * 1.1})`} />
    <ellipse cx="120" cy="50"  rx="40"  ry="26"  fill={`rgba(190,205,245,${opacity})`} />
    <ellipse cx="200" cy="48"  rx="45"  ry="28"  fill={`rgba(190,205,245,${opacity})`} />
  </svg>
);

// ─── Cloud data ──────────────────────────────────────────────────
const CLOUDS = [
  { id: 1, top: '8%',  left: '-5%', width: 280, dir: 'r', dur: 14,  opacity: 0.28, delay: 0 },
  { id: 2, top: '22%', right: '-8%',width: 220, dir: 'l', dur: 11,  opacity: 0.20, delay: 2 },
  { id: 3, top: '40%', left: '10%', width: 200, dir: 'r', dur: 16,  opacity: 0.18, delay: 1 },
  { id: 4, top: '58%', right: '5%', width: 250, dir: 'l', dur: 12,  opacity: 0.22, delay: 3 },
  { id: 5, top: '14%', left: '38%', width: 160, dir: 'r', dur: 18,  opacity: 0.15, delay: 5 },
  { id: 6, top: '72%', left: '2%',  width: 190, dir: 'r', dur: 13,  opacity: 0.20, delay: 1.5 },
];

// ─── DarkRoom Component ─────────────────────────────────────────
interface DarkRoomProps {
  onLightsOn: () => void;
}

const DarkRoom: React.FC<DarkRoomProps> = ({ onLightsOn }) => {
  useEffect(() => {
    startIntroMusic();
  }, []);

  const handleLightsOn = () => {
    stopIntroMusic();
    onLightsOn();
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 80%, #1e2348 0%, #0e1128 55%, #050710 100%)',
      }}
    >
      {/* ── Stars ──────────────────────────────────────────── */}
      {STARS.map(s => (
        <div
          key={s.id}
          className="star-twinkle absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: 'white',
            '--dur': `${s.dur}s`,
            '--delay': `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Clouds ─────────────────────────────────────────── */}
      {CLOUDS.map(c => (
        <div
          key={c.id}
          className={c.dir === 'l' ? 'cloud-drift-l' : 'cloud-drift-r'}
          style={{
            position: 'absolute',
            top: c.top,
            left: c.left,
            right: (c as any).right,
            width: c.width,
            '--dur': `${c.dur}s`,
            '--delay': `${c.delay}s`,
          } as React.CSSProperties}
        >
          <Cloud opacity={c.opacity} />
        </div>
      ))}

      {/* ── Moon glow ──────────────────────────────────────── */}
      <div
        className="absolute"
        style={{
          top: '6%', right: '12%',
          width: 56, height: 56,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,240,180,0.35) 0%, rgba(255,220,100,0.08) 60%, transparent 100%)',
          boxShadow: '0 0 40px 20px rgba(255,230,120,0.12)',
        }}
      />
      <div
        className="absolute"
        style={{
          top: '8%', right: '14%',
          width: 36, height: 36,
          borderRadius: '50%',
          background: 'rgba(255,240,180,0.18)',
          border: '1px solid rgba(255,230,150,0.25)',
        }}
      />

      {/* ── Content ────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* Brand label */}
        <div className="flex items-center gap-2">
          <span style={{ color: '#a78bfa', fontSize: 10 }}>✦</span>
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: '#c4b5fd',
              textTransform: 'uppercase',
            }}
          >
            {config.darkRoom.label}
          </span>
          <span style={{ color: '#a78bfa', fontSize: 10 }}>✦</span>
        </div>

        {/* Main title */}
        <motion.h1
          style={{
            fontFamily: "'Lora', serif",
            fontSize: 'clamp(32px, 7vw, 56px)',
            fontWeight: 700,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.92)',
            textShadow: '0 0 40px rgba(200,180,255,0.4)',
            lineHeight: 1.2,
          }}
          animate={{ textShadow: [
            '0 0 30px rgba(200,180,255,0.3)',
            '0 0 60px rgba(200,180,255,0.6)',
            '0 0 30px rgba(200,180,255,0.3)',
          ] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {config.darkRoom.title}
        </motion.h1>

        {/* AZZA name */}
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontSize: 'clamp(18px, 4vw, 28px)',
            fontStyle: 'italic',
            color: '#f9a8d4',
            textShadow: '0 0 20px rgba(249,168,212,0.5)',
          }}
        >
          {config.recipientName} 🌙
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 'clamp(13px, 2vw, 15px)',
            color: 'rgba(200,210,255,0.55)',
            fontWeight: 500,
            letterSpacing: '0.04em',
          }}
        >
          {config.darkRoom.subtitle}
        </p>

        {/* Modern Kawaii Turn on the light button */}
        <motion.button
          className="relative mt-4 flex items-center justify-center px-9 py-3.5 rounded-full font-bold text-white shadow-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fde047 0%, #f472b6 55%, #db2777 100%)',
            border: '1.5px solid rgba(255,255,255,0.7)',
            fontSize: 15,
            fontFamily: "'Nunito', sans-serif",
            cursor: 'pointer',
            letterSpacing: '0.04em',
            boxShadow: '0 12px 32px -4px rgba(244,114,182,0.65), 0 0 20px rgba(253,224,71,0.35)',
            textShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
          onClick={handleLightsOn}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Subtle glossy glass reflection overlay */}
          <span
            className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-full"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)',
            }}
          />
          {/* Subtle pulse ring */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              animation: 'pulse-ring 2.2s ease-out infinite',
              background: 'rgba(255,255,255,0.25)',
            }}
          />
          <span className="relative z-10 flex items-center gap-2">
            <span>{config.darkRoom.buttonLabel}</span>
            <span className="text-sm font-bold opacity-90">✦</span>
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default DarkRoom;
