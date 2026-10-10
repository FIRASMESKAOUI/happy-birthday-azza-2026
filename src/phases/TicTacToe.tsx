import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeartShower from '../components/HeartShower';

// ─── Types ────────────────────────────────────────────────────────
type CellValue = 'X' | 'O' | null;
type Board = CellValue[];

// ─── Win check ────────────────────────────────────────────────────
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],          // diags
];

const getWinner = (board: Board): CellValue => {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
};

const getWinLine = (board: Board): number[] | null => {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
};

// ─── "Easy" Robot AI – intentionally loses ────────────────────────
// Strategy: Pick the WORST move for O so Mon Amour (X) always wins.
const getRobotMove = (board: Board): number => {
  const empty = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
  if (empty.length === 0) return -1;

  // 1. NEVER pick a move that would make the robot win:
  const safeForUser = empty.filter((idx) => {
    const testBoard = [...board];
    testBoard[idx] = 'O';
    return getWinner(testBoard) !== 'O';
  });
  const validEmpty = safeForUser.length > 0 ? safeForUser : empty;

  // 2. Identify all empty spots that would give X a win:
  const xWinningSpots = new Set<number>();
  for (const [a, b, c] of WIN_LINES) {
    const vals = [board[a], board[b], board[c]];
    if (vals.filter((v) => v === 'X').length === 2 && vals.filter((v) => v === null).length === 1) {
      const winIdx = [a, b, c].find((i) => board[i] === null);
      if (winIdx !== undefined) xWinningSpots.add(winIdx);
    }
  }

  // 3. Do NOT block X: filter out xWinningSpots so X easily wins on next turn:
  const nonBlocking = validEmpty.filter((idx) => !xWinningSpots.has(idx));
  const pool = nonBlocking.length > 0 ? nonBlocking : validEmpty;

  // 4. Prefer the worst moves (edges 1, 3, 5, 7):
  const edges = pool.filter((i) => [1, 3, 5, 7].includes(i));
  if (edges.length > 0) return edges[Math.floor(Math.random() * edges.length)];

  const corners = pool.filter((i) => [0, 2, 6, 8].includes(i));
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  return pool[0];
};

// ─── Twinkling Stars (like DarkMode) ──────────────────────────────
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: ((i * 73 + 17) % 98) + 1,
  y: ((i * 53 + 11) % 94) + 1,
  size: (i % 3) + 1.5,
  dur: 1.5 + (i % 4) * 0.5,
  delay: (i * 0.2) % 3,
}));

// ─── TicTacToe Component ──────────────────────────────────────────
const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [, setWinner] = useState<CellValue>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleClick = useCallback(
    (index: number) => {
      if (board[index] || gameOver || !isXTurn) return;

      const newBoard = [...board];
      newBoard[index] = 'X';
      setBoard(newBoard);

      const w = getWinner(newBoard);
      if (w) {
        setWinner(w);
        setGameOver(true);
        if (w === 'X') {
          setTimeout(() => setShowCelebration(true), 250);
        }
        return;
      }

      if (newBoard.every((cell) => cell !== null)) {
        setGameOver(true);
        return;
      }

      setIsXTurn(false);

      // Robot plays after a brief delay
      setTimeout(() => {
        const robotIdx = getRobotMove(newBoard);
        if (robotIdx >= 0) {
          const robotBoard = [...newBoard];
          robotBoard[robotIdx] = 'O';
          setBoard(robotBoard);

          const rw = getWinner(robotBoard);
          if (rw) {
            setWinner(rw);
            setGameOver(true);
            return;
          }
          if (robotBoard.every((cell) => cell !== null)) {
            setGameOver(true);
            return;
          }
        }
        setIsXTurn(true);
      }, 450);
    },
    [board, gameOver, isXTurn]
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setGameOver(false);
    setWinner(null);
    setShowCelebration(false);
  };

  const winLine = getWinLine(board);

  return (
    <div
      className="fixed inset-0 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(160deg, #fff5f0 0%, #fff0f8 50%, #fff5f0 100%)',
      }}
    >
      {/* ── Twinkling Stars (like dark mode) ─────────────────── */}
      {STARS.map((s) => (
        <div
          key={`star-${s.id}`}
          className="star-twinkle absolute rounded-full pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.id % 3 === 0 ? '#f472b6' : s.id % 3 === 1 ? '#fbbf24' : '#f43f5e',
            boxShadow: `0 0 5px ${s.id % 3 === 0 ? 'rgba(244,114,182,0.8)' : 'rgba(251,191,36,0.8)'}`,
            '--dur': `${s.dur}s`,
            '--delay': `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Decorative Sparkles matching site theme */}
      {[
        { x: 10, y: 8, c: '#f48fb1' },
        { x: 88, y: 10, c: '#ffb74d' },
        { x: 92, y: 75, c: '#ce93d8' },
        { x: 6, y: 75, c: '#64b5f6' },
        { x: 18, y: 88, c: '#f48fb1' },
        { x: 84, y: 88, c: '#ffb74d' },
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

      {/* Celebration Effects (Heart Shower) */}
      {showCelebration && <HeartShower />}

      <motion.div
        className="flex flex-col items-center gap-4 relative z-10 max-w-sm w-full my-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* ── Text ABOVE the board: "Let's play Tic Tac Toe" or "YOU WON" ── */}
        <div className="text-center min-h-[52px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {showCelebration ? (
              <motion.h1
                key="won"
                initial={{ scale: 0, opacity: 0, rotate: -8 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 12 }}
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 'clamp(34px, 8.5vw, 54px)',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #e11d48 0%, #ec4899 45%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.06em',
                  filter: 'drop-shadow(0 4px 16px rgba(225, 29, 72, 0.35))',
                  margin: 0,
                }}
              >
                YOU WON 🏆
              </motion.h1>
            ) : (
              <motion.div key="intro-title" className="flex items-center gap-2">
                <span style={{ color: '#f48fb1', fontSize: 13 }}>✦</span>
                <h1
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 'clamp(22px, 5.5vw, 28px)',
                    fontWeight: 800,
                    color: '#c2185b',
                    letterSpacing: '0.02em',
                    margin: 0,
                  }}
                >
                  Let's play Tic Tac Toe 💕
                </h1>
                <span style={{ color: '#f48fb1', fontSize: 13 }}>✦</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Turn indicator: "your turn honey" ── */}
        {!gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center -mt-2 min-h-[22px]"
          >
            <motion.p
              key={isXTurn ? 'user-turn' : 'robot-turn'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: isXTurn ? '#e11d48' : '#9ca3af',
                letterSpacing: '0.03em',
              }}
            >
              {isXTurn ? 'your turn honey 💕' : 'thinking...'}
            </motion.p>
          </motion.div>
        )}

        {/* ── TicTacToe Grid Board (Light Kawaii Glass Theme) ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            padding: 12,
            background: 'rgba(255, 255, 255, 0.88)',
            borderRadius: 24,
            border: '1.5px solid #fce4ec',
            boxShadow: '0 20px 60px rgba(244, 143, 177, 0.22), 0 4px 16px rgba(244, 143, 177, 0.1)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {board.map((cell, i) => {
            const isWinCell = winLine?.includes(i);
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => handleClick(i)}
                whileHover={!cell && !gameOver && isXTurn ? { scale: 1.05, backgroundColor: '#fff0f5' } : {}}
                whileTap={!cell && !gameOver && isXTurn ? { scale: 0.95 } : {}}
                style={{
                  width: 'min(88px, 23vw)',
                  height: 'min(88px, 23vw)',
                  borderRadius: 18,
                  border: isWinCell
                    ? '2.5px solid #ec4899'
                    : '1.5px solid #fce4ec',
                  background: isWinCell
                    ? 'rgba(253, 232, 243, 0.95)'
                    : cell === 'O'
                    ? '#ffffff'
                    : cell
                    ? '#fffafc'
                    : '#ffffff',
                  cursor: !cell && !gameOver && isXTurn ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: isWinCell
                    ? '0 0 20px rgba(236, 72, 153, 0.35)'
                    : '0 2px 8px rgba(244, 143, 177, 0.08)',
                }}
              >
                <AnimatePresence>
                  {cell === 'X' && (
                    <motion.div
                      key="X"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 16 }}
                      className="relative flex items-center justify-center"
                    >
                      {/* Stylized Pink/Red X for Mon Amour */}
                      <span
                        style={{
                          fontSize: 'clamp(36px, 9vw, 50px)',
                          fontWeight: 900,
                          fontFamily: "'Nunito', sans-serif",
                          background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #e11d48 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 2px 8px rgba(244, 63, 94, 0.35))',
                          lineHeight: 1,
                        }}
                      >
                        X
                      </span>
                    </motion.div>
                  )}

                  {cell === 'O' && (
                    <motion.div
                      key="O"
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 16 }}
                      className="relative flex items-center justify-center"
                    >
                      {/* Simple Black O */}
                      <span
                        style={{
                          fontSize: 'clamp(36px, 9vw, 50px)',
                          fontWeight: 900,
                          fontFamily: "'Nunito', sans-serif",
                          color: '#18181b',
                          lineHeight: 1,
                        }}
                      >
                        O
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* ── Text BELOW the board: "MY HEART" (when won) ── */}
        <div className="text-center min-h-[44px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {showCelebration && (
              <motion.div
                key="celebration-bottom"
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 14 }}
                className="flex flex-col items-center gap-1"
              >
                <h2
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 'clamp(28px, 7vw, 44px)',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    background: 'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.04em',
                    filter: 'drop-shadow(0 2px 10px rgba(225, 29, 72, 0.25))',
                    margin: 0,
                  }}
                >
                  MY HEART 💖
                </h2>
                <p
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 13,
                    color: '#be185d',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                  }}
                >
                  You won my heart forever ✨
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Play again button */}
        {gameOver && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: showCelebration ? 0.8 : 0.2 }}
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full font-bold text-white cursor-pointer relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #e11d48 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.7)',
              fontFamily: "'Nunito', sans-serif",
              fontSize: 14,
              boxShadow: '0 10px 28px -4px rgba(225,29,72,0.45), 0 4px 12px rgba(244,114,182,0.3)',
            }}
          >
            <span
              className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-full"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)',
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <span>Play Again</span>
              <span>💕</span>
            </span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default TicTacToe;
