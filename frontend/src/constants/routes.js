// Route constants for the application
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  UNAUTHORIZED: '/unauthorized',
  PROFILE: '/profile',
  
  // Patient routes
  PATIENT_DASHBOARD: '/patient/dashboard',
  
  // Doctor routes
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  DOCTOR_PATIENT_DETAIL: '/doctor/patient/:patientId',

  // Caregiver routes
  CAREGIVER_DASHBOARD: '/caregiver/dashboard',

  // Helper function to generate patient detail route
  getPatientDetailRoute: (patientId) => `/doctor/patient/${patientId}`,
};
