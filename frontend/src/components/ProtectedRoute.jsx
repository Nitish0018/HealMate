import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

/**
 * ProtectedRoute Component
 * Guards routes based on authentication and role-based access control
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} [props.requiredRole] - Required role to access the route ('PATIENT' or 'DOCTOR')
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && role !== requiredRole) {
    // Redirect to unauthorized page for role mismatch
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  // User is authenticated and has correct role (or no role requirement)
  return children;
};

export default ProtectedRoute;
