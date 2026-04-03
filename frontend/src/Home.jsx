import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './constants/routes';
import LandingPage from './components/LandingPage';

/**
 * Home Component
 * Root route handler — shows landing page for unauthenticated users,
 * redirects authenticated users based on their role
 */
const Home = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-100">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 bg-forest-500 rounded-full flex items-center justify-center text-cream-50 shadow-warm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-forest-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (role === 'PATIENT') {
    return <Navigate to={ROUTES.PATIENT_DASHBOARD} replace />;
  }

  
  if (role === 'DOCTOR') {
    return <Navigate to={ROUTES.DOCTOR_DASHBOARD} replace />;
  }

  if (role === 'CAREGIVER') {
    return <Navigate to={ROUTES.CAREGIVER_DASHBOARD} replace />;
  }

  return <Navigate to={ROUTES.LOGIN} replace />;
};

export default Home;
