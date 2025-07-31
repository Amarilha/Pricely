"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';

export interface MascotHandles {
  showMessage: (text: string, duration?: number) => void;
}

const Mascot = forwardRef<MascotHandles, {}>((props, ref) => {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [message, setMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);

  const moveMascot = () => {
    let newTop, newLeft;
    do {
      newTop = Math.random() * 80 + 10;
      newLeft = Math.random() * 80 + 10;
    } while (newTop > 30 && newTop < 70 && newLeft > 30 && newLeft < 70);
    setPosition({ top: `${newTop}%`, left: `${newLeft}%` });
  };

  useEffect(() => {
    const interval = setInterval(moveMascot, 5000);
    return () => clearInterval(interval);
  }, []);

  const showMessage = (text: string, duration: number = 3000) => {
    setMessage(text);
    setShowBubble(true);
    setTimeout(() => {
      setShowBubble(false);
    }, duration);
  };

  useImperativeHandle(ref, () => ({
    showMessage,
  }));

  useEffect(() => {
    const talkInterval = setInterval(() => {
      const elements = document.querySelectorAll('[data-mascot-comment]');
      const visibleElements = Array.from(elements).filter(el => {
        const rect = el.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      });

      if (visibleElements.length > 0) {
        const randomElement = visibleElements[Math.floor(Math.random() * visibleElements.length)];
        const comment = randomElement.getAttribute('data-mascot-comment');
        if (comment) {
          showMessage(comment);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(talkInterval);
  }, []);

  return (
    <div className="mascot" style={{ top: position.top, left: position.left }}>
      {showBubble && (
        <div className="speech-bubble">
          {message}
        </div>
      )}
      <Image src="/mascote.png" alt="Mascote" width={100} height={100} />
    </div>
  );
});

Mascot.displayName = 'Mascot';
export default Mascot;
