const BASE_URL = import.meta.env.VITE_API_URL || 'https://lost-and-found-app-new.vercel.app';

async function request(path, { method = 'GET', body, isFormData = false, token } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData && body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty body
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

function query(params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  );
  const qs = new URLSearchParams(clean).toString();
  return qs ? `?${qs}` : '';
}

// Auth
export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: { email, password } });

export const signup = (name, email, password) =>
  request('/api/auth/signup', { method: 'POST', body: { name, email, password } });

export const guestLogin = () => request('/api/auth/guest', { method: 'POST' });

// Posts
export const listPosts = (params) => request(`/api/post${query(params)}`);

export const getUserPosts = (params, token) => request(`/api/post/user${query(params)}`, { token });

export const getPost = (id) => request(`/api/post/${id}`);

export const createPost = (formData, token) =>
  request('/api/post', { method: 'POST', body: formData, isFormData: true, token });

export const updatePost = (id, formData, token) =>
  request(`/api/post/${id}/edit`, { method: 'PUT', body: formData, isFormData: true, token });

export const deletePost = (id, token) => request(`/api/post/${id}`, { method: 'DELETE', token });

// Contact
export const sendContact = (payload, token) =>
  request('/api/contact', { method: 'POST', body: payload, token });
