import axios from 'axios';

// Environment-based API URLs
const getBaseURL = () => {
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    // Production API URL - replace with your deployed backend URL
    return process.env.REACT_APP_PRODUCTION_API_URL || 'https://your-backend-api.herokuapp.com';
  }
  
  // Development API URL
  return process.env.REACT_APP_API_URL || 'http://localhost:3002';
};

// Create Axios instance with configuration
const instance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - runs before every request
instance.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
instance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('🔐 Unauthorized - Please login again');
          // Redirect to login or clear auth token
          localStorage.removeItem('authToken');
          break;
        case 403:
          console.error('🚫 Forbidden - Access denied');
          break;
        case 404:
          console.error('🔍 Not Found - Resource not found');
          break;
        case 500:
          console.error('🔥 Server Error - Please try again later');
          break;
        default:
          console.error(`❌ API Error ${status}:`, data?.message || error.message);
      }
    } else if (error.request) {
      // Network error
      console.error('🌐 Network Error - Check your connection');
    } else {
      // Other error
      console.error('❌ Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints configuration
export const API_ENDPOINTS = {
  // Payment endpoints
  PAYMENTS: {
    CREATE: '/payments/create',
    CONFIRM: '/payments/confirm',
    WEBHOOK: '/payments/webhook',
  },
  
  // Order endpoints
  ORDERS: {
    CREATE: '/orders',
    GET_USER_ORDERS: '/orders/user',
    GET_ORDER: (orderId) => `/orders/${orderId}`,
    UPDATE_STATUS: (orderId) => `/orders/${orderId}/status`,
  },
  
  // Product endpoints
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (productId) => `/products/${productId}`,
    GET_BY_CATEGORY: (category) => `/products/category/${category}`,
    SEARCH: '/products/search',
  },
  
  // User endpoints
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    ADDRESSES: '/users/addresses',
  },
  
  // Health check
  HEALTH: '/health',
};

// Helper functions for common API calls
export const apiHelpers = {
  // Payment helpers
  createPaymentIntent: (amount) => {
    return instance.post(`${API_ENDPOINTS.PAYMENTS.CREATE}?total=${amount}`);
  },
  
  // Order helpers
  createOrder: (orderData) => {
    return instance.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
  },
  
  getUserOrders: (userId) => {
    return instance.get(`${API_ENDPOINTS.ORDERS.GET_USER_ORDERS}/${userId}`);
  },
  
  getOrder: (orderId) => {
    return instance.get(API_ENDPOINTS.ORDERS.GET_ORDER(orderId));
  },
  
  // Product helpers
  getAllProducts: () => {
    return instance.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
  },
  
  getProduct: (productId) => {
    return instance.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(productId));
  },
  
  searchProducts: (query) => {
    return instance.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(query)}`);
  },
  
  // Health check
  healthCheck: () => {
    return instance.get(API_ENDPOINTS.HEALTH);
  },
};

// Export the configured instance
export { instance };
export default instance;