import React, { useEffect } from 'react';
import './MagicCursor.css';

const MagicCursor: React.FC = () => {
  useEffect(() => {
    let lastTime = 0;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      if (now - lastTime < 40) return;
      lastTime = now;

      let x, y;
      if ('touches' in e && (e as TouchEvent).touches.length > 0) {
        x = (e as TouchEvent).touches[0].clientX;
        y = (e as TouchEvent).touches[0].clientY;
      } else {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
      }

      // Bottom tip of wand is at ~(10,34) relative to hotspot (34,10)
      const baseX = x - 24;
      const baseY = y + 24;

      // ── Smoke puff (pink cloud) ──
      const smoke = document.createElement('div');
      smoke.className = 'magic-smoke';
      const smokeOffX = (Math.random() - 0.5) * 8;
      const smokeOffY = (Math.random() - 0.5) * 6;
      smoke.style.left = `${baseX + smokeOffX}px`;
      smoke.style.top = `${baseY + smokeOffY}px`;
      // Random drift direction for fluid feel
      const driftX = (Math.random() - 0.5) * 40;
      smoke.style.setProperty('--drift-x', `${driftX}px`);
      document.body.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1400);

      // ── Emoji (star or heart) ── spawns every other tick
      if (Math.random() > 0.4) {
        const emoji = document.createElement('div');
        emoji.className = 'magic-emoji';
        emoji.textContent = Math.random() > 0.5 ? '✨' : '💖';
        const emojiOffX = (Math.random() - 0.5) * 14;
        const emojiOffY = (Math.random()) * 6;
        emoji.style.left = `${baseX + emojiOffX}px`;
        emoji.style.top = `${baseY + emojiOffY}px`;
        // Random sideways drift
        const eDriftX = (Math.random() - 0.5) * 30;
        emoji.style.setProperty('--emoji-drift', `${eDriftX}px`);
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 1200);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return null;
};

export default MagicCursor;
