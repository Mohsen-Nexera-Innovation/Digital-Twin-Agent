import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import type { TrendingTopic } from '../../types/article';
import { useUIStore } from '../../store/uiStore';

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

export default function TrendingTopics({ topics }: TrendingTopicsProps) {
  const setSearchQuery = useUIStore(s => s.setSearchQuery);
  const setIsSearchOpen = useUIStore(s => s.setIsSearchOpen);

  const handleTopicClick = (topic: string) => {
    setSearchQuery(topic);
    setIsSearchOpen(true);
  };

  if (topics.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-slate-200">Trending Today</h3>
      </div>
      <div className="flex flex-col gap-1.5">
        {topics.slice(0, 12).map((topic, i) => (
          <motion.button
            key={topic.topic}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleTopicClick(topic.topic)}
            className="flex items-center justify-between group px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-4">{i + 1}</span>
              <span className="text-sm text-slate-300 group-hover:text-primary transition-colors capitalize">
                {topic.topic}
              </span>
            </div>
            <span className="text-xs text-slate-600">{topic.count}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
