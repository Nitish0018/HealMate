import apiClient, { cachedGet, invalidateCache } from './apiClient';

/**
 * Adherence Service
 * Handles adherence logging and metrics API calls
 */

/**
 * Log medication intake
 * @param {Object} logData - Adherence log data
 * @param {string} logData.medicationId - Medication ID
 * @param {string} logData.patientId - Patient ID
 * @param {string} logData.scheduledTime - Scheduled time
 * @param {string} logData.actualTime - Actual intake time
 * @param {string} logData.status - Status ('taken' or 'missed')
 * @returns {Promise<Object>} Created adherence log
 */
export const logMedicationIntake = async (logData) => {
  try {
    const response = await apiClient.post('/adherence/log', logData);
    
    // Invalidate cache after logging
    invalidateCache('/adherence');
    invalidateCache('/medications');
    
    return response.data;
  } catch (error) {
    console.error('Error logging medication intake:', error);
    throw error;
  }
};

/**
 * Get adherence logs for a patient
 * @param {string} subjectId - Patient subject ID
 * @returns {Promise<Array>} List of adherence logs
 */
export const getPatientAdherenceLogs = async (subjectId) => {
  try {
    const response = await cachedGet(`/adherence/patient/${subjectId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching adherence logs:', error);
    throw error;
  }
};

/**
 * Get adherence metrics for a patient
 * @param {string} patientId - Patient ID
 * @param {string} period - Period ('daily' or 'weekly')
 * @returns {Promise<Object>} Adherence metrics
 */
export const getAdherenceMetrics = async (patientId, period = 'daily') => {
  try {
    const response = await cachedGet('/adherence/metrics', {
      params: { patientId, period }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching adherence metrics:', error);
    throw error;
  }
};

/**
 * Calculate adherence percentage
 * @param {number} takenCount - Number of medications taken
 * @param {number} scheduledCount - Number of medications scheduled
 * @returns {number} Adherence percentage (0-100)
 */
export const calculateAdherencePercentage = (takenCount, scheduledCount) => {
  if (scheduledCount === 0) return 0;
  return Math.round((takenCount / scheduledCount) * 100);
};
