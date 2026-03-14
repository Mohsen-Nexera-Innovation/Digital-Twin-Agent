import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useSearch } from '../../hooks/useSearch';
import type { Article } from '../../types/article';
import { timeAgo } from '../../utils/formatDate';

interface SearchBarProps {
  onArticleSelect: (article: Article) => void;
}

export default function SearchBar({ onArticleSelect }: SearchBarProps) {
  const { searchQuery, isSearchOpen, setSearchQuery, setIsSearchOpen } = useUIStore();
  const { results, isLoading } = useSearch(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus();
  }, [isSearchOpen]);

  const handleSelect = (article: Article) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onArticleSelect(article);
  };

  return (
    <div className="relative">
      <motion.div
        className={`flex items-center gap-2 glass-card rounded-xl px-3 py-2 border transition-colors duration-200 ${
          isSearchOpen ? 'border-primary/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'border-white/10'
        }`}
        animate={{ width: isSearchOpen ? 320 : 200 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        {isLoading ? (
          <Loader2 size={15} className="text-slate-400 animate-spin flex-shrink-0" />
        ) : (
          <Search size={15} className="text-slate-400 flex-shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search AI news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchOpen(true)}
          className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none flex-1 min-w-0"
        />
        {searchQuery && (
          <button onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}>
            <X size={13} className="text-slate-500 hover:text-slate-300" />
          </button>
        )}
      </motion.div>

      {/* Dropdown results */}
      <AnimatePresence>
        {isSearchOpen && searchQuery.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 z-50 glass-card rounded-xl border border-white/10 overflow-hidden shadow-xl"
            style={{ minWidth: 320 }}
          >
            {results.length === 0 && !isLoading ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {results.slice(0, 8).map(article => (
                  <button
                    key={article.id}
                    onClick={() => handleSelect(article)}
                    className="w-full flex flex-col gap-0.5 px-4 py-3 hover:bg-white/5 text-left border-b border-white/5 last:border-0 transition-colors"
                  >
                    <span className="text-sm text-slate-200 line-clamp-1">{article.title}</span>
                    <span className="text-xs text-slate-500">{article.source_name} · {timeAgo(article.published_at)}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
