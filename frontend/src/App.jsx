import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';
import PatientDashboard from './pages/PatientDashboard';
import PatientDetailView from './pages/PatientDetailView';
import DoctorDashboard from './pages/DoctorDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProfilePage from './pages/ProfilePage';
import { ROUTES } from './constants/routes';
import Home from './Home';
import './App.css';

function App() {
  return (
    <ErrorBoundary section="App Root">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          {/* Offline detection banner */}
          <OfflineBanner />
          
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
            
            {/* Common protected routes */}
            <Route 
              path={ROUTES.PROFILE} 
              element={
                <ProtectedRoute>
                  <ErrorBoundary section="Profile Page">
                    <ProfilePage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Patient routes - protected with PATIENT role */}
            <Route 
              path={ROUTES.PATIENT_DASHBOARD} 
              element={
                <ProtectedRoute requiredRole="PATIENT">
                  <ErrorBoundary section="Patient Dashboard">
                    <PatientDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Doctor routes - protected with DOCTOR role */}
            <Route 
              path={ROUTES.DOCTOR_DASHBOARD} 
              element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <ErrorBoundary section="Doctor Dashboard">
                    <DoctorDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.DOCTOR_PATIENT_DETAIL} 
              element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <ErrorBoundary section="Patient Detail View">
                    <PatientDetailView />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Caregiver routes - protected with CAREGIVER role */}
            <Route
              path={ROUTES.CAREGIVER_DASHBOARD}
              element={
                <ProtectedRoute requiredRole="CAREGIVER">
                  <ErrorBoundary section="Caregiver Dashboard">
                    <CaregiverDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            {/* Home route handles redirection based on auth state */}
            <Route path="/" element={<Home />} />
            
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
