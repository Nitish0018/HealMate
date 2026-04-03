import apiClient from './apiClient';

/**
 * User Service
 * Handles user-related API calls
 */

/**
 * Fetch user profile from backend
 * @returns {Promise<Object>} User profile data including role
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Register new user in backend
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.role - User role (PATIENT or DOCTOR)
 * @param {string} userData.name - User name
 * @param {string} [userData.mimic_subject_id] - MIMIC subject ID (optional)
 * @returns {Promise<Object>} Created user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
