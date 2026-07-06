'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'brand';
  glow?: boolean;
}

export function GlassCard({
  className,
  variant = 'default',
  glow = false,
  children,
  ...props
}: GlassCardProps) {
  const variants = {
    default: 'glass',
    strong: 'glass-strong',
    brand: 'glass-brand',
  };
  return (
    <div
      className={cn(
        variants[variant],
        'rounded-3xl',
        glow && 'shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
