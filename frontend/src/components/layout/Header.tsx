import { motion } from 'framer-motion';
import { Brain, RefreshCw, Rss, MessageCircle, BookOpen, Newspaper } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import SearchBar from '../search/SearchBar';
import Spinner from '../ui/Spinner';
import { useUIStore } from '../../store/uiStore';
import { adminApi } from '../../api/admin';
import type { Article } from '../../types/article';

interface HeaderProps {
  onArticleSelect: (article: Article) => void;
}

export default function Header({ onArticleSelect }: HeaderProps) {
  const { isFetching, setIsFetching, isChatOpen, setIsChatOpen, currentView, setCurrentView } = useUIStore();

  const handleRefresh = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      await adminApi.triggerFetch();
      setTimeout(() => setIsFetching(false), 3000);
    } catch {
      setIsFetching(false);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 glass-card border-b border-white/5 px-6 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
          >
            <Brain size={26} className="text-primary" style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.6))' }} />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold gradient-text leading-none">AI News Agent</h1>
            <p className="text-[10px] text-slate-500 leading-tight">Daily AI Intelligence</p>
          </div>
        </div>

        {/* Nav toggle: News / Learn */}
        <div className="hidden sm:flex items-center gap-1 glass-card rounded-xl border border-white/5 p-1">
          <button
            onClick={() => setCurrentView('news')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              currentView === 'news'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Newspaper size={13} />
            News Feed
          </button>
          <button
            onClick={() => setCurrentView('learning')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              currentView === 'learning'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={13} />
            Learning Hub
          </button>
        </div>

        {/* Search — only on news view */}
        {currentView === 'news' && (
          <div className="flex-1 flex justify-center max-w-md">
            <SearchBar onArticleSelect={onArticleSelect} />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {currentView === 'news' && (
            <>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <Rss size={12} className="text-primary" />
                <span>Live Feed</span>
              </div>
              <GlowButton
                onClick={() => setIsChatOpen(!isChatOpen)}
                size="sm"
                variant={isChatOpen ? 'primary' : 'ghost'}
              >
                <MessageCircle size={14} />
                <span className="hidden sm:inline">Ask AI</span>
              </GlowButton>
              <GlowButton onClick={handleRefresh} disabled={isFetching} size="sm">
                {isFetching ? <Spinner size={14} /> : <RefreshCw size={14} />}
                <span className="hidden sm:inline">{isFetching ? 'Fetching...' : 'Refresh'}</span>
              </GlowButton>
            </>
          )}

          {/* Mobile: Learn toggle button */}
          <div className="sm:hidden">
            <GlowButton
              onClick={() => setCurrentView(currentView === 'news' ? 'learning' : 'news')}
              size="sm"
              variant={currentView === 'learning' ? 'primary' : 'ghost'}
            >
              {currentView === 'learning' ? <Newspaper size={14} /> : <BookOpen size={14} />}
            </GlowButton>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
