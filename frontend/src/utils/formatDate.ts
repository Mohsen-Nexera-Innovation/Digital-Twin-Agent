import { formatDistanceToNow, format, parseISO } from 'date-fns';

export function timeAgo(dateStr?: string): string {
  if (!dateStr) return 'Unknown date';
  try {
    const date = parseISO(dateStr);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown date';
  }
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return '';
  }
}
