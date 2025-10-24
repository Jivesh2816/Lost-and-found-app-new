// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://lost-and-found-app-bys3wcp2g-jivesh-aroras-projects.vercel.app';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  },
  POSTS: {
    BASE: `${API_BASE_URL}/api/post`,
    USER: `${API_BASE_URL}/api/post/user`,
    BY_ID: (id) => `${API_BASE_URL}/api/post/${id}`,
  },
  CONTACT: `${API_BASE_URL}/api/contact`,
  HEALTH: `${API_BASE_URL}/health`,
  TEST: `${API_BASE_URL}/api/test`,
};

export default API_BASE_URL;
