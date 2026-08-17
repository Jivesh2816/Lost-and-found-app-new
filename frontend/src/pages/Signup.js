import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address';
    else if (!email.trim().toLowerCase().endsWith('@uwaterloo.ca')) errors.email = 'Must be a @uwaterloo.ca email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Must be at least 8 characters';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://lost-and-found-app-new.vercel.app';

      const res = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Account created! Redirecting...');
        setTimeout(() => {
          navigate('/posts');
        }, 1000);
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--color-page-bg)' }}>
      <main
        className="container fade-in"
        style={{
          maxWidth: 940,
          padding: '72px 32px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 64,
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: 42, lineHeight: 1.08, margin: '0 0 16px', maxWidth: '16ch', color: '#F6F1E6' }}>
            Sign in to claim or post
          </h1>
          <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.6, color: '#B9CBC1', maxWidth: '42ch' }}>
            Browsing is open to everyone. An account is only needed to post an item or message a poster, so people
            can be reached back.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderTop: '5px solid var(--color-accent)',
            borderRadius: 24,
            padding: 32,
            display: 'grid',
            gap: 16,
          }}
        >
          <label className="field" htmlFor="name" style={{ display: 'grid', gap: 8, marginBottom: 0 }}>
            Full name
            <input
              id="name"
              type="text"
              className={fieldErrors.name ? 'invalid' : ''}
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </label>

          <label className="field" htmlFor="email" style={{ display: 'grid', gap: 8, marginBottom: 0 }}>
            School email
            <input
              id="email"
              type="email"
              placeholder="you@uwaterloo.ca"
              className={fieldErrors.email ? 'invalid' : ''}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </label>

          <label className="field" htmlFor="password" style={{ display: 'grid', gap: 8, marginBottom: 0 }}>
            Password
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={fieldErrors.password ? 'invalid' : ''}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {fieldErrors.password ? (
              <span className="field-error">{fieldErrors.password}</span>
            ) : (
              <span className="form-hint" style={{ marginBottom: 0 }}>At least 8 characters</span>
            )}
          </label>

          <button type="submit" disabled={submitting} style={{ width: '100%', marginTop: 4 }}>
            {submitting && <span className="btn-spinner" />}
            {submitting ? 'Creating account...' : 'Create account'}
          </button>

          {message && (
            <p
              className="text-center"
              style={{ margin: 0, fontSize: 13.5, color: message.includes('created') ? 'var(--color-success)' : 'var(--color-danger)' }}
            >
              {message}
            </p>
          )}

          <p style={{ margin: 0, textAlign: 'center', fontSize: 13.5, color: '#8A7C6E' }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Signup;
