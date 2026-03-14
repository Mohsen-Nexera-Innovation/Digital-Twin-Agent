import { motion } from 'framer-motion';
import type { Category } from '../../types/article';

interface CategoryPillsProps {
  categories: Category[];
  active: string | null;
  onSelect: (cat: string | null) => void;
}

export default function CategoryPills({ categories, active, onSelect }: CategoryPillsProps) {
  const all = [{ name: 'All', count: categories.reduce((s, c) => s + c.count, 0) }, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {all.map((cat) => {
        const isActive = (cat.name === 'All' && active === null) || active === cat.name;
        return (
          <motion.button
            key={cat.name}
            onClick={() => onSelect(cat.name === 'All' ? null : cat.name)}
            className="relative flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
            style={{
              background: isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
              color: isActive ? '#a5b4fc' : '#94a3b8',
              border: `1px solid ${isActive ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isActive && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 rounded-full bg-primary/10"
                style={{ boxShadow: '0 0 15px rgba(99,102,241,0.3)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{cat.name}</span>
            {cat.count > 0 && (
              <span className="relative text-xs opacity-60">{cat.count}</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
