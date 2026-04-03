import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './constants/routes';

/**
 * Home Component
 * Root component that redirects users to their appropriate dashboard if authenticated,
 * or to the login page if not.
 */
const Home = () => {
  const { isAuthenticated, role, loading } = useAuth();

  // Wait for auth to initialize
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, go to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Redirect based on role
  if (role === 'PATIENT') {
    return <Navigate to={ROUTES.PATIENT_DASHBOARD} replace />;
  }
  
  if (role === 'DOCTOR') {
    return <Navigate to={ROUTES.DOCTOR_DASHBOARD} replace />;
  }

  // Fallback to login if something is unexpected
  return <Navigate to={ROUTES.LOGIN} replace />;
};

export default Home;
