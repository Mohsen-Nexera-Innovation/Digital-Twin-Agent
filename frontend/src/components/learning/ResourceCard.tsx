import { motion } from 'framer-motion';
import { ExternalLink, Clock, Play, FileText, GraduationCap, Code2, BookOpen } from 'lucide-react';
import type { LearningResource, Difficulty, ResourceType } from '../../data/learningPaths';
import VideoEmbed from './VideoEmbed';

interface ResourceCardProps {
  resource: LearningResource;
  index: number;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  'AI Agents':        'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(99,102,241,0.2) 100%)',
  'Digital Twin':     'linear-gradient(135deg, rgba(20,184,166,0.3) 0%, rgba(16,185,129,0.2) 100%)',
  'Data Science':     'linear-gradient(135deg, rgba(234,179,8,0.3) 0%, rgba(245,158,11,0.2) 100%)',
  'Machine Learning': 'linear-gradient(135deg, rgba(239,68,68,0.3) 0%, rgba(249,115,22,0.2) 100%)',
};

const CATEGORY_ACCENT: Record<string, string> = {
  'AI Agents':        'border-blue-500/30',
  'Digital Twin':     'border-teal-500/30',
  'Data Science':     'border-yellow-500/30',
  'Machine Learning': 'border-red-500/30',
};

const TYPE_CONFIG: Record<ResourceType, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  video:         { icon: <Play size={12} fill="currentColor" />,      label: 'Video',    color: 'text-red-400',    bg: 'bg-red-500/15 border-red-500/25' },
  article:       { icon: <FileText size={12} />,                      label: 'Article',  color: 'text-blue-400',   bg: 'bg-blue-500/15 border-blue-500/25' },
  course:        { icon: <GraduationCap size={12} />,                 label: 'Course',   color: 'text-green-400',  bg: 'bg-green-500/15 border-green-500/25' },
  tutorial:      { icon: <Code2 size={12} />,                         label: 'Tutorial', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/25' },
  documentation: { icon: <BookOpen size={12} />,                      label: 'Docs',     color: 'text-slate-400',  bg: 'bg-slate-500/15 border-slate-500/25' },
};

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string }> = {
  beginner:     { label: 'Beginner',     color: 'text-green-400',  bg: 'bg-green-500/15 border-green-500/25' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/25' },
  advanced:     { label: 'Advanced',     color: 'text-red-400',    bg: 'bg-red-500/15 border-red-500/25' },
};

export default function ResourceCard({ resource, index }: ResourceCardProps) {
  const typeConf = TYPE_CONFIG[resource.type];
  const diffConf = DIFFICULTY_CONFIG[resource.difficulty];
  const accentBorder = CATEGORY_ACCENT[resource.category] || 'border-indigo-500/30';
  const cardGradient = CATEGORY_GRADIENTS[resource.category] || 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)';

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      className={`glass-card rounded-2xl flex flex-col overflow-hidden border ${accentBorder} group card-hover relative`}
    >
      {/* Top accent gradient strip */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: cardGradient.replace('0.3', '0.8').replace('0.2', '0.6') }} />

      {/* Video embed */}
      {resource.youtubeId && (
        <div className="w-full flex-shrink-0">
          <VideoEmbed youtubeId={resource.youtubeId} title={resource.title} />
        </div>
      )}

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type badge */}
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${typeConf.color} ${typeConf.bg}`}>
            {typeConf.icon}
            {typeConf.label}
          </span>
          {/* Difficulty badge */}
          <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md border ${diffConf.color} ${diffConf.bg}`}>
            {diffConf.label}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-slate-100 font-semibold text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">
          {resource.title}
        </h4>

        {/* Source */}
        <p className="text-xs font-medium text-primary/80">{resource.source}</p>

        {/* Description */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 flex-1">
          {resource.description}
        </p>

        {/* Tags */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: duration + open link */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
          {resource.durationMinutes ? (
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <Clock size={11} />
              <span>{resource.durationMinutes >= 60
                ? `${Math.floor(resource.durationMinutes / 60)}h ${resource.durationMinutes % 60 > 0 ? `${resource.durationMinutes % 60}m` : ''}`
                : `${resource.durationMinutes}m`}
              </span>
            </div>
          ) : <div />}

          <motion.button
            onClick={handleExternalClick}
            className="flex items-center gap-1 text-primary text-xs hover:text-secondary transition-colors"
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
