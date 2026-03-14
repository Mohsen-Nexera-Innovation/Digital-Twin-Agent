import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
  disabled?: boolean;
}

export default function GlowButton({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false }: GlowButtonProps) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer border';
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm' };
  const variants = {
    primary: 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    ghost: 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20',
  };

  return (
    <motion.button
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
