import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

/**
 * UnauthorizedPage Component
 * Raus-inspired: warm, minimalist error state
 */
const UnauthorizedPage = () => {
  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getDashboardRoute = () => {
    if (role === 'PATIENT') {
      return ROUTES.PATIENT_DASHBOARD;
    } else if (role === 'DOCTOR') {
      return ROUTES.DOCTOR_DASHBOARD;
    }
    return ROUTES.LOGIN;
  };

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
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-5">
      {/* Decorative */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-red-50/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gold-50/40 blur-3xl" />
      </div>

      <div className="relative z-10 card-warm w-full max-w-md text-center animate-fade-in">
        {/* Icon */}
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <svg
              className="w-7 h-7 text-compliance-low"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
        <h1 className="font-serif text-3xl text-forest-500 mb-3">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-forest-500/40 mb-8 font-light">
          {getRoleMessage()}
        </p>

        {/* Navigation */}
        {isAuthenticated && role ? (
          <button
            onClick={handleNavigateToDashboard}
            className="w-full btn-pill-primary py-4"
            id="unauthorized-dashboard-btn"
          >
            Go to {role === 'PATIENT' ? 'Patient' : 'Doctor'} Dashboard →
          </button>
        ) : (
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="w-full btn-pill-primary py-4"
            id="unauthorized-login-btn"
          >
            Go to Sign In →
          </button>
        )}

        <p className="mt-6 text-sm text-forest-500/30">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
