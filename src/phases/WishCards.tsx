import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from '../config';
import pic1 from '../assets/pic1.gif';
import pic2 from '../assets/pic2.gif';
import pic3 from '../assets/pic3.gif';

const GIF_LIST = [pic1, pic2, pic3];

interface WishCardProps {
  index: number;
  color: string;
  accentColor: string;
  emoji: string;
  message: string;
  isFlipped: boolean;
  onToggleFlip: () => void;
}

const SingleWishCard: React.FC<WishCardProps> = ({
  index,
  color,
  accentColor,
  emoji,
  message,
  isFlipped,
  onToggleFlip,
}) => {
  const gifSrc = GIF_LIST[index];

  // Track touch/drag start for swipe gesture
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX !== null) {
      const deltaX = e.changedTouches[0].clientX - dragStartX;
      if (Math.abs(deltaX) > 40) {
        // Swiped horizontally -> toggle flip
        onToggleFlip();
      }
      setDragStartX(null);
    }
  };

  return (
    <div
      className={`flip-card ${isFlipped ? 'flipped' : ''} flex-shrink-0 snap-center`}
      style={{
        width: 'min(280px, 80vw)',
        height: 'min(410px, 60vh)',
        minHeight: '350px',
      }}
      onClick={onToggleFlip}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flip-card-inner rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
        
        {/* ════════════ FRONT FACE (LE GIF DIRECTEMENT, SANS EFFET GRIS, SANS BADGE, JUSTE 'tap me') ════════════ */}
        <div
          className="flip-card-front w-full h-full rounded-3xl relative overflow-hidden shadow-xl"
          style={{
            backgroundImage: `url(${gifSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: `2px solid ${accentColor}50`,
          }}
        >
          {/* Sans badge, sans effet gris, sans rien : juste 'tap me' */}
          <div className="absolute inset-x-0 bottom-4 flex justify-center items-center pointer-events-none">
            <motion.div
              className="px-4 py-1.5 rounded-full text-xs font-extrabold text-white bg-black/45 backdrop-blur-xs border border-white/40 shadow-lg tracking-wider"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              tap me ✨
            </motion.div>
          </div>
        </div>

        {/* ════════════ BACK FACE (LE DOS DE LA CARTE AVEC LE MESSAGE CENTRÉ) ════════════ */}
        <div
          className="flip-card-back w-full h-full rounded-3xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-xl"
          style={{
            background: `linear-gradient(150deg, #ffffff 10%, ${color} 100%)`,
            border: `2px solid ${accentColor}50`,
          }}
        >
          {/* Subtle decorative sparkles in corners */}
          <span className="absolute top-3.5 left-4 opacity-30 text-xl" style={{ color: accentColor }}>✦</span>
          <span className="absolute top-3.5 right-4 opacity-30 text-xl" style={{ color: accentColor }}>✦</span>
          <span className="absolute bottom-3 left-4 opacity-25 text-lg" style={{ color: accentColor }}>✿</span>
          <span className="absolute bottom-3 right-4 opacity-25 text-lg" style={{ color: accentColor }}>✿</span>

          {/* Top Header Pill */}
          <div className="flex flex-col items-center gap-1 mb-2">
            <span
              className="px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-xs"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
                border: `1px solid ${accentColor}35`,
              }}
            >
              Wish #{index + 1}
            </span>
          </div>

          {/* Emoji */}
          <motion.div
            className="w-13 h-13 rounded-full flex items-center justify-center mb-3 shadow-xs"
            style={{ backgroundColor: `${accentColor}20` }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-2xl sm:text-3xl">{emoji}</span>
          </motion.div>

          {/* Wish Message Centered */}
          <div className="w-full px-2 my-1 flex items-center justify-center">
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 'clamp(14px, 3.2vw, 16px)',
                color: '#5d2a3e',
                fontStyle: 'italic',
                lineHeight: 1.7,
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              "{message}"
            </p>
          </div>

          {/* Small subtle decorative dot/divider */}
          <div
            style={{
              width: 36,
              height: 2,
              borderRadius: 2,
              background: accentColor,
              opacity: 0.35,
              marginTop: 14,
            }}
          />
        </div>

      </div>
    </div>
  );
};

// ─── WishCards Component ─────────────────────────────────────────
interface WishCardsProps {
  onAllSeen: () => void;
}

const WishCards: React.FC<WishCardsProps> = ({ onAllSeen }) => {
  // Flip state for all 3 cards
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);

  const toggleCard = (index: number) => {
    setFlipped((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const flippedCount = flipped.filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(160deg, #fff5f0 0%, #fff0f8 50%, #fff5f0 100%)',
      }}
    >
      {/* Sparkle background elements */}
      {[
        { x: 10, y: 8, c: '#f48fb1' },
        { x: 88, y: 10, c: '#ffb74d' },
        { x: 92, y: 75, c: '#ce93d8' },
        { x: 6, y: 75, c: '#64b5f6' },
      ].map((s, i) => (
        <div
          key={i}
          className="sparkle-anim absolute pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={s.c}>
            <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
          </svg>
        </div>
      ))}

      {/* ── Main Centered Container ─────────────────────────── */}
      <div className="w-full max-w-5xl mx-auto my-auto flex flex-col items-center justify-center gap-4 py-4 relative z-10">
        
        {/* ── Header ───────────────────────────────────────────── */}
        <motion.div
          className="text-center w-full max-w-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span style={{ color: '#f9a825', fontSize: 13 }}>✿</span>
            <span
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.22em',
                color: '#c2185b',
                textTransform: 'uppercase',
              }}
            >
              BIRTHDAY WISHES & MEMORIES
            </span>
            <span style={{ color: '#f9a825', fontSize: 13 }}>✿</span>
          </div>
          <h2
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 'clamp(20px, 4.5vw, 28px)',
              fontStyle: 'italic',
              color: '#7b2d52',
              fontWeight: 700,
            }}
          >
            For you, AZZA 💕
          </h2>
        </motion.div>

        {/* ── 3 Cards Centered (Row / Responsive Scroll) ────────── */}
        <div className="w-full overflow-x-auto py-2 no-scrollbar flex justify-center">
          <motion.div
            className="flex flex-row items-center gap-4 md:gap-6 px-4 py-2 m-auto snap-x snap-mandatory"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {config.wishCards.map((card, idx) => (
              <SingleWishCard
                key={card.id}
                index={idx}
                color={card.color}
                accentColor={card.accentColor}
                emoji={card.emoji}
                message={card.message}
                isFlipped={flipped[idx]}
                onToggleFlip={() => toggleCard(idx)}
              />
            ))}
          </motion.div>
        </div>

        {/* ── Bottom Section: Progress + Read Letter Button ──── */}
        <motion.div
          className="flex flex-col items-center gap-3 w-full max-w-md mt-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Progress indicators / dots */}
          <div className="flex items-center gap-2">
            {config.wishCards.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleCard(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: flipped[i] ? 24 : 10,
                  height: 10,
                  backgroundColor: flipped[i] ? '#e91e63' : '#f8bbd0',
                  border: 'none',
                  cursor: 'pointer',
                }}
                title={`Card ${i + 1} (${flipped[i] ? 'flipped' : 'hidden'})`}
              />
            ))}
          </div>

          <p className="text-xs text-gray-500 font-semibold">
            {flippedCount === 3
              ? '✨ All 3 cards discovered!'
              : `${flippedCount} of 3 cards discovered`}
          </p>

          {/* Modern Kawaii Read Letter CTA button (SANS ÉMOJI) */}
          <AnimatePresence>
            {flippedCount === 3 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onAllSeen}
                className="relative flex items-center justify-center px-9 py-3.5 rounded-full font-bold text-white shadow-lg cursor-pointer overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #e11d48 100%)',
                  border: '1.5px solid rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 15,
                  letterSpacing: '0.04em',
                  boxShadow: '0 10px 28px -4px rgba(225,29,72,0.45), 0 4px 12px rgba(244,114,182,0.3)',
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                {/* Top glass reflection */}
                <span
                  className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-full"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)',
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <span>Read your letter</span>
                  <span className="text-xs font-bold opacity-90">✦</span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};

export default WishCards;
