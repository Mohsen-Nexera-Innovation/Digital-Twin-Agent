import { create } from 'zustand';
import type { Article } from '../types/article';

export type AppView = 'news' | 'learning';

interface UIStore {
  activeCategory: string | null;
  activeSource: string | null;
  selectedArticle: Article | null;
  searchQuery: string;
  isSearchOpen: boolean;
  isFetching: boolean;
  isChatOpen: boolean;
  currentView: AppView;
  setActiveCategory: (cat: string | null) => void;
  setActiveSource: (src: string | null) => void;
  setSelectedArticle: (article: Article | null) => void;
  setSearchQuery: (q: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsFetching: (fetching: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  setCurrentView: (view: AppView) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeCategory: null,
  activeSource: null,
  selectedArticle: null,
  searchQuery: '',
  isSearchOpen: false,
  isFetching: false,
  isChatOpen: false,
  currentView: 'learning',
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  setActiveSource: (src) => set({ activeSource: src }),
  setSelectedArticle: (article) => set({ selectedArticle: article }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),
  setIsFetching: (fetching) => set({ isFetching: fetching }),
  setIsChatOpen: (open) => set({ isChatOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),
}));
