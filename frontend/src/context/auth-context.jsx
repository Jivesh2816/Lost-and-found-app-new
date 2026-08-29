import { createContext, useEffect, useMemo, useState } from 'react';
import { decodeToken, isTokenValid } from '@/lib/jwt';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token');
    return stored && isTokenValid(stored) ? stored : null;
  });

  useEffect(() => {
    if (token && !isTokenValid(token)) {
      localStorage.removeItem('token');
      setToken(null);
    }
  }, [token]);

  const user = useMemo(() => (token ? decodeToken(token) : null), [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isGuest: Boolean(user?.guest),
      isAuthenticated: Boolean(user),
      login: (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
      },
      logout: () => {
        localStorage.removeItem('token');
        setToken(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
