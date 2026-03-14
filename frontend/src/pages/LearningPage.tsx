import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Clock, Layers } from 'lucide-react';
import { LEARNING_PATHS } from '../data/learningPaths';
import type { Difficulty, LearningPhase } from '../data/learningPaths';
import ResourceCard from '../components/learning/ResourceCard';

type DifficultyFilter = 'all' | Difficulty;

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner:     'text-green-400 bg-green-500/15 border-green-500/30',
  intermediate: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
  advanced:     'text-red-400 bg-red-500/15 border-red-500/30',
};

const CATEGORY_ACTIVE_COLOR: Record<string, string> = {
  'Data Science':     'bg-yellow-500/20 border-yellow-400/40 text-yellow-300',
  'Machine Learning': 'bg-red-500/20 border-red-400/40 text-red-300',
  'AI Agents':        'bg-blue-500/20 border-blue-400/40 text-blue-300',
  'Digital Twin':     'bg-teal-500/20 border-teal-400/40 text-teal-300',
};

const CATEGORY_UNDERLINE: Record<string, string> = {
  'Data Science':     'bg-yellow-400',
  'Machine Learning': 'bg-red-400',
  'AI Agents':        'bg-blue-400',
  'Digital Twin':     'bg-teal-400',
};

const PHASE_NUMBER_COLOR: Record<Difficulty, string> = {
  beginner:     'text-green-400 bg-green-500/15 border-green-500/30',
  intermediate: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
  advanced:     'text-red-400 bg-red-500/15 border-red-500/30',
};

interface PhaseBlockProps {
  phase: LearningPhase;
  difficultyFilter: DifficultyFilter;
  categoryName: string;
  globalIndex: number;
}

function PhaseBlock({ phase, difficultyFilter, globalIndex }: PhaseBlockProps) {
  const [expanded, setExpanded] = useState(true);

  const filteredResources = phase.resources.filter(r =>
    difficultyFilter === 'all' || r.difficulty === difficultyFilter
  );

  if (filteredResources.length === 0) return null;

  const numColor = PHASE_NUMBER_COLOR[phase.difficulty];
  const diffColor = DIFFICULTY_COLORS[phase.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: globalIndex * 0.06, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card rounded-2xl overflow-hidden border border-white/5"
    >
      {/* Phase header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-white/2 transition-colors group"
      >
        {/* Phase number bubble */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm ${numColor}`}>
          {phase.phaseNumber}
        </div>

        {/* Phase text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-slate-100 font-bold text-base leading-tight">
              {phase.title}
            </h3>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${diffColor}`}>
              {phase.difficulty.charAt(0).toUpperCase() + phase.difficulty.slice(1)}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">{phase.subtitle}</p>
        </div>

        {/* Resource count + toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden sm:inline text-xs text-slate-500">
            {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
          </span>
          <motion.div
            animate={{ rotate: expanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
            className="text-slate-500 group-hover:text-slate-300 transition-colors"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </motion.div>
        </div>
      </button>

      {/* Narrative + resources */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="phase-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 flex flex-col gap-5">
              {/* Narrative */}
              <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-primary/40 pl-4 italic">
                {phase.narrative}
              </p>

              {/* Resources grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredResources.map((resource, idx) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LearningPage() {
  const [activeCategory, setActiveCategory] = useState(LEARNING_PATHS[0].category);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const tabsRef = useRef<HTMLDivElement>(null);

  const currentPath = LEARNING_PATHS.find(p => p.category === activeCategory) ?? LEARNING_PATHS[0];

  const filteredPhases = currentPath.phases.filter(phase =>
    difficultyFilter === 'all' || phase.difficulty === difficultyFilter
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setDifficultyFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">

      {/* ── Hero ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col gap-3"
      >
        <div className="inline-flex items-center gap-2 mx-auto px-4 py-1.5 rounded-full glass-card border border-primary/20 text-xs text-primary font-medium">
          <BookOpen size={13} />
          Learning Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-black gradient-text leading-tight">
          Your AI Learning Journey
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          From Zero to Expert — curated paths across AI Agents, Digital Twins, Data Science, and Machine Learning.
        </p>
      </motion.div>

      {/* ── Category tabs ─────────────────────────────────── */}
      <div ref={tabsRef} className="flex flex-col gap-1">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {LEARNING_PATHS.map(path => {
            const isActive = path.category === activeCategory;
            const activeColor = CATEGORY_ACTIVE_COLOR[path.category] || 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300';
            return (
              <motion.button
                key={path.category}
                onClick={() => handleCategoryChange(path.category)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  isActive ? activeColor : 'glass-card text-slate-400 border-white/5 hover:text-slate-200 hover:border-white/15'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{path.icon}</span>
                <span>{path.category}</span>
                {isActive && (
                  <motion.div
                    layoutId="tab-underline"
                    className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${CATEGORY_UNDERLINE[path.category] || 'bg-indigo-400'}`}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Category info card ────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <div className="text-5xl select-none">{currentPath.icon}</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-100">{currentPath.tagline}</h2>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">{currentPath.description}</p>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1 text-primary">
                <Layers size={14} />
                <span className="text-lg font-bold text-slate-100">{currentPath.phases.length}</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide">Phases</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1 text-primary">
                <BookOpen size={14} />
                <span className="text-lg font-bold text-slate-100">{currentPath.totalResources}</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide">Resources</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1 text-primary">
                <Clock size={14} />
                <span className="text-lg font-bold text-slate-100">{currentPath.estimatedHours}h</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide">Total</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Difficulty filter pills ───────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => {
          const isActive = difficultyFilter === level;
          const colorMap: Record<string, string> = {
            all:          isActive ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300' : '',
            beginner:     isActive ? 'bg-green-500/20 border-green-400/40 text-green-300' : '',
            intermediate: isActive ? 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300' : '',
            advanced:     isActive ? 'bg-red-500/20 border-red-400/40 text-red-300' : '',
          };
          return (
            <motion.button
              key={level}
              onClick={() => setDifficultyFilter(level)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                isActive
                  ? colorMap[level]
                  : 'glass-card text-slate-400 border-white/5 hover:text-slate-200 hover:border-white/15'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
            </motion.button>
          );
        })}
      </div>

      {/* ── Phases ───────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + difficultyFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          {filteredPhases.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-slate-500 text-sm">
              No phases match the selected difficulty filter.
            </div>
          ) : (
            filteredPhases.map((phase, idx) => (
              <PhaseBlock
                key={phase.id}
                phase={phase}
                difficultyFilter={difficultyFilter}
                categoryName={activeCategory}
                globalIndex={idx}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
