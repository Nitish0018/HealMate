// Route constants for the application
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  UNAUTHORIZED: '/unauthorized',
  PROFILE: '/profile',
  CONTACT: '/contact',
  HELP_CENTER: '/help',
  DOCUMENTATION: '/docs',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  HIPAA_COMPLIANCE: '/hipaa-compliance',

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
