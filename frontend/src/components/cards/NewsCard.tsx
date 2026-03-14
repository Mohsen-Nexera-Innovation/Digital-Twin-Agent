import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, User } from 'lucide-react';
import type { Article } from '../../types/article';
import Badge from '../ui/Badge';
import { timeAgo } from '../../utils/formatDate';
import { getSourceClass } from '../../utils/sourceColors';

interface NewsCardProps {
  article: Article;
  index: number;
  onClick: (article: Article) => void;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Latest AI News':   'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.4) 100%)',
  'AI Agents':        'linear-gradient(135deg, rgba(59,130,246,0.5) 0%, rgba(99,102,241,0.4) 100%)',
  'Digital Twin':     'linear-gradient(135deg, rgba(20,184,166,0.5) 0%, rgba(16,185,129,0.4) 100%)',
  'Data Science':     'linear-gradient(135deg, rgba(234,179,8,0.5) 0%, rgba(245,158,11,0.4) 100%)',
  'Machine Learning': 'linear-gradient(135deg, rgba(239,68,68,0.5) 0%, rgba(249,115,22,0.4) 100%)',
};

const CATEGORY_LABELS: Record<string, string> = {
  'Latest AI News':   'AI',
  'AI Agents':        'AGENTS',
  'Digital Twin':     'DIGITAL\nTWIN',
  'Data Science':     'DATA',
  'Machine Learning': 'ML',
};

function ArticleImage({ article }: { article: Article }) {
  const [imgError, setImgError] = useState(false);
  const primaryCat = article.categories[0] || '';
  const gradient = CATEGORY_GRADIENTS[primaryCat] || 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.3) 100%)';
  const label = CATEGORY_LABELS[primaryCat] || primaryCat.slice(0, 6).toUpperCase();

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
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: gradient }}
    >
      <span className="text-white/25 font-black text-2xl tracking-widest whitespace-pre-line text-center leading-tight select-none">
        {label}
      </span>
    </div>
  );
}

export default function NewsCard({ article, index, onClick }: NewsCardProps) {
  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
      className="glass-card card-hover rounded-2xl flex flex-col cursor-pointer group relative overflow-hidden"
      onClick={() => onClick(article)}
    >
      {/* Hover glow overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

      {/* Article Image */}
      <div className="w-full h-36 overflow-hidden flex-shrink-0 rounded-t-2xl">
        <ArticleImage article={article} />
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Header: source + time */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${getSourceClass(article.source_name)}`}>
            {article.source_name}
          </span>
          <div className="flex items-center gap-1 text-slate-500 text-xs flex-shrink-0">
            <Clock size={11} />
            <span>{timeAgo(article.published_at || article.fetched_at)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-slate-100 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </h3>

        {/* Summary */}
        {article.summary && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 flex-1">
            {article.summary}
          </p>
        )}

        {/* Categories */}
        {article.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.categories.slice(0, 3).map(cat => (
              <Badge key={cat} label={cat} type="category" />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1 border-t border-white/5">
          {article.author ? (
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <User size={11} />
              <span className="truncate max-w-[120px]">{article.author}</span>
            </div>
          ) : <div />}
          <motion.button
            onClick={handleExternalClick}
            className="flex items-center gap-1 text-primary text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-secondary"
            whileHover={{ x: 2 }}
          >
            <ExternalLink size={12} />
            <span>Open</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
