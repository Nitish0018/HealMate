import axios from 'axios';
import { getCurrentUserToken } from './authService';
import cache from '../utils/cache';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = ['/auth/register', '/auth/login', '/auth/google'];

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  async (config) => {
    const isPublic = PUBLIC_ENDPOINTS.some(ep => config.url?.includes(ep));
    const token = await getCurrentUserToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!isPublic) {
      // No token and not a public endpoint — abort the request silently
      const controller = new AbortController();
      controller.abort();
      return {
        ...config,
        signal: controller.signal,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silently ignore aborted/cancelled requests (e.g., no-token guard)
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
      return Promise.reject(error);
    }

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Only dispatch unauthorized event if not already on login flow
          // This prevents cascading logout triggers
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          }
          break;
        case 403:
          console.error('Permission denied:', data?.message || 'Forbidden');
          break;
        case 404:
          console.error('Resource not found:', data?.message || 'Not found');
          break;
        case 500:
        case 502:
        case 503:
          console.error('Server error:', data?.message || 'Server error');
          break;
        default:
          console.error('API error:', data?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Make a cached GET request
 * @param {string} url - API endpoint
 * @param {Object} config - Axios config
 * @param {number} cacheDuration - Cache duration in milliseconds
 * @returns {Promise} API response
 */
export const cachedGet = async (url, config = {}, cacheDuration) => {
  const cacheKey = `${url}${JSON.stringify(config.params || {})}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return { data: cachedData, fromCache: true };
  }
  
  // Fetch from API
  const response = await apiClient.get(url, config);
  
  // Cache the response data
  cache.set(cacheKey, response.data, cacheDuration);
  
  return response;
};

/**
 * Invalidate cache for a specific URL pattern
 */
export const invalidateCache = () => {
  // Simple implementation - clear all cache
  // In production, you might want more sophisticated pattern matching
  cache.clear();
};

export default apiClient;
