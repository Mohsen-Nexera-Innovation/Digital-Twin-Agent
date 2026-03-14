import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, AlertCircle } from 'lucide-react';
import { useArticles, useFeaturedArticles } from '../hooks/useArticles';
import { useCategories } from '../hooks/useCategories';
import { useTrending } from '../hooks/useTrending';
import { useSources } from '../hooks/useSources';
import { useUIStore } from '../store/uiStore';
import NewsCard from '../components/cards/NewsCard';
import NewsCardSkeleton from '../components/cards/NewsCardSkeleton';
import FeaturedCard from '../components/cards/FeaturedCard';
import CategoryPills from '../components/filters/CategoryPills';
import ArticleModal from '../components/modal/ArticleModal';
import Sidebar from '../components/layout/Sidebar';
import GlowButton from '../components/ui/GlowButton';
import type { Article } from '../types/article';

const PAGE_SIZE = 18;

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { activeCategory, activeSource, selectedArticle, setActiveCategory, setActiveSource, setSelectedArticle } = useUIStore();

  const articlesQuery = useArticles({ page, limit: PAGE_SIZE, category: activeCategory, source: activeSource });
  const featuredQuery = useFeaturedArticles();
  const categoriesQuery = useCategories();
  const trendingQuery = useTrending();
  const sourcesQuery = useSources();

  const articles = articlesQuery.data?.data || [];
  const meta = articlesQuery.data?.meta;
  const featured = featuredQuery.data?.data?.[0];
  const categories = categoriesQuery.data?.data || [];
  const trending = trendingQuery.data?.data || [];
  const sources = sourcesQuery.data?.data || [];

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSourceChange = (src: string | null) => {
    setActiveSource(src);
    setPage(1);
  };

  return (
    <div className="relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Main content */}
          <main className="flex-1 min-w-0 flex flex-col gap-6">
            {/* Featured article */}
            <AnimatePresence>
              {!activeCategory && !activeSource && featured && (
                <FeaturedCard article={featured} onClick={setSelectedArticle} />
              )}
            </AnimatePresence>

            {/* Category filters */}
            {categories.length > 0 && (
              <CategoryPills
                categories={categories}
                active={activeCategory}
                onSelect={handleCategoryChange}
              />
            )}

            {/* Section title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper size={16} className="text-primary" />
                <h2 className="text-slate-200 font-semibold text-sm">
                  {activeCategory ? `${activeCategory} News` : 'Latest AI News'}
                  {meta && <span className="text-slate-500 font-normal ml-2">({meta.total} articles)</span>}
                </h2>
              </div>
            </div>

            {/* Error state */}
            {articlesQuery.isError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 py-16 text-center"
              >
                <AlertCircle size={40} className="text-red-400 opacity-60" />
                <p className="text-slate-400">Failed to load articles. Make sure the backend is running.</p>
                <GlowButton onClick={() => articlesQuery.refetch()}>Retry</GlowButton>
              </motion.div>
            )}

            {/* Loading skeletons */}
            {articlesQuery.isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => <NewsCardSkeleton key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!articlesQuery.isLoading && !articlesQuery.isError && articles.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 py-16 text-center"
              >
                <div className="text-5xl">🤖</div>
                <p className="text-slate-300 font-medium">No articles yet</p>
                <p className="text-slate-500 text-sm">The agent is fetching the latest AI news. Check back soon!</p>
              </motion.div>
            )}

            {/* News grid */}
            {articles.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {articles.map((article: Article, i: number) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      index={i}
                      onClick={setSelectedArticle}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {meta && (
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <GlowButton
                      variant="ghost"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </GlowButton>
                    <span className="text-sm text-slate-400">
                      Page {page} of {Math.ceil(meta.total / PAGE_SIZE)}
                    </span>
                    <GlowButton
                      variant="ghost"
                      onClick={() => setPage(p => p + 1)}
                      disabled={!meta.hasMore}
                    >
                      Next
                    </GlowButton>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <Sidebar
                trending={trending}
                sources={sources}
                activeSource={activeSource}
                onSourceSelect={handleSourceChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Article Modal */}
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}
