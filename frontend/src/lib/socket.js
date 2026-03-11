import { io } from "socket.io-client";

// Use environment variable or fallback to localhost:5000 for development
const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

export const socket = io(baseURL,{
    withCredentials:true
})