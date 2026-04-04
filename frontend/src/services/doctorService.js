import apiClient, { cachedGet } from './apiClient';

/**
 * Doctor Service
 * Handles doctor-specific API calls for patient monitoring
 */

/**
 * Get list of all patients
 * @returns {Promise<Array>} List of patients
 */
export const getPatientsList = async () => {
  try {
    const response = await cachedGet('/users/patients');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching patients list:', error);
    throw error;
  }
};

/**
 * Get clinical profile for a patient
 * @param {string} subjectId - Patient subject ID
 * @returns {Promise<Object>} Clinical patient profile
 */
export const getClinicalPatientProfile = async (subjectId) => {
  try {
    const response = await cachedGet(`/users/patients/${subjectId}/clinical`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching clinical patient profile:', error);
    throw error;
  }
};

/**
 * Get patient detail with adherence history
 * @param {string} patientId - Patient ID
 * @returns {Promise<Object>} Patient detail with adherence data
 */
export const getPatientDetail = async (patientId) => {
  try {
    const response = await cachedGet(`/doctor/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient detail:', error);
    throw error;
  }
};

/**
 * Get high-risk patients (compliance score < 60%)
 * @returns {Promise<Array>} List of high-risk patients
 */
export const getHighRiskPatients = async () => {
  try {
    const response = await cachedGet('/doctor/high-risk');
    return response.data.patients || response.data;
  } catch (error) {
    console.error('Error fetching high-risk patients:', error);
    throw error;
  }
};

/**
 * Get compliance data for a patient
 * @param {string} patientId - Patient ID
 * @param {string} period - Period ('daily', 'weekly', 'monthly')
 * @returns {Promise<Object>} Compliance data
 */
export const getComplianceData = async (patientId, period = 'daily') => {
  try {
    const response = await cachedGet(`/doctor/patient/${patientId}/compliance`, {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching compliance data:', error);
    throw error;
  }
};

/**
 * Get missed doses for a patient
 * @param {string} patientId - Patient ID
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Array>} List of missed doses
 */
export const getMissedDoses = async (patientId, days = 30) => {
  try {
    const response = await cachedGet(`/doctor/patient/${patientId}/missed-doses`, {
      params: { days }
    });
    return response.data.missedDoses || response.data;
  } catch (error) {
    console.error('Error fetching missed doses:', error);
    throw error;
  }
};

export const sendSmsToPatient = async (patientId, message) => {
  try {
    const response = await apiClient.post(`/users/patients/${patientId}/sms`, { message });
    return response.data;
  } catch (error) {
    console.error('Error sending SMS to patient:', error);
    throw error;
  }
};

/**
 * Filter patients by search query
 * @param {Array} patients - List of patients
 * @param {string} query - Search query
 * @returns {Array} Filtered patients
 */
export const filterPatientsByName = (patients, query) => {
  if (!query || query.trim() === '') return patients;
  
  const lowerQuery = query.toLowerCase().trim();
  return patients.filter(patient => 
    patient.name?.toLowerCase().includes(lowerQuery) ||
    patient.email?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Sort patients by compliance score
 * @param {Array} patients - List of patients
 * @param {boolean} ascending - Sort order (default: true for ascending)
 * @returns {Array} Sorted patients
 */
export const sortPatientsByCompliance = (patients, ascending = true) => {
  return [...patients].sort((a, b) => {
    const scoreA = a.complianceScore || 0;
    const scoreB = b.complianceScore || 0;
    return ascending ? scoreA - scoreB : scoreB - scoreA;
  });
};
/**
 * Send bulk SMS reminder to multiple patients
 * @param {Array} patientIds - List of patient IDs
 * @param {string} message - Message to send
 * @returns {Promise<Object>} Status response
 */
export const sendBulkReminder = async (patientIds, message) => {
  try {
    // Simulated API call for sending bulk reminders
    console.log(`Sending bulk reminder to ${patientIds.length} patients:`, message);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      status: 'success',
      count: patientIds.length,
      message: `Successfully nudged ${patientIds.length} patients with your clinical reminder.`
    };
  } catch (error) {
    console.error('Error sending bulk reminder:', error);
    throw error;
  }
};
