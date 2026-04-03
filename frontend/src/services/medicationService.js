import apiClient, { cachedGet } from './apiClient';

/**
 * Medication Service
 * Handles medication-related API calls
 */

/**
 * Get medications for a patient
 * @param {string} subjectId - Patient subject ID
 * @returns {Promise<Array>} List of medications
 */
export const getPatientMedications = async (subjectId) => {
  try {
    const response = await cachedGet(`/medications/patient/${subjectId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching patient medications:', error);
    throw error;
  }
};

/**
 * Add a new medication
 * @param {Object} medicationData - Medication data
 * @param {string} medicationData.name - Medication name
 * @param {string} medicationData.dosage - Dosage information
 * @param {string} medicationData.frequency - Frequency (e.g., "daily", "twice daily")
 * @param {string} medicationData.scheduledTime - Scheduled time (HH:mm format)
 * @param {string} medicationData.patientId - Patient ID
 * @returns {Promise<Object>} Created medication
 */
export const addMedication = async (medicationData) => {
  try {
    const response = await apiClient.post('/medications', medicationData);
    
    // Invalidate cache so the new medication shows up immediately
    invalidateCache();
    
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw error;
  }
};

/**
 * Get medication schedule for a specific date
 * @param {string} patientId - Patient ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Medication schedule
 */
export const getMedicationSchedule = async (patientId, date) => {
  try {
    const response = await cachedGet('/medications/schedule', {
      params: { patientId, date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching medication schedule:', error);
    throw error;
  }
};
