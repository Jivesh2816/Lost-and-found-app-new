// Status tag colors, matching the Lost & Found design system.
export const tagFor = (status) => {
  if (status === 'lost') {
    return { tagFg: '#8A4A16', tagBg: '#F7E3BE', tagLine: '#E0C48D', cardBg: '#FBF1DA', cardLine: '#EBD9AE', statusLabel: 'Lost' };
  }
  if (status === 'found') {
    return { tagFg: '#2F5F49', tagBg: '#D8E8DC', tagLine: '#B4CFBC', cardBg: '#E9F1E4', cardLine: '#C9DCC4', statusLabel: 'Found' };
  }
  return { tagFg: '#4A403A', tagBg: '#E9E2D6', tagLine: '#D8CDBB', cardBg: '#F3EDE3', cardLine: '#E2D7C6', statusLabel: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown' };
};

export const categoryColors = {
  Electronics: { bg: '#E3EAF6', fg: '#31507F' },
  Books: { bg: '#F6E7CF', fg: '#7A5518' },
  Clothing: { bg: '#F3E1EC', fg: '#7A3D62' },
  Accessories: { bg: '#E7EDE2', fg: '#41633C' },
  Documents: { bg: '#EDE6F6', fg: '#553F7E' },
  Keys: { bg: '#FBE6D8', fg: '#8E4A22' },
  Others: { bg: '#E6EEEF', fg: '#2F5C60' },
};

export const categoryColorFor = (category) => categoryColors[category] || { bg: '#F3EDE3', fg: '#6B5F54' };

export const timeAgo = (date) => {
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
};

export const truncate = (text, len = 118) => {
  if (!text) return '';
  return text.length > len ? `${text.slice(0, len).trim()}…` : text;
};

export const BUILDINGS = ['SLC', 'MC', 'DC', 'DP', 'E5', 'PAC'];

export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1] || ''));
  } catch (_) {
    return null;
  }
};

export const initialsFor = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase() || '?';
};
