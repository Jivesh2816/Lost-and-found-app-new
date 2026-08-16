import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUILDINGS, decodeToken } from '../utils/postDisplay';

const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Others'];

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    building: '',
    otherLocation: '',
    status: 'lost',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('token');
  const isGuest = !!(token && decodeToken(token)?.guest);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const location = formData.building === 'Somewhere else' ? formData.otherLocation : formData.building;

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.category) errors.category = 'Pick a category';
    if (!formData.building) errors.building = 'Pick a building';
    if (formData.building === 'Somewhere else' && !formData.otherLocation.trim()) {
      errors.otherLocation = 'Tell us where';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to create a post.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://lost-and-found-app-new.vercel.app'}/api/post`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location,
          status: formData.status,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        navigate('/posts');
      } else {
        if (res.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        setMessage(result.message || 'Failed to create post.');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'lost', label: 'Something I lost' },
    { value: 'found', label: 'Something I found' },
  ];

  if (isGuest) {
    return (
      <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--color-page-bg)', display: 'grid', placeItems: 'center', padding: '2rem' }}>
        <div className="fade-in" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 24, padding: 40, maxWidth: 440, textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, margin: '0 0 10px' }}>Guest accounts are read-only</h2>
          <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: 1.55, color: 'var(--color-text-muted)' }}>
            You're browsing as a guest. Create a free account to post a lost or found item.
          </p>
          <button onClick={() => navigate('/signup')}>Create an account</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--color-page-bg)', paddingBottom: 80 }}>
      <main className="container fade-in" style={{ maxWidth: 760, paddingTop: 56 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8FA79A', margin: '0 0 14px' }}>
          New post
        </p>
        <h1 style={{ fontSize: 40, margin: '0 0 10px', color: '#F6F1E6' }}>What happened?</h1>
        <p style={{ margin: '0 0 32px', fontSize: 16, lineHeight: 1.55, color: '#B9CBC1', maxWidth: '52ch' }}>
          Leave out one identifying detail on purpose. It becomes the question you ask whoever claims the item.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 22, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 24, padding: 32, maxWidth: 'none', margin: 0, boxShadow: 'none' }}>
          <div style={{ display: 'grid', gap: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>I am reporting</span>
            <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-soft)', borderRadius: 14, padding: 4, width: 'fit-content' }}>
              {statusOptions.map(opt => {
                const on = formData.status === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setFormData(prev => ({ ...prev, status: opt.value }))}
                    style={{
                      border: 'none',
                      padding: '11px 22px',
                      borderRadius: 10,
                      fontSize: 14.5,
                      fontWeight: 500,
                      boxShadow: 'none',
                      margin: 0,
                      background: on ? '#FFFFFF' : 'transparent',
                      color: on ? '#241E1A' : '#8A7C6E',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="field" htmlFor="title" style={{ display: 'grid', gap: 8, marginBottom: 0 }}>
            Title
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Black Samsung Galaxy S23, clear case"
              className={fieldErrors.title ? 'invalid' : ''}
              value={formData.title}
              onChange={handleChange}
            />
            {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
          </label>

          <label className="field" htmlFor="description" style={{ display: 'grid', gap: 8, marginBottom: 0 }}>
            Description
            <textarea
              id="description"
              name="description"
              placeholder="When you last had it, what it looks like, anything unusual about it."
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <label className="field" htmlFor="category" style={{ display: 'grid', gap: 8, marginBottom: 0 }}>
              Category
              <select
                id="category"
                name="category"
                className={fieldErrors.category ? 'invalid' : ''}
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {fieldErrors.category && <span className="field-error">{fieldErrors.category}</span>}
            </label>

            <label className="field" htmlFor="building" style={{ display: 'grid', gap: 8, marginBottom: 0 }}>
              Building
              <select
                id="building"
                name="building"
                className={fieldErrors.building ? 'invalid' : ''}
                value={formData.building}
                onChange={handleChange}
              >
                <option value="">Select building</option>
                {BUILDINGS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
                <option value="Somewhere else">Somewhere else</option>
              </select>
              {fieldErrors.building && <span className="field-error">{fieldErrors.building}</span>}
            </label>
          </div>

          {formData.building === 'Somewhere else' && (
            <label className="field" htmlFor="otherLocation" style={{ display: 'grid', gap: 8, marginBottom: 0 }}>
              Where, exactly?
              <input
                id="otherLocation"
                type="text"
                name="otherLocation"
                placeholder="E.g. outside the Tim Hortons on Ring Road"
                className={fieldErrors.otherLocation ? 'invalid' : ''}
                value={formData.otherLocation}
                onChange={handleChange}
              />
              {fieldErrors.otherLocation && <span className="field-error">{fieldErrors.otherLocation}</span>}
            </label>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 6 }}>
            <button type="submit" disabled={submitting} style={{ padding: '15px 26px', fontSize: 15 }}>
              {submitting && <span className="btn-spinner" />}
              {submitting ? 'Publishing…' : 'Publish post'}
            </button>
            <span style={{ fontSize: 13.5, color: '#8A7C6E' }}>Visible to anyone with a uwaterloo.ca account.</span>
          </div>

          {message && (
            <div className="field-error" style={{ margin: 0 }}>
              {message}
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default CreatePost;
