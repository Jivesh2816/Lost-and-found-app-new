import React, { useState } from 'react';

const EditModal = ({ post, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: post.title || '',
    description: post.description || '',
    category: post.category || '',
    location: post.location || '',
    status: post.status || 'lost',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(post.image || '');
  const [photoError, setPhotoError] = useState('');
  const [removeImage, setRemoveImage] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Photo must be under 5MB');
      e.target.value = '';
      return;
    }
    setPhotoError('');
    setPhoto(file);
    setRemoveImage(false);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
    setRemoveImage(true);
  };

  const categories = [
    'Books',
    'Electronics',
    'Clothing',
    'Accessories',
    'Documents',
    'Keys',
    'Others'
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      if (photo) body.append('image', photo);
      if (removeImage) body.append('removeImage', 'true');

      const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://lost-and-found-app-new.vercel.app'}/api/post/${post._id}/edit`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body,
      });

      if (res.ok) {
        const updatedPost = await res.json();
        onSave(updatedPost);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to update post');
      }
    } catch (err) {
      setError(err.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Edit post</h2>
          <button
            onClick={onClose}
            className="secondary"
            style={{ padding: '0.4rem 0.7rem', boxShadow: 'none' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="edit-title">Title</label>
            <input id="edit-title" name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="edit-description">Description</label>
            <textarea id="edit-description" name="description" rows="4" value={form.description} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="edit-category">Category</label>
            <select id="edit-category" name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="edit-photo">Photo</label>
            {photoPreview ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: '0.35rem' }}>
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--color-border)' }}
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="secondary"
                  style={{ padding: '9px 16px', fontSize: 13.5 }}
                >
                  Remove photo
                </button>
              </div>
            ) : (
              <input id="edit-photo" type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={handlePhotoChange} />
            )}
            {photoError && <span className="field-error">{photoError}</span>}
          </div>

          <div className="field">
            <label htmlFor="edit-location">Location</label>
            <input id="edit-location" name="location" value={form.location} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="edit-status">Status</label>
            <select id="edit-status" name="status" value={form.status} onChange={handleChange}>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          {error && <div className="field-error mb-2">{error}</div>}

          <div className="flex" style={{ gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={{ flex: 1 }}>
              {submitting && <span className="btn-spinner" />}
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
