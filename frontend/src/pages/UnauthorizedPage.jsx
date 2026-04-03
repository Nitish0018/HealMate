import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

/**
 * UnauthorizedPage Component
 * Displays when a user tries to access a route they don't have permission for
 * Shows appropriate message and navigation link based on user's role
 * 
 * Validates Requirements 2.1, 2.2:
 * - Patients cannot access doctor-only routes
 * - Doctors cannot access patient-only routes
 */
const UnauthorizedPage = () => {
  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Determine the correct dashboard route based on user's role
  const getDashboardRoute = () => {
    if (role === 'PATIENT') {
      return ROUTES.PATIENT_DASHBOARD;
    } else if (role === 'DOCTOR') {
      return ROUTES.DOCTOR_DASHBOARD;
    }
    return ROUTES.LOGIN;
  };

  // Get role-specific message
  const getRoleMessage = () => {
    if (role === 'PATIENT') {
      return 'This page is only accessible to doctors.';
    } else if (role === 'DOCTOR') {
      return 'This page is only accessible to patients.';
    }
    return 'You do not have permission to access this page.';
  };

  const handleNavigateToDashboard = () => {
    navigate(getDashboardRoute());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          {getRoleMessage()}
        </p>

        {/* Navigation Button */}
        {isAuthenticated && role ? (
          <button
            onClick={handleNavigateToDashboard}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Go to {role === 'PATIENT' ? 'Patient' : 'Doctor'} Dashboard
          </button>
        ) : (
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Go to Login
          </button>
        )}

        {/* Additional Help Text */}
        <p className="mt-6 text-sm text-gray-500">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
