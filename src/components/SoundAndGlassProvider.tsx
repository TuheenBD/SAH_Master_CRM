'use client';

import { useEffect } from 'react';
import { playMildSound, getAudioContext } from '@/lib/sound';

export default function SoundAndGlassProvider() {
  useEffect(() => {
    // Unlock AudioContext on first user interaction to comply with browser autoplay policies
    const unlockAudio = () => {
      getAudioContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });

    let currentHoveredCard: Element | null = null;
    let currentHoveredButton: Element | null = null;

    // Delegated mouseover listener for all buttons, links, and cards
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Check if hovering over a button or interactive link/control
      const button = target.closest(
        'button, a, [role="button"], input[type="button"], input[type="submit"], [role="tab"], select, label[for]'
      );

      if (button) {
        if (button !== currentHoveredButton) {
          currentHoveredButton = button;
          playMildSound('button', button);
        }
        return;
      }
      currentHoveredButton = null;

      // 2. Check if hovering over a card or container
      const card = target.closest(
        '.glass-card, [class*="rounded-xl"], [class*="rounded-2xl"], [class*="shadow-sm"]:not(button):not(a), [class*="border-[#DDE3DD]"]:not(button):not(a)'
      );

      if (card && card !== document.body && card.tagName !== 'HTML') {
        // Exclude huge layout containers like root shell
        if (card.classList.contains('flex-1') && card.tagName === 'MAIN') return;
        if (card.classList.contains('min-h-screen')) return;

        if (card !== currentHoveredCard) {
          currentHoveredCard = card;
          playMildSound('card', card);
        }
        return;
      }
      currentHoveredCard = null;
    };

    const handleMouseLeave = () => {
      currentHoveredButton = null;
      currentHoveredCard = null;
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return null;
}

