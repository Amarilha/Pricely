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
    const newTop = Math.random() * 80 + 10;
    const newLeft = Math.random() * 80 + 10;
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
