import apiClient from './apiClient';

/**
 * Caregiver Service
 * Handles API calls for caregiver-specific operations
 */
const caregiverService = {
  /**
   * Fetch all patients connected to the current caregiver
   */
  getPatients: async () => {
    try {
      const response = await apiClient.get('/caregiver/patients');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Send an invitation/link request to a patient by email
   */
  invitePatient: async (email) => {
    try {
      const response = await apiClient.post('/caregiver/invite', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default caregiverService;
