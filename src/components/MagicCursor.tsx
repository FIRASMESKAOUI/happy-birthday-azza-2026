import React, { useEffect } from 'react';
import './MagicCursor.css';

const MagicCursor: React.FC = () => {
  useEffect(() => {
    let lastTime = 0;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      if (now - lastTime < 30) return; // Throttle to roughly 30fps for cursor
      lastTime = now;

      const el = document.createElement('div');
      el.className = 'magic-cursor-particle';
      const isStar = Math.random() > 0.5;
      el.textContent = isStar ? '✨' : '💖';
      
      let x, y;
      if ('touches' in e && (e as TouchEvent).touches.length > 0) {
        x = (e as TouchEvent).touches[0].clientX;
        y = (e as TouchEvent).touches[0].clientY;
      } else {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
      }
      
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      
      el.style.left = `${x + offsetX}px`;
      el.style.top = `${y + offsetY}px`;
      
      document.body.appendChild(el);
      
      setTimeout(() => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 1000);
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
