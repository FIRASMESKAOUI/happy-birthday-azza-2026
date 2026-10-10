import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DarkRoom    from './phases/DarkRoom';
import LitRoom    from './phases/LitRoom';
import CakeCutter from './phases/CakeCutter';
import WishScene  from './phases/WishScene';
import WishCards  from './phases/WishCards';
import FinalLetter from './phases/FinalLetter';
import TicTacToe from './phases/TicTacToe';

// ─── Phase type ───────────────────────────────────────────────────
type Phase = 'dark' | 'flash' | 'lit' | 'cake' | 'wish' | 'cards' | 'letter' | 'game';

// ─── Page transition variants ─────────────────────────────────────
const pageVariants = {
  initial:  { opacity: 0, scale: 0.97 },
  animate:  { opacity: 1, scale: 1 },
  exit:     { opacity: 0, scale: 1.02 },
};

const pageTransition = { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] };

// ─── App ─────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState<Phase>('dark');

  // Flash white → lit room
  const handleLightsOn = () => {
    setPhase('flash');
    setTimeout(() => setPhase('lit'), 650);
  };

  const go = (p: Phase) => setPhase(p);

  return (
    <>
      {/* ── Light flash overlay ───────────────────────────────── */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div
            key="flash"
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ background: 'white' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.65, times: [0, 0.2, 0.5, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── Phase renderer ─────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {phase === 'dark' && (
          <motion.div
            key="dark"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            <DarkRoom onLightsOn={handleLightsOn} />
          </motion.div>
        )}

        {(phase === 'lit' || phase === 'flash') && (
          <motion.div
            key="lit"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            <LitRoom onCutCake={() => go('cake')} />
          </motion.div>
        )}

        {phase === 'cake' && (
          <motion.div
            key="cake"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            <CakeCutter onComplete={() => go('wish')} />
          </motion.div>
        )}

        {phase === 'wish' && (
          <motion.div
            key="wish"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            <WishScene onMadeWish={() => go('cards')} />
          </motion.div>
        )}

        {phase === 'cards' && (
          <motion.div
            key="cards"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            <WishCards onAllSeen={() => go('letter')} />
          </motion.div>
        )}

        {phase === 'letter' && (
          <motion.div
            key="letter"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            <FinalLetter onDone={() => go('game')} />
          </motion.div>
        )}

        {phase === 'game' && (
          <motion.div
            key="game"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            <TicTacToe />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
