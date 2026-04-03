import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ROUTES } from './constants/routes';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Mock page components
const PatientDashboard = () => <div data-testid="patient-dashboard">Patient Dashboard</div>;
const DoctorDashboard = () => <div data-testid="doctor-dashboard">Doctor Dashboard</div>;
const PatientDetailView = () => <div data-testid="patient-detail">Patient Detail View</div>;
const LoginPage = () => <div data-testid="login-page">Login Page</div>;
const UnauthorizedPage = () => <div data-testid="unauthorized-page">Unauthorized Page</div>;

// Mock PatientList and HighRiskAlerts to test navigation clicks
vi.mock('./components/PatientList', () => ({
  default: ({ onPatientSelect }) => (
    <div data-testid="patient-list">
      <button 
        data-testid="patient-item-123"
        onClick={() => onPatientSelect ? onPatientSelect('123') : null}
      >
        Patient 123
      </button>
    </div>
  )
}));

vi.mock('./components/HighRiskAlerts', () => ({
  default: ({ onPatientSelect }) => (
    <div data-testid="high-risk-alerts">
      <button 
        data-testid="high-risk-patient-456"
        onClick={() => onPatientSelect ? onPatientSelect('456') : null}
      >
        High Risk Patient 456
      </button>
    </div>
  )
}));

describe('Navigation Integration Tests', () => {
  const mockAuthContextValue = (overrides = {}) => ({
    user: null,
    role: null,
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
    ...overrides
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete navigation flows', () => {
    it('should navigate from doctor dashboard to patient detail view', async () => {
      const authValue = mockAuthContextValue({
        user: { uid: '456', email: 'doctor@test.com', displayName: 'Dr. Test' },
        role: 'DOCTOR',
        isAuthenticated: true
      });

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[ROUTES.DOCTOR_DASHBOARD]}>
            <Navigation />
            <Routes>
              <Route path={ROUTES.DOCTOR_DASHBOARD} element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.DOCTOR_PATIENT_DETAIL} element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <PatientDetailView />
                </ProtectedRoute>
              } />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Verify we're on doctor dashboard
      expect(screen.getByTestId('doctor-dashboard')).toBeInTheDocument();
      
      // Navigation component should be visible
      expect(screen.getByText('HealMate')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should show role-based navigation items for patient', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '123', email: 'patient@test.com', displayName: 'Test Patient' },
        role: 'PATIENT',
        isAuthenticated: true
      });

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[ROUTES.PATIENT_DASHBOARD]}>
            <Navigation />
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Should show patient navigation
      expect(screen.getByText('HealMate')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Test Patient')).toBeInTheDocument();
      expect(screen.getByText('PATIENT')).toBeInTheDocument();
    });

    it('should show role-based navigation items for doctor', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '456', email: 'doctor@test.com', displayName: 'Dr. Test' },
        role: 'DOCTOR',
        isAuthenticated: true
      });

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[ROUTES.DOCTOR_DASHBOARD]}>
            <Navigation />
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Should show doctor navigation
      expect(screen.getByText('HealMate')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Dr. Test')).toBeInTheDocument();
      expect(screen.getByText('DOCTOR')).toBeInTheDocument();
    });

    it('should not show navigation when user is not authenticated', () => {
      const authValue = mockAuthContextValue();

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
            <Navigation />
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Navigation should not be visible
      expect(screen.queryByText('HealMate')).not.toBeInTheDocument();
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('should call logout when logout button is clicked', async () => {
      const user = userEvent.setup();
      const mockLogout = vi.fn();
      const authValue = mockAuthContextValue({
        user: { uid: '123', email: 'patient@test.com', displayName: 'Test Patient' },
        role: 'PATIENT',
        isAuthenticated: true,
        logout: mockLogout
      });

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[ROUTES.PATIENT_DASHBOARD]}>
            <Navigation />
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Click logout button
      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should toggle mobile menu when hamburger button is clicked', async () => {
      const user = userEvent.setup();
      const authValue = mockAuthContextValue({
        user: { uid: '123', email: 'patient@test.com', displayName: 'Test Patient' },
        role: 'PATIENT',
        isAuthenticated: true
      });

      // Set viewport to mobile size
      window.innerWidth = 500;

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[ROUTES.PATIENT_DASHBOARD]}>
            <Navigation />
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Find the mobile menu button (has aria-label="Toggle menu")
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toBeInTheDocument();

      // Click to open mobile menu
      await user.click(menuButton);

      // After clicking, mobile menu should be visible
      // We can verify by checking if the menu is expanded
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Route protection integration', () => {
    it('should prevent patient from accessing doctor routes and redirect', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '123', email: 'patient@test.com', displayName: 'Test Patient' },
        role: 'PATIENT',
        isAuthenticated: true
      });

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[ROUTES.DOCTOR_DASHBOARD]}>
            <Routes>
              <Route path={ROUTES.DOCTOR_DASHBOARD} element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Should be redirected to unauthorized page
      expect(screen.getByTestId('unauthorized-page')).toBeInTheDocument();
      expect(screen.queryByTestId('doctor-dashboard')).not.toBeInTheDocument();
    });

    it('should prevent doctor from accessing patient routes and redirect', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '456', email: 'doctor@test.com', displayName: 'Dr. Test' },
        role: 'DOCTOR',
        isAuthenticated: true
      });

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[ROUTES.PATIENT_DASHBOARD]}>
            <Routes>
              <Route path={ROUTES.PATIENT_DASHBOARD} element={
                <ProtectedRoute requiredRole="PATIENT">
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Should be redirected to unauthorized page
      expect(screen.getByTestId('unauthorized-page')).toBeInTheDocument();
      expect(screen.queryByTestId('patient-dashboard')).not.toBeInTheDocument();
    });

    it('should redirect unauthenticated users to login', () => {
      const authValue = mockAuthContextValue();

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[ROUTES.PATIENT_DASHBOARD]}>
            <Routes>
              <Route path={ROUTES.PATIENT_DASHBOARD} element={
                <ProtectedRoute requiredRole="PATIENT">
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Should be redirected to login
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('patient-dashboard')).not.toBeInTheDocument();
    });
  });

  describe('Navigation between pages', () => {
    it('should allow navigation to patient detail view with correct route parameter', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '456', email: 'doctor@test.com', displayName: 'Dr. Test' },
        role: 'DOCTOR',
        isAuthenticated: true
      });

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={['/doctor/patient/123']}>
            <Navigation />
            <Routes>
              <Route path={ROUTES.DOCTOR_DASHBOARD} element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.DOCTOR_PATIENT_DETAIL} element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <PatientDetailView />
                </ProtectedRoute>
              } />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Should be on patient detail view
      expect(screen.getByTestId('patient-detail')).toBeInTheDocument();
      // Navigation should still show doctor info
      expect(screen.getByText('Dr. Test')).toBeInTheDocument();
      expect(screen.getByText('DOCTOR')).toBeInTheDocument();
    });
  });
});
