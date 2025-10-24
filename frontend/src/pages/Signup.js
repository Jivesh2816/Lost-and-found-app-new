import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Creating account...');
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://lost-and-found-app-bys3wcp2g-jivesh-aroras-projects.vercel.app';
      console.log('Signup API URL:', apiUrl);
      
      const res = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      console.log('Signup response status:', res.status);
      
      const data = await res.json();
      console.log('Signup response data:', data);
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Account created successfully! Redirecting...');
        // Redirect to dashboard after successful signup
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container fade-in">
      <h2>✨ Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="👤 Full Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="📧 Email Address" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="🔒 Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
          🚀 Create Account
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

export default Signup;
