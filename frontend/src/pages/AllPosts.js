import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tagFor, categoryColorFor, timeAgo, truncate, decodeToken } from '../utils/postDisplay';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Others'];
const STATUS_TABS = ['All', 'Lost', 'Found'];

const AllPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalPosts: 0 });
  const token = localStorage.getItem('token');
  const isGuest = !!(token && decodeToken(token)?.guest);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        title: search,
        category: category === 'All' ? '' : category,
        status: status === 'All' ? '' : status.toLowerCase(),
        page,
      }).toString();

      const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://lost-and-found-app-new.vercel.app'}/api/post?${params}`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data.posts || []);
      setPagination({ page: data.page || 1, totalPages: data.totalPages || 1, totalPosts: data.totalPosts || 0 });
      setError('');
    } catch (err) {
      setError(err.message);
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, status, page]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('All');
    setPage(1);
  };

  const pill = (on) =>
    on
      ? { background: '#241E1A', color: '#F7F2EA', border: '1px solid #241E1A' }
      : { background: 'transparent', color: '#6B5F54', border: '1px solid #DFD3C1' };

  if (error) return <p style={{ color: '#F6F1E6', textAlign: 'center', padding: '2rem' }}>{error}</p>;

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--color-page-bg)', paddingBottom: 80 }}>
      <main className="container fade-in" style={{ paddingTop: 0 }}>
        <section
          style={{
            padding: '64px 0 40px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
            gap: 56,
            alignItems: 'end',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8FA79A',
                margin: '0 0 18px',
              }}
            >
              Open posts on campus
            </p>
            <h1
              style={{
                fontSize: 54,
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                margin: 0,
                maxWidth: '15ch',
                color: '#F6F1E6',
              }}
            >
              Someone probably{' '}
              <span
                style={{
                  backgroundImage: 'linear-gradient(#D9A24B, #D9A24B)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 0.26em',
                  backgroundPosition: '0 0.76em',
                  padding: '0 0.06em',
                }}
              >
                picked it up
              </span>
              .
            </h1>
            <p style={{ margin: '20px 0 0', fontSize: 17, lineHeight: 1.55, color: '#B9CBC1', maxWidth: '44ch' }}>
              Every post here was written by a student who either lost something or found something and wants it
              back with its owner. Search, then send a note.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            {!isGuest && (
              <button onClick={() => navigate('/create-post')} style={{ whiteSpace: 'nowrap', padding: '15px 24px', fontSize: 15 }}>
                Post an item
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard')}
              className="secondary"
              style={{
                whiteSpace: 'nowrap',
                padding: '15px 22px',
                fontSize: 15,
                border: '1px solid rgba(255,255,255,0.35)',
                color: '#F6F1E6',
              }}
            >
              My posts
            </button>
          </div>
        </section>

        <section
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 20,
            padding: 18,
            display: 'grid',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--color-surface-muted)',
                border: '1px solid var(--color-border-soft)',
                borderRadius: 12,
                padding: '12px 16px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-subtle)' }}>/</span>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by title, description or building"
                style={{ flex: 1, border: 'none', background: 'none', margin: 0, padding: 0 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-soft)', borderRadius: 12, padding: 4 }}>
              {STATUS_TABS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatus(s); setPage(1); }}
                  style={{
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: 9,
                    fontSize: 14,
                    fontWeight: 500,
                    boxShadow: 'none',
                    margin: 0,
                    background: status === s ? '#FFFFFF' : 'transparent',
                    color: status === s ? '#241E1A' : '#8A7C6E',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(1); }}
                style={{
                  padding: '7px 14px',
                  borderRadius: 999,
                  fontSize: 13,
                  boxShadow: 'none',
                  margin: 0,
                  ...pill(category === c),
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '32px 4px 18px' }}>
          <p style={{ margin: 0, fontSize: 14, color: '#B9CBC1' }}>
            {loading ? 'Loading…' : `${pagination.totalPosts} open post${pagination.totalPosts === 1 ? '' : 's'}`}
          </p>
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8FA79A' }}>
            Newest first
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#B9CBC1' }}>Loading posts…</div>
        ) : posts.length > 0 ? (
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 18 }}>
            {posts.map((post) => {
              const tag = tagFor(post.status);
              const cat = categoryColorFor(post.category);
              return (
                <article
                  key={post._id}
                  onClick={() => navigate(`/posts/${post._id}`)}
                  style={{
                    cursor: 'pointer',
                    background: tag.cardBg,
                    border: `1px solid ${tag.cardLine}`,
                    borderRadius: 20,
                    padding: 24,
                    display: 'grid',
                    gap: 14,
                    alignContent: 'start',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '6px 11px',
                        borderRadius: 999,
                        background: tag.tagBg,
                        border: `1px solid ${tag.tagLine}`,
                        color: tag.tagFg,
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: tag.tagFg }} />
                      {tag.statusLabel}
                    </span>
                    <span style={{ fontSize: 12, color: '#A2968A' }}>{timeAgo(post.createdAt)}</span>
                  </div>
                  <h3 style={{ fontSize: 21, lineHeight: 1.2, margin: 0, color: '#241E1A' }}>{post.title}</h3>
                  {post.description && (
                    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: '#6B5F54' }}>{truncate(post.description)}</p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
                    <span style={{ fontSize: 12.5, borderRadius: 999, padding: '5px 11px', background: cat.bg, color: cat.fg }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: 12.5, color: '#4A403A', background: 'rgba(36,30,26,0.07)', borderRadius: 999, padding: '5px 11px' }}>
                      {post.location}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(36,30,26,0.12)',
                      marginTop: 4,
                      paddingTop: 14,
                    }}
                  >
                    <span style={{ fontSize: 13, color: '#6B5F54', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Posted by {post.userId?.name || 'Unknown'}
                    </span>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: tag.tagFg, whiteSpace: 'nowrap' }}>Open &rarr;</span>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px dashed rgba(255,255,255,0.3)',
              borderRadius: 20,
              padding: '64px 32px',
              textAlign: 'center',
            }}
            className="fade-in"
          >
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8FA79A', margin: '0 0 14px' }}>
              Nothing matches yet
            </p>
            <h3 style={{ fontSize: 26, margin: '0 0 10px', color: '#F6F1E6' }}>No posts for that search</h3>
            <p style={{ margin: '0 auto 24px', fontSize: 15, lineHeight: 1.55, color: '#B9CBC1', maxWidth: '46ch' }}>
              Items get posted all week. Clear the filters to see everything, or post your own so whoever finds it
              knows where to look.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={clearFilters}
                className="secondary"
                style={{ border: '1px solid rgba(255,255,255,0.35)', color: '#F6F1E6', padding: '13px 20px', fontSize: 14.5 }}
              >
                Clear filters
              </button>
              {!isGuest && (
                <button onClick={() => navigate('/create-post')} style={{ padding: '13px 20px', fontSize: 14.5 }}>
                  Post an item
                </button>
              )}
            </div>
          </section>
        )}

        {pagination.totalPages > 1 && (
          <div className="text-center mt-2" style={{ paddingTop: 24 }}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="secondary" style={{ border: '1px solid rgba(255,255,255,0.35)', color: '#F6F1E6' }}>
              &larr; Previous
            </button>
            <span style={{ margin: '0 1rem', color: '#B9CBC1' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="secondary" style={{ border: '1px solid rgba(255,255,255,0.35)', color: '#F6F1E6' }}>
              Next &rarr;
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllPosts;
