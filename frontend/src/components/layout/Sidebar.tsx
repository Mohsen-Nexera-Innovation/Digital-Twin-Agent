import { motion } from 'framer-motion';
import { Activity, Filter } from 'lucide-react';
import TrendingTopics from '../trending/TrendingTopics';
import type { TrendingTopic, Source } from '../../types/article';

interface SidebarProps {
  trending: TrendingTopic[];
  sources: Source[];
  activeSource: string | null;
  onSourceSelect: (src: string | null) => void;
}

export default function Sidebar({ trending, sources, activeSource, onSourceSelect }: SidebarProps) {
  const activeSources = sources.filter(s => s.enabled);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col gap-4"
    >
      {/* Trending Topics */}
      <TrendingTopics topics={trending} />

      {/* Source Filter */}
      {activeSources.length > 0 && (
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-accent" />
            <h3 className="text-sm font-semibold text-slate-200">Sources</h3>
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onSourceSelect(null)}
              className={`text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                activeSource === null ? 'text-primary bg-primary/10' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              All Sources
            </button>
            {activeSources.map(src => (
              <button
                key={src.id}
                onClick={() => onSourceSelect(src.name === activeSource ? null : src.name)}
                className={`text-left text-xs px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between group ${
                  activeSource === src.name ? 'text-primary bg-primary/10' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <span>{src.name}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${src.type === 'rss' ? 'bg-green-500' : src.type === 'arxiv' ? 'bg-cyan-500' : src.type === 'reddit' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live indicator */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-green-400" />
          <span className="text-sm font-semibold text-slate-200">Feed Status</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-green-400">Live — Updates daily at 7 AM</span>
        </div>
      </div>
    </motion.aside>
  );
}
