import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NeuralBackground from './components/particles/NeuralBackground';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import LearningPage from './pages/LearningPage';
import ChatPanel from './components/chat/ChatPanel';
import { useUIStore } from './store/uiStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const setSelectedArticle = useUIStore(s => s.setSelectedArticle);
  const currentView = useUIStore(s => s.currentView);

  return (
    <div className="animated-gradient min-h-screen">
      <NeuralBackground />
      <div className="relative z-10">
        <Header onArticleSelect={setSelectedArticle} />
        {currentView === 'news' ? <HomePage /> : <LearningPage />}
      </div>
      {currentView === 'news' && <ChatPanel onArticleSelect={setSelectedArticle} />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
