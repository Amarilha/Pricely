"use client"

import { useState, useEffect } from 'react';

const MascotSprite = () => {
  const [frame, setFrame] = useState(0);
  const totalFrames = 4; // Assuming 4 frames in the sprite
  const frameWidth = 100; // Assuming each frame is 100px wide

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % totalFrames);
    }, 150); // Change frame every 150ms

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div
      className="mascot-sprite"
      style={{
        backgroundPosition: `-${frame * frameWidth}px 0`,
      }}
    />
  );
};

export default MascotSprite;
