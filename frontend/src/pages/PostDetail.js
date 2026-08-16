import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tagFor, categoryColorFor, timeAgo, decodeToken } from '../utils/postDisplay';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sent, setSent] = useState(false);
  const token = localStorage.getItem('token');
  const isGuest = !!(token && decodeToken(token)?.guest);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://lost-and-found-app-new.vercel.app'}/api/post/${id}`);
        if (!res.ok) throw new Error(res.status === 404 ? 'Post not found' : 'Failed to fetch post');
        const data = await res.json();
        setPost(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!token || isGuest) return;
    try {
      const payload = decodeToken(token);
      setForm((prev) => ({
        ...prev,
        name: prev.name || payload?.name || '',
        email: prev.email || payload?.email || '',
      }));
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://lost-and-found-app-new.vercel.app'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ postId: post._id, name: form.name, email: form.email, message: form.message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to send your note');
      setSent(true);
    } catch (err) {
      setSendError(err.message || 'Failed to send your note. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--color-page-bg)', display: 'grid', placeItems: 'center' }}>
        <p style={{ color: '#B9CBC1' }}>Loading post…</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--color-page-bg)', display: 'grid', placeItems: 'center', gap: 16 }}>
        <p style={{ color: '#B9CBC1' }}>{error || 'Post not found'}</p>
        <button onClick={() => navigate('/posts')}>Back to all posts</button>
      </div>
    );
  }

  const tag = tagFor(post.status);
  const cat = categoryColorFor(post.category);

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--color-page-bg)', paddingBottom: 80 }}>
      <main className="container fade-in" style={{ paddingTop: 40 }}>
        <button
          onClick={() => navigate('/posts')}
          className="secondary"
          style={{ border: 'none', background: 'none', boxShadow: 'none', fontSize: 14, color: '#9FB6AA', padding: '0 0 24px', margin: 0 }}
        >
          &larr; All posts
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 28, alignItems: 'start' }}>
          <article style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 24, padding: 40 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '7px 13px',
                borderRadius: 999,
                background: tag.tagBg,
                border: `1px solid ${tag.tagLine}`,
                color: tag.tagFg,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: tag.tagFg }} />
              {tag.statusLabel}
            </span>
            <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: '16px 0 0' }}>{post.title}</h1>
            <p style={{ margin: '18px 0 0', fontSize: 17, lineHeight: 1.6, color: '#4A403A', maxWidth: '58ch' }}>
              {post.description}
            </p>
            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24,
                margin: '36px 0 0',
                padding: '24px 0 0',
                borderTop: '1px solid var(--color-border-soft)',
              }}
            >
              <div>
                <dt style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A2968A', marginBottom: 8 }}>
                  Category
                </dt>
                <dd style={{ margin: 0 }}>
                  <span style={{ fontSize: 14, borderRadius: 999, padding: '6px 12px', background: cat.bg, color: cat.fg }}>{post.category}</span>
                </dd>
              </div>
              <div>
                <dt style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A2968A', marginBottom: 8 }}>
                  Building
                </dt>
                <dd style={{ margin: 0, fontSize: 16 }}>{post.location}</dd>
              </div>
              <div>
                <dt style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A2968A', marginBottom: 8 }}>
                  Posted
                </dt>
                <dd style={{ margin: 0, fontSize: 16 }}>
                  {timeAgo(post.createdAt)} by {post.userId?.name || 'Unknown'}
                </dd>
              </div>
            </dl>
          </article>

          <aside style={{ display: 'grid', gap: 16 }}>
            {sent ? (
              <section style={{ background: 'var(--color-success-soft)', border: '1px solid var(--color-success-border)', borderRadius: 20, padding: 28 }} className="fade-in">
                <h3 style={{ fontSize: 19, margin: '0 0 8px' }}>Your note is on its way</h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: '#48584A' }}>
                  {post.userId?.name || 'The poster'} gets an email with your name and reply address. If it's a
                  match, arrange the handoff somewhere public on campus.
                </p>
              </section>
            ) : isGuest ? (
              <section style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <h3 style={{ fontSize: 19, margin: '0 0 8px' }}>Message the poster</h3>
                <p style={{ margin: '0 0 18px', fontSize: 14.5, lineHeight: 1.55, color: 'var(--color-text-muted)' }}>
                  Guest accounts can't send messages. Create a free account to contact the poster.
                </p>
                <button onClick={() => navigate('/signup')}>Create an account</button>
              </section>
            ) : (
              <section style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 20, padding: 28, display: 'grid', gap: 14 }}>
                <div>
                  <h3 style={{ fontSize: 20, margin: '0 0 6px' }}>Message the poster</h3>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--color-text-muted)' }}>
                    Describe one detail only the owner would know. That's how claims get verified here.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                  <label className="field" htmlFor="contact-name" style={{ display: 'grid', gap: 7, marginBottom: 12 }}>
                    Your name
                    <input id="contact-name" name="name" value={form.name} onChange={handleChange} required />
                  </label>
                  <label className="field" htmlFor="contact-email" style={{ display: 'grid', gap: 7, marginBottom: 12 }}>
                    Reply email
                    <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} required />
                  </label>
                  <label className="field" htmlFor="contact-message" style={{ display: 'grid', gap: 7, marginBottom: 12 }}>
                    Message
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      placeholder="It has a sticker on the back and a small crack near the corner."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  {sendError && <div className="field-error mb-2">{sendError}</div>}
                  <button type="submit" disabled={sending} style={{ width: '100%' }}>
                    {sending && <span className="btn-spinner" />}
                    {sending ? 'Sending…' : 'Send note'}
                  </button>
                </form>
              </section>
            )}
            <section style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: 24 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8FA79A', margin: '0 0 12px' }}>
                Meeting safely
              </p>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.65, color: '#B9CBC1', listStyle: 'disc', display: 'block' }}>
                <li>Meet in a staffed building during open hours.</li>
                <li>Never send a deposit or a code to claim an item.</li>
                <li>High-value finds can be handed to Special Constable Service.</li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
