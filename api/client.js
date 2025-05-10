import axios from 'axios';
import { auth } from '../firebaseConfig';

// Use the IP address of your machine instead of localhost
const API_BASE_URL = 'http://192.168.1.143:8000';  // Your computer's IP address

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient; 