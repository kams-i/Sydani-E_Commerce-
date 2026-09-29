import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sydani-e-commerce-e-backend.onrender.com/api/v6';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Automatically inject Bearer token for protected routes if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ==========================================
// 1. USER ENDPOINTS
// ==========================================
export const userAPI = {
  signUp: (data: { fullName: string; email: string; password: string; phone: string; role?: string }) =>
    api.post('/user/signup', data),
  
  signIn: (credentials: { email: string; password: string }) =>
    api.post('/user/signin', credentials),
  
  getCurrentUser: () => api.get('/user/me'),
  
  requestOtp: (data: { email: string }) => api.post('/user/request-otp', data),
  
  verifyOtp: (data: { email: string; otp: string }) => api.post('/user/verify-otp', data),
  
  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    api.post('/user/reset-password', data),
  
  getAllUsers: () => api.get('/user/all'),
  
  updateUser: (id: string, data: any) => api.put(`/user/update/${id}`, data),
  
  deleteUser: (id: string) => api.delete(`/user/delete/${id}`),
};

// ==========================================
// 2. PRODUCT ENDPOINTS
// ==========================================
export const productAPI = {
  getAllProducts: () => api.get('/product/all'),
  
  getOneProduct: (id: string) => api.get(`/product/${id}`),
  
  getSellerProducts: () => api.get('/product/seller/my-products'),
  
  // Uses FormData to handle file/image uploads ('images' array)
  createProduct: (formData: FormData) =>
    api.post('/product/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateProduct: (id: string, formData: FormData) =>
    api.put(`/product/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  deleteProduct: (id: string) => api.delete(`/product/delete/${id}`),
};

// ==========================================
// 3. CART ENDPOINTS
// ==========================================
export const cartAPI = {
  getCart: () => api.get('/cart'),
  
  addToCart: (itemData: { productId: string; quantity: number }) =>
    api.post('/cart/items', itemData),
  
  updateCartItem: (itemId: string, data: { quantity: number }) =>
    api.put(`/cart/items/${itemId}`, data),
  
  removeCartItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  
  clearCart: () => api.delete('/cart/clear'),
};

// ==========================================
// 4. ORDER ENDPOINTS
// ==========================================
export const orderAPI = {
  checkout: (orderData: any) => api.post('/order/checkout', orderData),
  
  getUserOrders: () => api.get('/order'),
  
  getOneOrder: (id: string) => api.get(`/order/${id}`),
};