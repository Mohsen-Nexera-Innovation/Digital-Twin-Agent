import { getCategoryColor } from '../../utils/categoryColors';

interface BadgeProps {
  label: string;
  type?: 'category' | 'tag' | 'source';
  className?: string;
}

export default function Badge({ label, type = 'category', className = '' }: BadgeProps) {
  if (type === 'category') {
    const colors = getCategoryColor(label);
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}
        style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
      >
        {label}
      </span>
    );
  }

  if (type === 'tag') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-400 bg-white/5 border border-white/10 ${className}`}>
        #{label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-300 bg-white/5 ${className}`}>
      {label}
    </span>
  );
}
