import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Zap, Clock } from 'lucide-react';
import type { Article } from '../../types/article';
import Badge from '../ui/Badge';
import { timeAgo } from '../../utils/formatDate';

interface FeaturedCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Latest AI News':   'linear-gradient(135deg, rgba(99,102,241,0.6) 0%, rgba(139,92,246,0.5) 100%)',
  'AI Agents':        'linear-gradient(135deg, rgba(59,130,246,0.6) 0%, rgba(99,102,241,0.5) 100%)',
  'Digital Twin':     'linear-gradient(135deg, rgba(20,184,166,0.6) 0%, rgba(16,185,129,0.5) 100%)',
  'Data Science':     'linear-gradient(135deg, rgba(234,179,8,0.6) 0%, rgba(245,158,11,0.5) 100%)',
  'Machine Learning': 'linear-gradient(135deg, rgba(239,68,68,0.6) 0%, rgba(249,115,22,0.5) 100%)',
};

function FeaturedImage({ article }: { article: Article }) {
  const [imgError, setImgError] = useState(false);
  const primaryCat = article.categories[0] || '';
  const gradient = CATEGORY_GRADIENTS[primaryCat] || 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.4) 100%)';

  if (article.image_url && !imgError) {
    return (
      <img
        src={article.image_url}
        alt={article.title}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="w-full h-full" style={{ background: gradient }}>
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-white/20 font-black text-5xl tracking-widest select-none">
          {primaryCat ? primaryCat.toUpperCase().slice(0, 2) : 'AI'}
        </span>
      </div>
    </div>
  );
}

export default function FeaturedCard({ article, onClick }: FeaturedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.01 }}
      className="relative glass-card rounded-2xl cursor-pointer overflow-hidden group glow-border"
      onClick={() => onClick(article)}
    >
      {/* Image */}
      <div className="w-full h-52 overflow-hidden">
        <FeaturedImage article={article} />
      </div>

      {/* Gradient overlay on image bottom */}
      <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative p-6">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />

        {/* Featured badge */}
        <div className="relative flex items-center gap-2 mb-3">
          <motion.div
            className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 rounded-full px-3 py-1"
            animate={{ boxShadow: ['0 0 10px rgba(99,102,241,0.3)', '0 0 20px rgba(99,102,241,0.6)', '0 0 10px rgba(99,102,241,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap size={12} className="text-primary" />
            <span className="text-primary text-xs font-semibold">Top Story</span>
          </motion.div>
          <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(article.published_at)}
          </span>
        </div>

        {/* Title */}
        <h2 className="relative text-xl font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors duration-200">
          {article.title}
        </h2>

        {/* Summary */}
        {article.summary && (
          <p className="relative text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {article.summary}
          </p>
        )}

        {/* Footer */}
        <div className="relative flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {article.categories.slice(0, 3).map(cat => (
              <Badge key={cat} label={cat} />
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>{article.source_name}</span>
            <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
