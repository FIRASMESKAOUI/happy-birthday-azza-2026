import React from 'react';
import { motion } from 'framer-motion';

const ITEMS = ['💖', '✨', '🌸', '🎀', '🧸', '💕', '🎂'];

const HeartShower: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
      {Array.from({ length: 70 }).map((_, i) => {
        const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        const xStart = Math.random() * 100;
        const delay = Math.random() * 4; 
        const duration = 3.5 + Math.random() * 3; 
        const size = 16 + Math.random() * 24; 
        const xEnd = xStart + (Math.random() - 0.5) * 30; 
        const rotation = (Math.random() - 0.5) * 360;

        return (
          <motion.div
            key={i}
            className="absolute top-[-60px]"
            style={{
              left: `${xStart}%`,
              fontSize: size,
              filter: 'drop-shadow(0 2px 5px rgba(244,143,177,0.4))',
            }}
            initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
              x: `${xEnd - xStart}vw`,
              opacity: [0, 1, 1, 0],
              rotate: rotation,
            }}
            transition={{ duration, delay, ease: 'linear', repeat: Infinity }}
          >
            {item}
          </motion.div>
        );
      })}
    </div>
  );
};

export default HeartShower;
