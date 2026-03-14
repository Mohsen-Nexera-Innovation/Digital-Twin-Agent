import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Clock, User } from 'lucide-react';
import type { Article } from '../../types/article';
import Badge from '../ui/Badge';
import { formatDate, timeAgo } from '../../utils/formatDate';
import { getSourceClass } from '../../utils/sourceColors';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {article && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-card rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto relative glow-border">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white z-10"
              >
                <X size={16} />
              </button>

              {/* Source + Date */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${getSourceClass(article.source_name)}`}>
                  {article.source_name}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock size={11} />
                  {formatDate(article.published_at)} · {timeAgo(article.published_at)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white leading-tight mb-4 pr-8">
                {article.title}
              </h2>

              {/* Author */}
              {article.author && (
                <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
                  <User size={13} />
                  <span>{article.author}</span>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-white/10 mb-4" />

              {/* AI Summary */}
              {article.summary && (
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Summary</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">{article.summary}</p>
                </div>
              )}

              {/* Original content snippet */}
              {article.content && !article.summary && (
                <div className="mb-5">
                  <p className="text-slate-300 text-sm leading-relaxed">{article.content}</p>
                </div>
              )}

              {/* Categories */}
              {article.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.categories.map(cat => <Badge key={cat} label={cat} type="category" />)}
                </div>
              )}

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {article.tags.slice(0, 8).map(tag => <Badge key={tag} label={tag} type="tag" />)}
                </div>
              )}

              {/* Read Original */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 hover:border-primary/50 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                <ExternalLink size={14} />
                Read Original Article
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
