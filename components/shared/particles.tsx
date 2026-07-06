'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ParticlesProps {
  count?: number;
  className?: string;
}

export function Particles({ count = 30, className = '' }: ParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 5,
        gold: Math.random() > 0.6,
      })),
    [count]
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.gold ? '#FACC15' : '#16C784',
            boxShadow: p.gold
              ? '0 0 8px rgba(250,204,21,0.8)'
              : '0 0 8px rgba(22,199,132,0.8)',
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
