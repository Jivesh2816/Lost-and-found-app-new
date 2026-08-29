// Display helpers for posts — status tag colors, category colors, and
// human-friendly formatting. Ported from the pre-rewrite app; colors are
// re-themed for the black/gold campus palette and expressed as Tailwind-safe
// tokens (className + inline CSS vars) instead of raw hex objects, so they
// can be handed straight to <StatusBadge>/<CategoryChip>.

export const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Others'];

export const BUILDINGS = ['SLC', 'MC', 'DC', 'DP', 'E5', 'PAC'];

export const STATUS_META = {
  lost: {
    label: 'Lost',
    dot: 'bg-amber-500',
    badge: 'border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400',
    card: 'border-amber-500/20 bg-amber-500/[0.04]',
  },
  found: {
    label: 'Found',
    dot: 'bg-emerald-500',
    badge: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    card: 'border-emerald-500/20 bg-emerald-500/[0.04]',
  },
  returned: {
    label: 'Returned',
    dot: 'bg-muted-foreground',
    badge: 'border-border bg-muted text-muted-foreground',
    card: 'border-border bg-muted/30',
  },
};

export function statusMeta(status) {
  return STATUS_META[status] || {
    label: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown',
    dot: 'bg-muted-foreground',
    badge: 'border-border bg-muted text-muted-foreground',
    card: 'border-border bg-muted/30',
  };
}

const CATEGORY_CLASSES = {
  Electronics: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-400',
  Books: 'border-orange-500/25 bg-orange-500/10 text-orange-700 dark:text-orange-400',
  Clothing: 'border-pink-500/25 bg-pink-500/10 text-pink-700 dark:text-pink-400',
  Accessories: 'border-lime-500/25 bg-lime-500/10 text-lime-700 dark:text-lime-400',
  Documents: 'border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-400',
  Keys: 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400',
  Others: 'border-teal-500/25 bg-teal-500/10 text-teal-700 dark:text-teal-400',
};

export function categoryClass(category) {
  return CATEGORY_CLASSES[category] || 'border-border bg-muted text-muted-foreground';
}

export function timeAgo(date) {
  if (!date) return '';
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

export function truncate(text, len = 118) {
  if (!text) return '';
  return text.length > len ? `${text.slice(0, len).trim()}…` : text;
}

export function initialsFor(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase() || '?';
}
