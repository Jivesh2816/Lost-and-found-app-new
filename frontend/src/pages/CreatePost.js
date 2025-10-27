import React, { useState } from 'react';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    status: 'lost',
  });
  const [message, setMessage] = useState('');

  const categories = [
    'Books',
    'Electronics',
    'Clothing',
    'Accessories',
    'Documents',
    'Keys',
    'Others'
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to create a post.');
      return;
    }
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://lost-and-found-app-new.vercel.app'}/api/post`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage('Post created successfully!');
        // Optionally clear form or redirect
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
    }
  };

  return (
    <div className="container fade-in">
      <h2>📝 Create Lost or Found Post</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="title" 
          placeholder="📝 What did you lose/find?" 
          value={formData.title} 
          onChange={handleChange} 
          required 
        />
        <textarea 
          name="description" 
          placeholder="📄 Describe the item in detail..." 
          value={formData.description} 
          onChange={handleChange}
          rows="4"
        />
        <select 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          required
        >
          <option value="">📂 Select Category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input 
          type="text" 
          name="location" 
          placeholder="📍 Where did you lose/find it?" 
          value={formData.location} 
          onChange={handleChange} 
          required 
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="lost">❌ Lost Item</option>
          <option value="found">✅ Found Item</option>
        </select>
        <button type="submit" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
          🚀 Create Post
        </button>
      </form>
      {message && (
        <div className={`text-center mt-2 ${message.includes('success') ? 'loading' : 'error'}`}>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
