import axios from 'axios';

// Utilisez l'URL en fonction de l'environnement
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://192.168.1.115:5000/api';

console.log('API URL:', API_BASE_URL); // Pour le débogage

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout de 10 secondes
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Making request to:', config.url); // Pour le débogage
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data); // Pour le débogage
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend is not running or not accessible');
      alert('Le serveur est inaccessible. Veuillez vérifier que le backend est en cours d\'exécution.');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Fonction pour tester la connexion au backend
export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
};

// Auth API
export const loginUser = (email, password) => {
  return api.post('/auth/login', { email, password }).then(res => res.data);
};

export const registerUser = (userData) => {
  return api.post('/auth/register', userData).then(res => res.data);
};

export const getCurrentUser = () => {
  return api.get('/auth/me').then(res => res.data);
};

// Projects API (pour les utilisateurs normaux)
export const getProjects = () => {
  return api.get('/projects').then(res => res.data);
};

export const createProject = (projectData) => {
  return api.post('/projects', projectData).then(res => res.data);
};

export const getProject = (id) => {
  return api.get(`/projects/${id}`).then(res => res.data);
};

// Chat API
export const getMessages = (roomId = null) => {
  const params = roomId ? `?room_id=${roomId}` : '';
  return api.get(`/chat/messages${params}`).then(res => res.data);
};

export const sendMessage = (data) => {
  return api.post('/chat/messages', data).then(res => res.data);
};

export const getConversations = () => {
  return api.get('/chat/conversations').then(res => res.data);
};

// E-commerce API (pour les utilisateurs normaux)
export const getProducts = () => {
  return api.get('/ecommerce/products').then(res => res.data);
};

export const createOrder = (orderData) => {
  return api.post('/ecommerce/orders', orderData).then(res => res.data);
};

// Fonction de déconnexion
export const logoutUser = () => {
  return api.post('/auth/logout').then(res => res.data);
};

// Admin API - Renommez les fonctions pour éviter les conflits
export const getAdminUsers = () => {
  return api.get('/admin/users').then(res => res.data);
};

export const deleteUser = (id) => {
  return api.delete(`/admin/users/${id}`).then(res => res.data);
};

export const getAdminProjects = () => {
  return api.get('/admin/projects').then(res => res.data);
};

export const deleteProject = (id) => {
  return api.delete(`/admin/projects/${id}`).then(res => res.data);
};

export const getAdminProducts = () => {
  return api.get('/admin/products').then(res => res.data);
};

export const deleteProduct = (id) => {
  return api.delete(`/admin/products/${id}`).then(res => res.data);
};

export const addProduct = (productData) => {
  return api.post('/admin/products', productData).then(res => res.data);
};

export const updateProduct = (id, productData) => {
  return api.put(`/admin/products/${id}`, productData).then(res => res.data);
};

// Paiement API - Mode simulation
export const createCheckoutSession = (data) => {
  return api.post('/payment/create-checkout-session', data).then(res => res.data);
};

export const simulatePayment = (data) => {
  return api.post('/payment/simulate-payment', data).then(res => res.data);
};

export const getSessionStatus = (sessionId) => {
  return api.get(`/payment/session-status?session_id=${sessionId}`).then(res => res.data);
};

export default api;