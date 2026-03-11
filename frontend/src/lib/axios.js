import axios from 'axios';

// Use environment variable or fallback to localhost:5000 for development
const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL,
    withCredentials:true
})

// Log the baseURL for debugging
console.log('🔧 Axios baseURL:', baseURL);

export default api;