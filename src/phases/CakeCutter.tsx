import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { config } from '../config';
import { Cake3D } from './Cake3D';

// ─── Knife SVG ───────────────────────────────────────────────────
const Knife: React.FC = () => (
  <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
    {/* Blade */}
    <path d="M0 12 L60 6 L72 12 L60 18 Z" fill="#c0c0c0" />
    <path d="M0 12 L60 6 L60 18 Z" fill="#d8d8d8" />
    <path d="M60 6 L72 12" stroke="#a0a0a0" strokeWidth="0.5" />
    {/* Handle */}
    <rect x="68" y="7" width="12" height="10" rx="3" fill="#5d4037" />
    <rect x="68" y="7" width="12" height="4"  rx="2" fill="#6d4c41" />
  </svg>
);

// ─── CakeCutter Component ────────────────────────────────────────
interface CakeCutterProps {
  onComplete: () => void;
}

const CakeCutter: React.FC<CakeCutterProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Framer Motion drag value
  const x = useMotionValue(0);
  const DRAG_MAX = 220;

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number } }) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(DRAG_MAX, info.point.x - rect.left - 20));
    const pct = Math.round((relX / DRAG_MAX) * 100);
    setProgress(pct);
    if (pct >= 98 && !done) {
      setDone(true);
      setTimeout(onComplete, 1200); 
    }
  };



  return (
    <div
      className="fixed inset-0 overflow-y-auto flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(160deg, #1a0a12 0%, #2d0f1e 50%, #1a0a12 100%)',
      }}
    >
      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="star-twinkle absolute rounded-full"
          style={{
            left: `${(i * 71 + 3) % 98}%`,
            top: `${(i * 53 + 5) % 88}%`,
            width: 2,
            height: 2,
            background: 'rgba(255,200,220,0.6)',
            '--dur': `${1.5 + (i % 3) * 0.5}s`,
            '--delay': `${(i * 0.3) % 3}s`,
          } as React.CSSProperties}
        />
      ))}

      <motion.div
        className="flex flex-col items-center gap-6 w-full max-w-2xl px-4 my-auto relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Label */}
        <div className="flex items-center gap-2">
          <span style={{ color: '#f48fb1', fontSize: 10 }}>✦</span>
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.2em',
            color: '#f9a8d4',
            textTransform: 'uppercase',
          }}>
            cut the cake
          </span>
          <span style={{ color: '#f48fb1', fontSize: 10 }}>✦</span>
        </div>

        {/* Cake */}
        <div className="relative w-full flex justify-center mt-4 mb-4">
          <div className="w-full">
            <Cake3D 
              sliceProgress={progress} 
              isCutting={false} 
              candlesLit={[true, true, true, true, true]} 
              isLighting={false} 
              lightingIndex={-1} 
              isCutterPhase={true}
              isCutFinished={done}
            />
          </div>
        </div>

        {/* Instruction */}
        <motion.p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 13,
            color: 'rgba(255,200,220,0.7)',
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
          animate={{ opacity: done ? 0 : [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {done ? '🎉 Perfect cut!' : config.cake.instruction}
        </motion.p>

        {/* Drag area + knife */}
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            height: 56,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,200,220,0.2)',
          }}
        >
          {/* Progress fill */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-2xl"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, rgba(244,143,177,0.4), rgba(233,30,140,0.4))',
            }}
          />

          {/* Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              color: 'rgba(255,200,220,0.8)',
            }}>
              {done ? '✂️ Done!' : `${progress}%`}
            </span>
          </div>

          {/* Draggable knife */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: DRAG_MAX }}
            dragElastic={0}
            dragMomentum={false}
            style={{ x, position: 'absolute', top: '50%', translateY: '-50%', left: 8 }}
            className="knife-cursor"
            onDrag={handleDrag}
            whileDrag={{ scale: 1.1 }}
          >
            <Knife />
          </motion.div>
        </div>

        {/* Progress bar (decorative) */}
        <div className="w-full">
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 6, background: 'rgba(255,255,255,0.08)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #f48fb1, #e91e8c)',
              }}
            />
          </div>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 11,
            color: 'rgba(255,200,220,0.5)',
            textAlign: 'center',
            marginTop: 6,
          }}>
            {config.cake.progressLabel}
          </p>
        </div>

        {/* Celebration when done */}
        <AnimatePresence>
          {done && (
            <motion.div
              className="text-4xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ease: [0.34, 1.56, 0.64, 1] }}
            >
              🎉 🎂 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CakeCutter;
