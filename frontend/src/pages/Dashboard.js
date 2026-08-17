import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditModal from '../Components/EditModal';
import { tagFor, timeAgo, decodeToken } from '../utils/postDisplay';

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const token = localStorage.getItem('token');
  const isGuest = !!(token && decodeToken(token)?.guest);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://lost-and-found-app-new.vercel.app'}/api/post/user`, {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
          }
          throw new Error('Failed to fetch posts');
        }
        const data = await res.json();
        setPosts(data.posts || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://lost-and-found-app-new.vercel.app'}/api/post/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setPosts(posts.filter(post => post._id !== id));
    } else {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      const errorData = await res.json();
      alert(errorData.message || 'Failed to delete post');
    }
  };

  const handleEdit = (post) => setEditingPost(post);
  const handleCloseModal = () => setEditingPost(null);
  const handleEditSave = async (updatedPost) => {
    setPosts(prev => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)));
    setEditingPost(null);
  };

  if (error) {
    return (
      <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--color-page-bg)', display: 'grid', placeItems: 'center' }}>
        <p style={{ color: '#B9CBC1' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--color-page-bg)', paddingBottom: 80 }}>
      <main className="container fade-in" style={{ maxWidth: 1000, paddingTop: 56 }}>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 24, marginBottom: 32 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8FA79A', margin: '0 0 14px' }}>
              Your account
            </p>
            <h1 style={{ fontSize: 40, margin: 0, color: '#F6F1E6' }}>Your posts</h1>
          </div>
          {!isGuest && (
            <button onClick={() => navigate('/create-post')} style={{ padding: '14px 22px', fontSize: 15 }}>
              Post an item
            </button>
          )}
        </div>
        {isGuest && (
          <p style={{ margin: '-16px 0 32px', fontSize: 13.5, color: '#8FA79A' }}>
            You're browsing as a guest — sign up to post your own items.
          </p>
        )}

        {!loading && posts.length > 0 && (
          <section
            style={{
              background: 'var(--color-success-soft)',
              border: '1px solid var(--color-success-border)',
              borderRadius: 20,
              padding: '26px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              marginBottom: 20,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4F6B52', margin: '0 0 8px' }}>
                Possible match
              </p>
              <h3 style={{ fontSize: 21, margin: '0 0 6px' }}>A found post looks like your Galaxy S23</h3>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: '#48584A' }}>
                Posted in DC two hours ago, same category, description mentions a cracked corner.
              </p>
            </div>
            <button
              onClick={() => navigate('/posts')}
              style={{ background: '#3F6B4F', color: '#F4F8F2', boxShadow: 'none', padding: '13px 20px', fontSize: 14.5, whiteSpace: 'nowrap' }}
            >
              See the post
            </button>
          </section>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#B9CBC1' }}>Loading your posts…</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#B9CBC1' }}>You haven't posted anything yet.</div>
        ) : (
          <section style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 20, overflow: 'hidden' }}>
            {posts.map(post => {
              const tag = tagFor(post.status);
              return (
                <div
                  key={post._id}
                  style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 26px', borderBottom: '1px solid var(--color-border-soft)' }}
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          padding: '5px 10px',
                          borderRadius: 999,
                          background: tag.tagBg,
                          border: `1px solid ${tag.tagLine}`,
                          color: tag.tagFg,
                        }}
                      >
                        {tag.statusLabel}
                      </span>
                      <span style={{ fontSize: 12, color: '#A2968A' }}>{timeAgo(post.createdAt)}</span>
                    </div>
                    <h3 style={{ fontSize: 18, margin: '0 0 4px' }}>{post.title}</h3>
                    <p style={{ margin: 0, fontSize: 13.5, color: '#8A7C6E' }}>
                      {post.category} &middot; {post.location}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleEdit(post)} className="secondary" style={{ padding: '9px 16px', fontSize: 13.5 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="danger" style={{ padding: '9px 16px', fontSize: 13.5 }}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 26px', background: '#FAF5EC' }}>
              <p style={{ margin: 0, fontSize: 13.5, color: '#8A7C6E' }}>Closed posts stay in your history for 30 days.</p>
              <span style={{ fontSize: 13.5, color: '#B4552F' }}>View history</span>
            </div>
          </section>
        )}
      </main>

      {editingPost && (
        <EditModal post={editingPost} onClose={handleCloseModal} onSave={handleEditSave} />
      )}
    </div>
  );
};

export default Dashboard;
