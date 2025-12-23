// API Service - Centralized API calls for the Amazon e-commerce app
import axios, { apiHelpers, API_ENDPOINTS } from '../API/Axios';

class ApiService {
  constructor() {
    this.axios = axios;
    this.endpoints = API_ENDPOINTS;
  }

  // Generic API call method
  async makeRequest(method, url, data = null, config = {}) {
    try {
      const response = await this.axios({
        method,
        url,
        data,
        ...config
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }

  // Payment API calls
  async createPaymentIntent(amount) {
    try {
      const response = await apiHelpers.createPaymentIntent(amount);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Payment creation failed',
        status: error.response?.status
      };
    }
  }

  async confirmPayment(paymentIntentId, paymentMethodId) {
    return this.makeRequest('POST', this.endpoints.PAYMENTS.CONFIRM, {
      paymentIntentId,
      paymentMethodId
    });
  }

  // Order API calls
  async createOrder(orderData) {
    try {
      const response = await apiHelpers.createOrder(orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Order creation failed',
        status: error.response?.status
      };
    }
  }

  async getUserOrders(userId) {
    try {
      const response = await apiHelpers.getUserOrders(userId);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders',
        status: error.response?.status
      };
    }
  }

  async getOrder(orderId) {
    try {
      const response = await apiHelpers.getOrder(orderId);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order',
        status: error.response?.status
      };
    }
  }

  async updateOrderStatus(orderId, status) {
    return this.makeRequest('PATCH', this.endpoints.ORDERS.UPDATE_STATUS(orderId), {
      status
    });
  }

  // Product API calls
  async getAllProducts(params = {}) {
    try {
      const response = await this.axios.get(this.endpoints.PRODUCTS.GET_ALL, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products',
        status: error.response?.status
      };
    }
  }

  async getProduct(productId) {
    try {
      const response = await apiHelpers.getProduct(productId);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Product not found',
        status: error.response?.status
      };
    }
  }

  async getProductsByCategory(category, params = {}) {
    try {
      const response = await this.axios.get(
        this.endpoints.PRODUCTS.GET_BY_CATEGORY(category),
        { params }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products',
        status: error.response?.status
      };
    }
  }

  async searchProducts(query, params = {}) {
    try {
      const response = await this.axios.get(this.endpoints.PRODUCTS.SEARCH, {
        params: { q: query, ...params }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Search failed',
        status: error.response?.status
      };
    }
  }

  // User API calls
  async getUserProfile() {
    return this.makeRequest('GET', this.endpoints.USERS.PROFILE);
  }

  async updateUserProfile(profileData) {
    return this.makeRequest('PUT', this.endpoints.USERS.UPDATE_PROFILE, profileData);
  }

  async getUserAddresses() {
    return this.makeRequest('GET', this.endpoints.USERS.ADDRESSES);
  }

  async addUserAddress(addressData) {
    return this.makeRequest('POST', this.endpoints.USERS.ADDRESSES, addressData);
  }

  async updateUserAddress(addressId, addressData) {
    return this.makeRequest('PUT', `${this.endpoints.USERS.ADDRESSES}/${addressId}`, addressData);
  }

  async deleteUserAddress(addressId) {
    return this.makeRequest('DELETE', `${this.endpoints.USERS.ADDRESSES}/${addressId}`);
  }

  // Health check
  async healthCheck() {
    try {
      const response = await apiHelpers.healthCheck();
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: 'API server is not responding',
        status: error.response?.status
      };
    }
  }

  // Utility methods
  getBaseURL() {
    return this.axios.defaults.baseURL;
  }

  setAuthToken(token) {
    if (token) {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete this.axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  }

  clearAuthToken() {
    this.setAuthToken(null);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Also export the class for testing or multiple instances
export { ApiService };