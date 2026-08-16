import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { decodeToken, initialsFor } from '../utils/postDisplay';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const payload = token ? decodeToken(token) : null;
  const isGuest = !!payload?.guest;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { label: 'All posts', path: '/posts' },
    { label: 'My posts', path: '/dashboard' },
    ...(isGuest ? [] : [{ label: 'Post an item', path: '/create-post' }]),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(30,58,52,0.94)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.14)',
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '18px 32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginRight: 'auto' }}>
          <Link
            to={token ? '/posts' : '/login'}
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: '-0.02em',
              color: '#F6F1E6',
              textDecoration: 'none',
            }}
          >
            Lost &amp; Found
          </Link>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#8FA79A',
            }}
          >
            Campus
          </span>
        </div>

        {token ? (
          <>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      padding: '8px 14px',
                      borderRadius: 999,
                      fontSize: 14,
                      fontWeight: 500,
                      background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                      color: active ? '#F6F1E6' : '#A9BDB2',
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                paddingLeft: 20,
                borderLeft: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              {isGuest && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#D9A24B',
                    border: '1px solid rgba(217,162,74,0.5)',
                    borderRadius: 999,
                    padding: '4px 9px',
                  }}
                >
                  Guest
                </span>
              )}
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: '#31507F',
                  color: '#EEF3FB',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {initialsFor(payload?.name)}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  border: 'none',
                  background: 'none',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: '#9FB6AA',
                  padding: 0,
                  margin: 0,
                }}
              >
                Sign out
              </button>
            </div>
          </>
        ) : (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                background: isActive('/login') ? 'rgba(255,255,255,0.14)' : 'transparent',
                color: isActive('/login') ? '#F6F1E6' : '#A9BDB2',
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                background: isActive('/signup') ? 'rgba(255,255,255,0.14)' : 'transparent',
                color: isActive('/signup') ? '#F6F1E6' : '#A9BDB2',
              }}
            >
              Signup
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
