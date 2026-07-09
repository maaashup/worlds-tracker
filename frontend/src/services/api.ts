import axios from 'axios';

const api = axios.create({
  // Point this to your backend server URL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  // 🍪 CRITICAL: This allows HTTP-only cookies to be sent and received
  withCredentials: true, 
});

export default api;