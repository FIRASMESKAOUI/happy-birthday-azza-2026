import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { config } from '../config';

// ─── Paper lines decoration ──────────────────────────────────────
const PaperLines: React.FC = () => (
  <>
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div
        key={i}
        className="absolute left-0 right-0"
        style={{
          top: `${i * 40 + 80}px`,
          height: 1,
          background: 'rgba(244,143,177,0.12)',
        }}
      />
    ))}
  </>
);

// ─── Typing cursor ────────────────────────────────────────────────
const Cursor: React.FC = () => (
  <motion.span
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.7, repeat: Infinity }}
    className="inline-block ml-0.5 font-bold text-pink-500"
  >
    |
  </motion.span>
);

interface FinalLetterProps {
  onDone?: () => void;
}

// ─── FinalLetter Component ────────────────────────────────────────
const FinalLetter: React.FC<FinalLetterProps> = ({ onDone }) => {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const { letter } = config;

  // Sections to type in order:
  // 0: greeting, 1: body[0], 2: body[1], 3: body[2], 4: closing, 5: signature
  const textSections = [
    letter.greeting,
    letter.body[0] || '',
    letter.body[1] || '',
    letter.body[2] || '',
    letter.closing,
    `${letter.signature} 💕`,
  ];

  const [currentSection, setCurrentSection] = useState(0);
  const [typedTexts, setTypedTexts] = useState<string[]>(['', '', '', '', '', '']);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Fast forward if user taps the letter card
  const handleFastForward = () => {
    if (!isTypingComplete) {
      setTypedTexts([...textSections]);
      setCurrentSection(textSections.length);
      setIsTypingComplete(true);
    }
  };

  const handleOpenEnvelope = () => {
    if (isOpening || envelopeOpen) return;
    setIsOpening(true);
    setTimeout(() => {
      setEnvelopeOpen(true);
      setIsOpening(false);
    }, 1000);
  };

  useEffect(() => {
    if (!envelopeOpen || isTypingComplete) return;

    let isCancelled = false;
    let activeSec = 0;
    let activeChar = 0;
    const currentSoFar = ['', '', '', '', '', ''];

    // Start typing after envelope unfold animation
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (isCancelled) return;

        if (activeSec >= textSections.length) {
          clearInterval(interval);
          setIsTypingComplete(true);
          return;
        }

        const target = textSections[activeSec];
        if (activeChar < target.length) {
          currentSoFar[activeSec] = target.slice(0, activeChar + 1);
          setTypedTexts([...currentSoFar]);
          setCurrentSection(activeSec);
          activeChar++;
        } else {
          // Move to next section
          activeSec++;
          activeChar = 0;
          setCurrentSection(activeSec);
        }
      }, 36);

      return () => clearInterval(interval);
    }, 700);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [envelopeOpen]);

  return (
    <div
      className="fixed inset-0 overflow-y-auto flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(160deg, #fff9f5 0%, #fff5f8 50%, #fffdf9 100%)',
      }}
    >
      {/* Sparkles */}
      {[{ x: 14, y: 15, c: '#f48fb1' }, { x: 82, y: 12, c: '#ffb74d' }, { x: 88, y: 82, c: '#ce93d8' }].map((s, i) => (
        <div key={i} className="sparkle-anim absolute pointer-events-none" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill={s.c}>
            <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
          </svg>
        </div>
      ))}

      <div className="w-full max-w-sm px-4 py-8 my-auto flex flex-col items-center gap-5 relative z-10">
        {/* Label */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ color: '#f9a825', fontSize: 13 }}>✿</span>
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.2em',
            color: '#c2185b',
            textTransform: 'uppercase',
          }}>
            A little letter for you
          </span>
          <span style={{ color: '#f9a825', fontSize: 13 }}>✿</span>
        </motion.div>

        {!envelopeOpen ? (
          /* ── 3D Envelope ───────────────────────────────────── */
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <motion.div
              className="relative cursor-pointer"
              onClick={handleOpenEnvelope}
              whileHover={!isOpening ? { scale: 1.04, rotateY: 5 } : {}}
              whileTap={!isOpening ? { scale: 0.96 } : {}}
              animate={isOpening ? { rotateX: 12, scale: 1.05 } : { rotateX: 0 }}
              style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
            >
              <div style={{ transformStyle: 'preserve-3d', position: 'relative' }}>
                <svg width="280" height="190" viewBox="0 0 280 190" fill="none">
                  {/* Envelope body */}
                  <rect x="10" y="10" width="260" height="170" rx="12" fill="#fff5f8" stroke="#fce4ec" strokeWidth="2" />

                  {/* Left flap */}
                  <path d="M10 10 L10 180 L140 95 Z" fill="#fff0f5" />
                  <path d="M10 10 L10 180 L140 95" stroke="#f8bbd9" strokeWidth="1" fill="none" />

                  {/* Right flap */}
                  <path d="M270 10 L270 180 L140 95 Z" fill="#fff0f5" />
                  <path d="M270 10 L270 180 L140 95" stroke="#f8bbd9" strokeWidth="1" fill="none" />

                  {/* Bottom triangle */}
                  <path d="M10 180 L140 95 L270 180 Z" fill="#fce4ec" />
                  <path d="M10 180 L140 95 L270 180" stroke="#f8bbd9" strokeWidth="1.5" fill="none" />
                </svg>

                {/* 3D Sliding Paper Inside Envelope */}
                {isOpening && (
                  <motion.div
                    className="absolute bg-white rounded-lg shadow-md border border-pink-100 flex flex-col items-center justify-center pointer-events-none"
                    style={{
                      left: 25,
                      top: 25,
                      width: 230,
                      height: 150,
                      zIndex: 15,
                    }}
                    initial={{ y: 0, opacity: 0.8 }}
                    animate={{ y: -80, opacity: 1, scale: 1.04 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
                  >
                    <div className="w-12 h-1 bg-pink-200 rounded mb-2" />
                    <div className="w-32 h-1 bg-pink-100 rounded mb-1" />
                    <div className="w-24 h-1 bg-pink-100 rounded" />
                  </motion.div>
                )}

                {/* Heart wax seal */}
                <motion.div
                  className="absolute pointer-events-none"
                  style={{ left: 116, top: 76, width: 48, height: 48, zIndex: 25 }}
                  animate={isOpening ? { scale: [1, 1.4, 0], opacity: [1, 0.9, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="24" fill="url(#sealGrad2)" />
                    <text x="24" y="32" textAnchor="middle" fontSize="22">💌</text>
                    <defs>
                      <radialGradient id="sealGrad2" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f48fb1" />
                        <stop offset="100%" stopColor="#e91e8c" />
                      </radialGradient>
                    </defs>
                  </svg>
                </motion.div>

                {/* 3D Flap that opens backwards */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    width: 260,
                    transformOrigin: 'top center',
                    transformStyle: 'preserve-3d',
                    zIndex: 20,
                  }}
                  animate={
                    isOpening
                      ? { rotateX: -180, opacity: [1, 0.9, 0.4] }
                      : { rotateX: [0, -15, 0] }
                  }
                  transition={
                    isOpening
                      ? { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
                      : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                  }
                >
                  <svg width="260" height="90" viewBox="0 0 260 90" fill="none">
                    <path d="M0 0 L130 85 L260 0 Z" fill="#fce4ec" />
                    <path d="M0 0 L130 85 L260 0" stroke="#f8bbd9" strokeWidth="1.5" fill="none" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {!isOpening && (
              <motion.p
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 13,
                  color: '#f48fb1',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                ✦ tap to open ✦
              </motion.p>
            )}
          </motion.div>
        ) : (
          /* ── Letter content with real-time typewriter effect ──────── */
          <motion.div
            onClick={handleFastForward}
            className="w-full relative rounded-3xl p-7 overflow-hidden cursor-pointer"
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.9, ease: [0.34, 1.4, 0.64, 1] }}
            style={{
              background: 'linear-gradient(160deg, #fffdf9 0%, #fff8f0 100%)',
              border: '1.5px solid #fce4ec',
              boxShadow: '0 20px 60px rgba(244,143,177,0.2)',
              transformOrigin: 'top',
              minHeight: 320,
            }}
          >
            {/* Paper line decorations */}
            <PaperLines />

            {/* Corner ornaments */}
            <div className="absolute top-4 right-4 text-2xl" style={{ opacity: 0.2 }}>✿</div>
            <div className="absolute bottom-4 left-4 text-2xl" style={{ opacity: 0.2 }}>✿</div>

            {/* Date line */}
            <motion.p
              className="text-right text-xs mb-5"
              style={{ fontFamily: "'Nunito', sans-serif", color: '#d4a0b5', fontWeight: 600, letterSpacing: '0.08em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {letter.dateLine}
            </motion.p>

            {/* Greeting (typed in real time) */}
            {typedTexts[0] && (
              <p
                className="mb-4 text-lg font-semibold"
                style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: '#7b2d52' }}
              >
                {typedTexts[0]}
                {currentSection === 0 && !isTypingComplete && <Cursor />}
              </p>
            )}

            {/* Body paragraphs (typed in real time) */}
            {letter.body.map((_, i) => {
              const textIdx = i + 1;
              if (!typedTexts[textIdx]) return null;
              return (
                <p
                  key={i}
                  className="mb-4 text-sm leading-relaxed"
                  style={{ fontFamily: "'Nunito', sans-serif", color: '#8d4a6a', fontWeight: 500 }}
                >
                  {typedTexts[textIdx]}
                  {currentSection === textIdx && !isTypingComplete && <Cursor />}
                </p>
              );
            })}

            {/* Divider */}
            {typedTexts[4] && (
              <motion.div
                className="my-4"
                style={{ height: 1, background: 'linear-gradient(90deg, transparent, #fce4ec, transparent)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
              />
            )}

            {/* Closing & Signature (typed in real time) */}
            {typedTexts[4] && (
              <div className="text-right">
                <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: 14, color: '#ad5e7e' }}>
                  {typedTexts[4]}
                  {currentSection === 4 && !isTypingComplete && <Cursor />}
                </p>
                {typedTexts[5] && (
                  <p className="mt-1 font-bold" style={{ fontFamily: "'Lora', serif", fontSize: 20, color: '#c2185b' }}>
                    {typedTexts[5]}
                    {currentSection === 5 && !isTypingComplete && <Cursor />}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Final hearts & CTA to game phase */}
        {envelopeOpen && isTypingComplete && (
          <div className="flex flex-col items-center gap-4 mt-2">
            <motion.div
              className="text-3xl flex gap-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            >
              🌸 💕 🎂 💕 🌸
            </motion.div>

            {onDone && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 220, damping: 14 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDone}
                className="relative px-8 py-3.5 rounded-full font-bold text-white shadow-xl cursor-pointer flex items-center gap-2 overflow-hidden mt-3"
                style={{
                  background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #e11d48 100%)',
                  border: '1.5px solid rgba(255,255,255,0.7)',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 15,
                  letterSpacing: '0.03em',
                  boxShadow: '0 10px 28px -4px rgba(225,29,72,0.45), 0 4px 12px rgba(244,114,182,0.3)',
                }}
              >
                {/* Top glass reflection */}
                <span
                  className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-full"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)',
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <span>Play a game with me</span>
                  <span className="text-base">🎮</span>
                  <span className="text-xs font-bold opacity-90">✦</span>
                </span>
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalLetter;
