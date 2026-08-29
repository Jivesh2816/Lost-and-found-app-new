export function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1] || ''));
  } catch {
    return null;
  }
}

export function isTokenValid(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  if (payload.exp && payload.exp < Date.now() / 1000) return false;
  return true;
}
