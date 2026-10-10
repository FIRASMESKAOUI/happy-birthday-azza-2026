import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// ─── Target: midnight Oct 11, 2026 Tunisia time (UTC+1) ─────────
// 2026-10-11T00:00:00+01:00 = 2026-10-10T23:00:00Z
const TARGET_UTC = Date.UTC(2026, 9, 10, 23, 0, 0); // month is 0-indexed

function getTimeLeft() {
  const now = Date.now();
  const diff = TARGET_UTC - now;
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, done: true };
  const totalSec = Math.floor(diff / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { hours, minutes, seconds, done: false };
}

// ─── Kawaii Bear holding a 3D Clock ──────────────────────────────

// 3D digit card
const ClockDigit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
    <div style={{ perspective: '400px' }}>
      <motion.div
        style={{
          background: 'linear-gradient(145deg, rgba(255,200,220,0.25) 0%, rgba(255,160,200,0.12) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(255, 182, 213, 0.4)',
          borderRadius: 12,
          padding: '8px 10px',
          minWidth: 52,
          textAlign: 'center',
          boxShadow: '0 6px 16px rgba(249,168,212,0.25), 0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.08)',
          transformStyle: 'preserve-3d' as const,
          transform: 'rotateX(8deg) rotateY(-3deg)',
        }}
        animate={{ rotateX: [8, 5, 8], rotateY: [-3, 2, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              display: 'block',
              fontFamily: "'Nunito', sans-serif",
              fontSize: 'clamp(22px, 4.5vw, 32px)',
              fontWeight: 900,
              color: '#f9a8d4',
              textShadow: '0 0 14px rgba(249,168,212,0.6), 0 2px 0 rgba(200,100,150,0.3)',
              lineHeight: 1,
            }}
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
    <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 9, fontWeight: 700, color: 'rgba(200,180,230,0.65)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
      {label}
    </span>
  </div>
);

// Blinking colon
const ClockSep: React.FC = () => (
  <motion.span
    style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(18px, 3.5vw, 26px)', fontWeight: 900, color: '#f9a8d4', textShadow: '0 0 10px rgba(249,168,212,0.5)', marginTop: -4 }}
    animate={{ opacity: [1, 0.2, 1] }}
    transition={{ duration: 1, repeat: Infinity }}
  >
    :
  </motion.span>
);

// Cute kawaii bear SVG (Hello-Kitty inspired)
const KawaiiBear: React.FC = () => (
  <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ears */}
    <ellipse cx="30" cy="22" rx="18" ry="20" fill="#f9a8d4" />
    <ellipse cx="30" cy="22" rx="12" ry="13" fill="#fbb6ce" />
    <ellipse cx="90" cy="22" rx="18" ry="20" fill="#f9a8d4" />
    <ellipse cx="90" cy="22" rx="12" ry="13" fill="#fbb6ce" />
    {/* Head */}
    <ellipse cx="60" cy="52" rx="40" ry="36" fill="#fce4ec" />
    {/* Eyes */}
    <ellipse cx="46" cy="48" rx="4" ry="4.5" fill="#333" />
    <ellipse cx="74" cy="48" rx="4" ry="4.5" fill="#333" />
    {/* Eye sparkle */}
    <circle cx="48" cy="46" r="1.5" fill="#fff" />
    <circle cx="76" cy="46" r="1.5" fill="#fff" />
    {/* Nose */}
    <ellipse cx="60" cy="56" rx="3" ry="2.2" fill="#f48fb1" />
    {/* Mouth */}
    <path d="M55 59 Q60 64 65 59" stroke="#e91e63" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* Blush cheeks */}
    <ellipse cx="36" cy="58" rx="7" ry="5" fill="rgba(244,143,177,0.35)" />
    <ellipse cx="84" cy="58" rx="7" ry="5" fill="rgba(244,143,177,0.35)" />
    {/* Bow (Hello-Kitty style) */}
    <g transform="translate(80, 14)">
      <path d="M0 6 Q-8 -2 -3 -6 Q2 -10 4 -2 Z" fill="#ec407a" />
      <path d="M0 6 Q8 -2 3 -6 Q-2 -10 -4 -2 Z" fill="#f06292" />
      <circle cx="0" cy="5" r="2.5" fill="#fce4ec" />
    </g>
    {/* Arms reaching out */}
    <path d="M22 78 Q10 85 8 95" stroke="#fce4ec" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M98 78 Q110 85 112 95" stroke="#fce4ec" strokeWidth="10" strokeLinecap="round" fill="none" />
    {/* Paw pads */}
    <circle cx="8" cy="96" r="5" fill="#f9a8d4" />
    <circle cx="112" cy="96" r="5" fill="#f9a8d4" />
  </svg>
);

// Full bear + clock combo
const KawaiiBearClock: React.FC<{ hours: number; minutes: number; seconds: number }> = ({ hours, minutes, seconds }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.9, type: 'spring', stiffness: 120 }}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12 }}
  >
    <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, color: 'rgba(249,168,212,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
      ✨ the magic begins in ✨
    </span>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div animate={{ y: [0, -5, 0], rotate: [0, 1, 0, -1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <KawaiiBear />
      </motion.div>
      <motion.div
        style={{
          marginTop: -12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(20,10,40,0.5)',
          backdropFilter: 'blur(16px)',
          borderRadius: 20,
          padding: '10px 18px',
          border: '1.5px solid rgba(255,182,213,0.3)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.25), 0 0 20px rgba(249,168,212,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
        animate={{ rotateX: [2, -2, 2], rotateY: [-1, 1, -1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ClockDigit value={hours} label="hours" />
        <ClockSep />
        <ClockDigit value={minutes} label="min" />
        <ClockSep />
        <ClockDigit value={seconds} label="sec" />
      </motion.div>
    </div>
  </motion.div>
);

// ─── DarkRoom Component ─────────────────────────────────────────
interface DarkRoomProps {
  onLightsOn: () => void;
}

const DarkRoom: React.FC<DarkRoomProps> = ({ onLightsOn }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    startIntroMusic();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLightsOn = () => {
    if (!timeLeft.done) return;
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

        {/* ── Countdown timer (Kawaii Bear + 3D Clock) ────── */}
        {!timeLeft.done && (
          <KawaiiBearClock hours={timeLeft.hours} minutes={timeLeft.minutes} seconds={timeLeft.seconds} />
        )}

        {/* ── Celebration when countdown ends ─────────────── */}
        {timeLeft.done && (
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: '#f9a8d4',
              textShadow: '0 0 12px rgba(249,168,212,0.5)',
              marginTop: 4,
            }}
          >
            🎉 it's time, honey! 🎉
          </motion.p>
        )}

        {/* Modern Kawaii Turn on the light button */}
        <motion.button
          className="relative mt-4 flex items-center justify-center px-9 py-3.5 rounded-full font-bold text-white shadow-xl overflow-hidden"
          style={{
            background: timeLeft.done
              ? 'linear-gradient(135deg, #fde047 0%, #f472b6 55%, #db2777 100%)'
              : 'linear-gradient(135deg, #555 0%, #444 55%, #333 100%)',
            border: timeLeft.done
              ? '1.5px solid rgba(255,255,255,0.7)'
              : '1.5px solid rgba(255,255,255,0.15)',
            fontSize: 15,
            fontFamily: "'Nunito', sans-serif",
            letterSpacing: '0.04em',
            boxShadow: timeLeft.done
              ? '0 12px 32px -4px rgba(244,114,182,0.65), 0 0 20px rgba(253,224,71,0.35)'
              : '0 4px 12px rgba(0,0,0,0.3)',
            textShadow: timeLeft.done ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
            opacity: timeLeft.done ? 1 : 0.5,
            pointerEvents: timeLeft.done ? 'auto' : 'none',
          }}
          onClick={handleLightsOn}
          whileHover={timeLeft.done ? { scale: 1.06, y: -2 } : {}}
          whileTap={timeLeft.done ? { scale: 0.95 } : {}}
        >
          {/* Subtle glossy glass reflection overlay */}
          <span
            className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-full"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)',
            }}
          />
          {/* Subtle pulse ring */}
          {timeLeft.done && (
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                animation: 'pulse-ring 2.2s ease-out infinite',
                background: 'rgba(255,255,255,0.25)',
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <span>{timeLeft.done ? config.darkRoom.buttonLabel : '🔒 not yet, honey...'}</span>
            {timeLeft.done && <span className="text-sm font-bold opacity-90">✦</span>}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default DarkRoom;
