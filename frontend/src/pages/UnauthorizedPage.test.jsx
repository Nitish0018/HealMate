import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UnauthorizedPage from './UnauthorizedPage';
import { AuthContext } from '../context/AuthContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('UnauthorizedPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithAuth = (authValue) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <UnauthorizedPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  it('displays access denied header', () => {
    const authValue = {
      role: 'PATIENT',
      isAuthenticated: true,
      user: { uid: '123', email: 'patient@test.com' },
      loading: false,
    };

    renderWithAuth(authValue);
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('displays patient-specific message when patient tries to access doctor route', () => {
    const authValue = {
      role: 'PATIENT',
      isAuthenticated: true,
      user: { uid: '123', email: 'patient@test.com' },
      loading: false,
    };

    renderWithAuth(authValue);
    
    expect(screen.getByText('This page is only accessible to doctors.')).toBeInTheDocument();
  });

  it('displays doctor-specific message when doctor tries to access patient route', () => {
    const authValue = {
      role: 'DOCTOR',
      isAuthenticated: true,
      user: { uid: '456', email: 'doctor@test.com' },
      loading: false,
    };

    renderWithAuth(authValue);
    
    expect(screen.getByText('This page is only accessible to patients.')).toBeInTheDocument();
  });

  it('displays generic message when role is unknown', () => {
    const authValue = {
      role: null,
      isAuthenticated: false,
      user: null,
      loading: false,
    };

    renderWithAuth(authValue);
    
    expect(screen.getByText('You do not have permission to access this page.')).toBeInTheDocument();
  });

  it('shows "Go to Patient Dashboard" button for patient users', () => {
    const authValue = {
      role: 'PATIENT',
      isAuthenticated: true,
      user: { uid: '123', email: 'patient@test.com' },
      loading: false,
    };

    renderWithAuth(authValue);
    
    expect(screen.getByText('Go to Patient Dashboard')).toBeInTheDocument();
  });

  it('shows "Go to Doctor Dashboard" button for doctor users', () => {
    const authValue = {
      role: 'DOCTOR',
      isAuthenticated: true,
      user: { uid: '456', email: 'doctor@test.com' },
      loading: false,
    };

    renderWithAuth(authValue);
    
    expect(screen.getByText('Go to Doctor Dashboard')).toBeInTheDocument();
  });

  it('shows "Go to Login" button for unauthenticated users', () => {
    const authValue = {
      role: null,
      isAuthenticated: false,
      user: null,
      loading: false,
    };

    renderWithAuth(authValue);
    
    expect(screen.getByText('Go to Login')).toBeInTheDocument();
  });

  it('navigates to patient dashboard when patient clicks button', () => {
    const authValue = {
      role: 'PATIENT',
      isAuthenticated: true,
      user: { uid: '123', email: 'patient@test.com' },
      loading: false,
    };

    renderWithAuth(authValue);
    
    const button = screen.getByText('Go to Patient Dashboard');
    fireEvent.click(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('/patient/dashboard');
  });

  it('navigates to doctor dashboard when doctor clicks button', () => {
    const authValue = {
      role: 'DOCTOR',
      isAuthenticated: true,
      user: { uid: '456', email: 'doctor@test.com' },
      loading: false,
    };

    renderWithAuth(authValue);
    
    const button = screen.getByText('Go to Doctor Dashboard');
    fireEvent.click(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('/doctor/dashboard');
  });

  it('navigates to login when unauthenticated user clicks button', () => {
    const authValue = {
      role: null,
      isAuthenticated: false,
      user: null,
      loading: false,
    };

    renderWithAuth(authValue);
    
    const button = screen.getByText('Go to Login');
    fireEvent.click(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('displays support contact message', () => {
    const authValue = {
      role: 'PATIENT',
      isAuthenticated: true,
      user: { uid: '123', email: 'patient@test.com' },
      loading: false,
    };

    renderWithAuth(authValue);
    
    expect(screen.getByText('If you believe this is an error, please contact support.')).toBeInTheDocument();
  });
});
