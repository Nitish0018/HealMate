import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

// Test components
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;
const LoginPage = () => <div data-testid="login-page">Login Page</div>;
const PatientDashboard = () => <div data-testid="patient-dashboard">Patient Dashboard</div>;
const DoctorDashboard = () => <div data-testid="doctor-dashboard">Doctor Dashboard</div>;
const UnauthorizedPage = () => <div data-testid="unauthorized-page">Unauthorized Page</div>;

describe('ProtectedRoute - Navigation and Access Control', () => {
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

  describe('Requirement 1.1: Unauthenticated redirect to login', () => {
    it('should redirect unauthenticated users to login page', () => {
      const authValue = mockAuthContextValue();

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route path="/protected" element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect unauthenticated users accessing patient dashboard', () => {
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

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('patient-dashboard')).not.toBeInTheDocument();
    });

    it('should redirect unauthenticated users accessing doctor dashboard', () => {
      const authValue = mockAuthContextValue();

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[ROUTES.DOCTOR_DASHBOARD]}>
            <Routes>
              <Route path={ROUTES.DOCTOR_DASHBOARD} element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('doctor-dashboard')).not.toBeInTheDocument();
    });
  });

  describe('Requirement 2.1: Patients cannot access doctor-only routes', () => {
    it('should redirect patient to unauthorized page when accessing doctor dashboard', () => {
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

      expect(screen.getByTestId('unauthorized-page')).toBeInTheDocument();
      expect(screen.queryByTestId('doctor-dashboard')).not.toBeInTheDocument();
    });

    it('should redirect patient to unauthorized page when accessing patient detail view', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '123', email: 'patient@test.com', displayName: 'Test Patient' },
        role: 'PATIENT',
        isAuthenticated: true
      });

      const PatientDetailView = () => <div data-testid="patient-detail">Patient Detail</div>;

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={['/doctor/patient/456']}>
            <Routes>
              <Route path="/doctor/patient/:patientId" element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <PatientDetailView />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId('unauthorized-page')).toBeInTheDocument();
      expect(screen.queryByTestId('patient-detail')).not.toBeInTheDocument();
    });
  });

  describe('Requirement 2.2: Doctors cannot access patient-only routes', () => {
    it('should redirect doctor to unauthorized page when accessing patient dashboard', () => {
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

      expect(screen.getByTestId('unauthorized-page')).toBeInTheDocument();
      expect(screen.queryByTestId('patient-dashboard')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated access to correct routes', () => {
    it('should allow authenticated patient to access patient dashboard', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '123', email: 'patient@test.com', displayName: 'Test Patient' },
        role: 'PATIENT',
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
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId('patient-dashboard')).toBeInTheDocument();
    });

    it('should allow authenticated doctor to access doctor dashboard', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '456', email: 'doctor@test.com', displayName: 'Dr. Test' },
        role: 'DOCTOR',
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
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId('doctor-dashboard')).toBeInTheDocument();
    });

    it('should allow authenticated doctor to access patient detail view', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '456', email: 'doctor@test.com', displayName: 'Dr. Test' },
        role: 'DOCTOR',
        isAuthenticated: true
      });

      const PatientDetailView = () => <div data-testid="patient-detail">Patient Detail</div>;

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={['/doctor/patient/123']}>
            <Routes>
              <Route path="/doctor/patient/:patientId" element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <PatientDetailView />
                </ProtectedRoute>
              } />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId('patient-detail')).toBeInTheDocument();
    });

    it('should allow authenticated user to access route without role requirement', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '123', email: 'user@test.com', displayName: 'Test User' },
        role: 'PATIENT',
        isAuthenticated: true
      });

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route path="/protected" element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              } />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should show loading spinner while authentication is loading', () => {
      const authValue = mockAuthContextValue({ loading: true });

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route path="/protected" element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              } />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Check for loading spinner (it has a specific class)
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Unknown role handling', () => {
    it('should redirect to unauthorized page when user has unknown role', () => {
      const authValue = mockAuthContextValue({
        user: { uid: '789', email: 'unknown@test.com', displayName: 'Unknown User' },
        role: 'UNKNOWN_ROLE',
        isAuthenticated: true
      });

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route path="/protected" element={
                <ProtectedRoute requiredRole="PATIENT">
                  <TestComponent />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId('unauthorized-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });
});
