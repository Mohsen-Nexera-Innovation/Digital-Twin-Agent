import { motion } from 'framer-motion';

export default function NewsCardSkeleton() {
  return (
    <motion.div
      className="glass-card rounded-2xl p-5 flex flex-col gap-3"
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 rounded bg-white/10" />
        <div className="h-4 w-16 rounded bg-white/10" />
      </div>
      <div className="space-y-2">
        <div className="h-4 rounded bg-white/10 w-full" />
        <div className="h-4 rounded bg-white/10 w-4/5" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 rounded bg-white/5 w-full" />
        <div className="h-3 rounded bg-white/5 w-full" />
        <div className="h-3 rounded bg-white/5 w-2/3" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-16 rounded-full bg-white/10" />
        <div className="h-5 w-20 rounded-full bg-white/10" />
      </div>
    </motion.div>
  );
}
