import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from '../config';
import { playBgMusicMp3 } from '../musicEngine';
import helloKittyGif from '../assets/hellokitty.gif';
import { Cake3D } from './Cake3D';

// ─── Decorative balloon (top of page) ──────────────────────────
interface DecorBalloonProps {
  color: string; x: number; y: number; delay?: number; size?: number;
}
const DecorBalloon: React.FC<DecorBalloonProps> = ({ color, x, y, delay = 0, size = 44 }) => {
  const [flew, setFlew] = useState(false);
  return (
    <div
      className="balloon-float absolute"
      style={{ left: `${x}%`, top: `${y}%`, '--delay': `${delay}s`, zIndex: 10 } as React.CSSProperties}
    >
      <motion.div
        animate={flew ? { y: -800, x: (Math.random() - 0.5) * 300, opacity: 0, scale: 0.5 } : {}}
        transition={{ duration: 1.5, ease: "easeIn" }}
        onHoverStart={() => setFlew(true)}
        onClick={() => setFlew(true)}
        style={{ cursor: flew ? 'default' : 'pointer', touchAction: 'none' }}
      >
        <svg width={size} height={size * 1.4} viewBox="0 0 44 62" fill="none">
          <ellipse cx="22" cy="20" rx="18" ry="20" fill={color} opacity="0.88" />
          <ellipse cx="15" cy="12" rx="5" ry="6" fill="white" opacity="0.3" />
          <path d="M20 40 Q22 43 24 40" stroke={color} strokeWidth="1.5" fill="none" />
          <line x1="22" y1="41" x2="22" y2="58" stroke="#d4a0b5" strokeWidth="1" opacity="0.6" />
        </svg>
      </motion.div>
    </div>
  );
};
const TOP_BALLOONS = [
  { color: '#f48fb1', x: 4,  y: 0,  delay: 0,   size: 42 },
  { color: '#ce93d8', x: 10, y: 2,  delay: 0.4, size: 34 },
  { color: '#80deea', x: 1,  y: 8,  delay: 0.8, size: 28 },
  { color: '#ffcc80', x: 84, y: 0,  delay: 0.2, size: 40 },
  { color: '#f48fb1', x: 90, y: 3,  delay: 0.6, size: 30 },
  { color: '#a5d6a7', x: 94, y: 1,  delay: 1.0, size: 26 },
  { color: '#f06292', x: 48, y: -1, delay: 0.3, size: 36 },
];

// ─── Rising balloons (many more!) ──────────────────────────────
const BALLOON_COLORS = [
  '#f48fb1','#f9a8d4','#fb7185','#fda4af','#f472b6',
  '#e879f9','#c084fc','#a78bfa','#60a5fa','#34d399',
  '#fbbf24','#f97316','#ec4899','#8b5cf6','#06b6d4',
];
const RISING = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  color: BALLOON_COLORS[i % BALLOON_COLORS.length],
  x: ((i * 11 + 3) % 92) + 2,
  delay: i * 0.45,
  dur: 8 + (i % 6) * 1.2,
  size: 30 + (i % 5) * 10,
}));
const RisingBalloon: React.FC<{ color: string; x: number; delay: number; dur: number; size: number }> = ({ color, x, delay, dur, size }) => {
  const [flew, setFlew] = useState(false);
  return (
    <div
      className="balloon-rise fixed"
      style={{ left: `${x}%`, bottom: 0, '--dur': `${dur}s`, '--delay': `${delay}s`, zIndex: 50 } as React.CSSProperties}
    >
      <motion.div
        animate={flew ? { x: (Math.random() - 0.5) * 500, y: -500, opacity: 0, scale: 0.5, rotate: (Math.random() - 0.5) * 90 } : {}}
        transition={{ duration: 1.2, ease: "easeIn" }}
        onHoverStart={() => setFlew(true)}
        onClick={() => setFlew(true)}
        style={{ cursor: flew ? 'default' : 'pointer', touchAction: 'none' }}
      >
        <svg width={size} height={size * 1.4} viewBox="0 0 40 56" fill="none">
          <ellipse cx="20" cy="18" rx="16" ry="18" fill={color} opacity="0.78" />
          <ellipse cx="13" cy="11" rx="4" ry="5" fill="white" opacity="0.25" />
          <path d="M18 36 Q20 38 22 36" stroke={color} strokeWidth="1.5" fill="none" />
          <line x1="20" y1="37" x2="20" y2="53" stroke="#fca5a5" strokeWidth="1" opacity="0.5" />
        </svg>
      </motion.div>
    </div>
  );
};

// ─── Birthday card ──────────────────────────────────────────────
const BirthdayCard: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
    className="relative rounded-3xl p-6 text-center mx-auto overflow-hidden"
    style={{
      maxWidth: 320,
      background: 'linear-gradient(145deg, #fff5f7 0%, #fff0f5 100%)',
      border: '1.5px solid #fce4ec',
      boxShadow: '0 16px 50px rgba(244,143,177,0.25)',
    }}
  >
    {[...Array(10)].map((_, i) => (
      <div key={i} className="absolute rounded-full" style={{
        width: 6, height: 6,
        background: ['#f48fb1','#ffb74d','#81c784','#64b5f6','#ce93d8'][i % 5],
        left: `${(i * 23 + 5) % 90}%`,
        top: `${(i * 31 + 8) % 30}%`,
        opacity: 0.7,
      }} />
    ))}
    <div className="mb-3 flex justify-center">
      <img src={helloKittyGif} alt="Hello Kitty" style={{ width: 110, height: 'auto' }} />
    </div>
    <h3 style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, fontStyle: 'italic', color: '#c2185b' }}>
      {config.card.title}
    </h3>
    <p className="mt-2 text-sm" style={{ fontFamily: "'Nunito', sans-serif", color: '#ad5e7e', fontWeight: 500 }}>
      {config.card.subtitle}
    </p>
    <div className="flex justify-center gap-2 mt-3 text-xl">🎉 🌸 🎈 🎊 💕</div>
  </motion.div>
);

// ─── Big scene button (SANS ÉMOJI) ───────────────────────────────
interface SceneBtnProps {
  label: string;
  sublabel?: string;
  gradient: string;
  shadow: string;
  onClick: () => void;
}

const SceneBtn: React.FC<SceneBtnProps> = ({ label, sublabel, gradient, shadow, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 25, scale: 0.94 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.94 }}
    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
    className="w-full"
  >
    <motion.button
      onClick={onClick}
      className="relative w-full flex items-center justify-between px-8 py-4 rounded-full overflow-hidden"
      style={{
        background: gradient,
        border: '1.5px solid rgba(255,255,255,0.7)',
        cursor: 'pointer',
        boxShadow: shadow,
        color: 'white',
        fontFamily: "'Nunito', sans-serif",
        padding: '16px 28px',
        minHeight: '66px',
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Top glass reflection overlay */}
      <span
        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-full"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
      <div className="relative z-10 flex flex-col text-left">
        <p className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-white drop-shadow-xs">
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-white/85 font-medium mt-0.5 tracking-wide">
            {sublabel}
          </p>
        )}
      </div>
      <motion.div
        className="relative z-10 w-8 h-8 rounded-full bg-white/25 backdrop-blur-xs flex items-center justify-center text-white font-bold text-base border border-white/40 shadow-xs"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
      >
        →
      </motion.div>
    </motion.button>
  </motion.div>
);

// ─── LitRoom ─────────────────────────────────────────────────────
interface LitRoomProps { onCutCake: () => void; }

const LitRoom: React.FC<LitRoomProps> = ({ onCutCake }) => {
  // -1 = attente que l'animation du 1er frame finisse d'abord, 0 = musique, 1 = décoration, 2 = ballons, 3 = light candles, 4 = gâteau
  const [step, setStep]         = useState<number>(-1);
  const [decorated, setDecorated] = useState(false);
  const [balloonsUp, setBalloonsUp] = useState(false);
  
  // 3D Cake States
  const [candlesLit, setCandlesLit] = useState([false, false, false, false, false]);
  const [isLighting, setIsLighting] = useState(false);
  const [lightingIndex, setLightingIndex] = useState(-1);

  // Attendre que l'animation de la 1ère frame soit complètement terminée avant d'afficher le 1er bouton
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(0);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleMusic = () => {
    playBgMusicMp3();
    setStep(-1);
    setTimeout(() => setStep(1), 1600);
  };

  const handleDecorate = () => {
    setDecorated(true);
    setStep(-1);
    setTimeout(() => setStep(2), 1800);
  };

  const handleBalloons = () => {
    setBalloonsUp(true);
    setStep(-1);
    setTimeout(() => setStep(3), 2000);
  };

  const handleLightCandles = () => {
    setStep(-1);
    setIsLighting(true);
    setLightingIndex(0);
    
    const lightNextCandle = (index: number) => {
      if (index < 5) {
        setLightingIndex(index);
        setTimeout(() => {
          setCandlesLit(prev => {
            const next = [...prev];
            next[index] = true;
            return next;
          });
          setTimeout(() => lightNextCandle(index + 1), 600);
        }, 800);
      } else {
        setTimeout(() => {
          setIsLighting(false);
          setLightingIndex(-1);
          setStep(4);
        }, 1000);
      }
    };
    
    lightNextCandle(0);
  };

  const handleCutCake = () => {
    onCutCake();
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #fff5f0 0%, #ffeef4 40%, #fff5f8 100%)' }}
    >
      {/* ── Multicolor fairy-lights string (appears when decorated) ── */}
      <AnimatePresence>
        {decorated && (
          <motion.div
            key="lights-strip"
            className="absolute top-0 left-0 right-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            {/* Wire */}
            <svg
              viewBox="0 0 1000 90"
              preserveAspectRatio="none"
              style={{ width: '100%', height: 90, display: 'block' }}
            >
              <path
                d="M0 28 Q125 10 250 28 Q375 46 500 28 Q625 10 750 28 Q875 46 1000 28"
                fill="none"
                stroke="rgba(80,80,80,0.4)"
                strokeWidth="2"
              />
              {/* Bulbs along the wire */}
              {[
                { cx: 50,  cy: 30, col: '#ff6b6b' },
                { cx: 120, cy: 18, col: '#ffd93d' },
                { cx: 190, cy: 30, col: '#6bcb77' },
                { cx: 260, cy: 42, col: '#4d96ff' },
                { cx: 330, cy: 20, col: '#ff6bce' },
                { cx: 400, cy: 30, col: '#ff6b6b' },
                { cx: 470, cy: 18, col: '#ffd93d' },
                { cx: 540, cy: 30, col: '#6bcb77' },
                { cx: 610, cy: 42, col: '#a56bff' },
                { cx: 680, cy: 20, col: '#ff6b6b' },
                { cx: 750, cy: 30, col: '#ffd93d' },
                { cx: 820, cy: 18, col: '#4d96ff' },
                { cx: 890, cy: 30, col: '#ff6bce' },
                { cx: 960, cy: 42, col: '#6bcb77' },
              ].map((b, i) => (
                <g key={i}>
                  {/* Wire drop */}
                  <line x1={b.cx} y1={b.cy} x2={b.cx} y2={b.cy + 12} stroke="rgba(80,80,80,0.3)" strokeWidth="1.5" />
                  {/* Glow halo */}
                  <ellipse
                    cx={b.cx}
                    cy={b.cy + 24}
                    rx="13" ry="8"
                    fill={b.col}
                    opacity="0.3"
                  />
                  {/* Bulb body */}
                  <ellipse
                    cx={b.cx}
                    cy={b.cy + 20}
                    rx="8" ry="11"
                    fill={b.col}
                    opacity="0.92"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.92;0.38;0.92"
                      dur={`${1.4 + (i % 5) * 0.3}s`}
                      repeatCount="indefinite"
                    />
                  </ellipse>
                  {/* Highlight */}
                  <ellipse cx={b.cx - 2.5} cy={b.cy + 15} rx="2.5" ry="3.5" fill="white" opacity="0.6" />
                </g>
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ── Decorative top balloons ──────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden pointer-events-none z-10">
        {TOP_BALLOONS.map((b, i) => <DecorBalloon key={i} {...b} />)}
      </div>

      {/* ── Rising balloons (full page, fixed) ───────── */}
      {balloonsUp && RISING.map(b => <RisingBalloon key={b.id} {...b} />)}

      {/* ── Main content ─────────────────────────────── */}
      <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center px-4 py-8 gap-5 relative z-20">

        {/* Brand */}
        <motion.div className="flex items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
          <span style={{ color: '#f48fb1', fontSize: 10 }}>✦</span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 800,
            letterSpacing: '0.2em', color: '#c2185b', textTransform: 'uppercase' }}>
            CELEBRATION MODE
          </span>
          <span style={{ color: '#f48fb1', fontSize: 10 }}>✦</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(32px, 8.5vw, 54px)',
            fontWeight: 700, fontStyle: 'italic', color: '#c2185b', textAlign: 'center', lineHeight: 1.15 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 1.0 }}
        >
          {config.litRoom.headline}
        </motion.h1>

        <motion.div className="w-full"
          style={{ height: 1, background: 'linear-gradient(90deg, transparent, #fce4ec, transparent)' }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 1.2 }} />

        {/* Card reveal (when decorated, hides when cake appears) */}
        <AnimatePresence>
          {decorated && step < 3 && step !== -1 && !isLighting && !candlesLit[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center my-1"
            >
              <BirthdayCard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Cake (appears at step 3) */}
        <AnimatePresence>
          {(step >= 3 || isLighting || candlesLit[0]) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center my-1"
            >
              <Cake3D 
                candlesLit={candlesLit} 
                isLighting={isLighting} 
                lightingIndex={lightingIndex} 
                isCutting={false} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════ BOUTON UNIQUE AU MÊME EMPLACEMENT EN BAS (SANS ÉMOJI) ════ */}
        <div className="w-full min-h-[72px] flex items-center justify-center mt-2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <SceneBtn
                key="btn-music"
                label={config.litRoom.buttons.music}
                sublabel="Start the birthday melody"
                gradient="linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #ec4899 100%)"
                shadow="0 10px 30px -4px rgba(168,85,247,0.5), 0 4px 12px rgba(236,72,153,0.3)"
                onClick={handleMusic}
              />
            )}

            {step === 1 && (
              <SceneBtn
                key="btn-decorate"
                label={config.litRoom.buttons.decorate}
                sublabel="Open the birthday card"
                gradient="linear-gradient(135deg, #f472b6 0%, #fb7185 50%, #f43f5e 100%)"
                shadow="0 10px 30px -4px rgba(244,63,94,0.45), 0 4px 12px rgba(244,114,182,0.3)"
                onClick={handleDecorate}
              />
            )}

            {step === 2 && (
              <SceneBtn
                key="btn-balloons"
                label={config.litRoom.buttons.balloons}
                sublabel="Let them fly!"
                gradient="linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #fda4af 100%)"
                shadow="0 10px 30px -4px rgba(244,63,94,0.45), 0 4px 12px rgba(251,113,133,0.3)"
                onClick={handleBalloons}
              />
            )}

            {step === 3 && (
              <SceneBtn
                key="btn-light-candles"
                label="Light the candles"
                sublabel="Make a wish!"
                gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)"
                shadow="0 10px 30px -4px rgba(245,158,11,0.45), 0 4px 12px rgba(251,191,36,0.3)"
                onClick={handleLightCandles}
              />
            )}

            {step === 4 && (
              <motion.div
                key="btn-cake-wrapper"
                initial={{ opacity: 0, y: 25, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.94 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <motion.button
                  key="btn-cake"
                  onClick={handleCutCake}
                  className="relative w-full flex items-center justify-between px-8 py-4 rounded-full overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #fb923c 0%, #f43f5e 50%, #ec4899 100%)',
                    border: '1.5px solid rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    boxShadow: '0 12px 32px -4px rgba(244,63,94,0.5), 0 4px 14px rgba(251,146,60,0.35)',
                    fontFamily: "'Nunito', sans-serif",
                    color: 'white',
                    padding: '16px 28px',
                    minHeight: '66px',
                  }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {/* Top glass reflection overlay */}
                  <span
                    className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-full"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)',
                    }}
                  />
                  <div className="relative z-10 flex flex-col text-left">
                    <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-white drop-shadow-xs">
                      {config.litRoom.buttons.cake}
                    </span>
                    <span className="text-xs text-white/85 font-medium mt-0.5 tracking-wide">
                      Tap to begin cutting the cake

                    </span>
                  </div>
                  <motion.div
                    className="relative z-10 w-8 h-8 rounded-full bg-white/25 backdrop-blur-xs flex items-center justify-center text-white font-bold text-base border border-white/40 shadow-xs"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    →
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default LitRoom;
