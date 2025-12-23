// Custom React hook for API calls
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

// Generic API hook
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Specific hooks for common API calls

// Products hooks
export const useProducts = (params = {}) => {
  return useApi(() => apiService.getAllProducts(params), [JSON.stringify(params)]);
};

export const useProduct = (productId) => {
  return useApi(() => apiService.getProduct(productId), [productId]);
};

export const useProductsByCategory = (category, params = {}) => {
  return useApi(
    () => apiService.getProductsByCategory(category, params),
    [category, JSON.stringify(params)]
  );
};

export const useProductSearch = (query, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (searchQuery = query, searchParams = params) => {
    if (!searchQuery?.trim()) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await apiService.searchProducts(searchQuery, searchParams);
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, search };
};

// Orders hooks
export const useUserOrders = (userId) => {
  return useApi(() => apiService.getUserOrders(userId), [userId]);
};

export const useOrder = (orderId) => {
  return useApi(() => apiService.getOrder(orderId), [orderId]);
};

// User hooks
export const useUserProfile = () => {
  return useApi(() => apiService.getUserProfile(), []);
};

export const useUserAddresses = () => {
  return useApi(() => apiService.getUserAddresses(), []);
};

// Payment hook
export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPaymentIntent = useCallback(async (amount) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiService.createPaymentIntent(amount);
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.error);
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmPayment = useCallback(async (paymentIntentId, paymentMethodId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiService.confirmPayment(paymentIntentId, paymentMethodId);
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.error);
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPaymentIntent, confirmPayment, loading, error };
};

// Health check hook
export const useHealthCheck = () => {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);

  const checkHealth = useCallback(async () => {
    try {
      const result = await apiService.healthCheck();
      setStatus(result.success ? 'healthy' : 'unhealthy');
      setLastCheck(new Date());
    } catch (error) {
      setStatus('unhealthy');
      setLastCheck(new Date());
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { status, lastCheck, checkHealth };
};

// Mutation hook for API calls that modify data
export const useMutation = (mutationFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await mutationFn(...args);
      
      if (result.success) {
        setData(result.data);
        return result.data;
      } else {
        setError(result.error);
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, data, loading, error, reset };
};