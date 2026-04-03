import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DoctorDashboard from './DoctorDashboard';
import { AuthContext } from '../context/AuthContext';

// Mock the components
vi.mock('../components/Navigation', () => ({
  default: () => <div data-testid="navigation">Navigation</div>
}));

vi.mock('../components/PatientList', () => ({
  default: () => <div data-testid="patient-list">Patient List</div>
}));

vi.mock('../components/HighRiskAlerts', () => ({
  default: () => <div data-testid="high-risk-alerts">High Risk Alerts</div>
}));

describe('DoctorDashboard', () => {
  const mockUser = {
    uid: 'doctor123',
    email: 'doctor@test.com',
    displayName: 'Smith',
    role: 'DOCTOR'
  };

  const mockAuthContext = {
    user: mockUser,
    role: 'DOCTOR',
    loading: false,
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn()
  };

  const renderDoctorDashboard = () => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <DoctorDashboard />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the doctor dashboard page', () => {
    renderDoctorDashboard();
    
    expect(screen.getByText('Doctor Dashboard')).toBeInTheDocument();
  });

  it('displays welcome message with doctor name', () => {
    renderDoctorDashboard();
    
    expect(screen.getByText(/Welcome back, Dr\. Smith/i)).toBeInTheDocument();
  });

  it('renders navigation component', () => {
    renderDoctorDashboard();
    
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('renders HighRiskAlerts component', () => {
    renderDoctorDashboard();
    
    expect(screen.getByTestId('high-risk-alerts')).toBeInTheDocument();
  });

  it('renders PatientList component', () => {
    renderDoctorDashboard();
    
    expect(screen.getByTestId('patient-list')).toBeInTheDocument();
  });

  it('displays dashboard statistics section', () => {
    renderDoctorDashboard();
    
    expect(screen.getByText('Total Patients')).toBeInTheDocument();
    expect(screen.getByText(/High Compliance \(≥80%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Compliance \(60-79%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/High Risk \(<60%\)/i)).toBeInTheDocument();
  });

  it('displays quick actions section', () => {
    renderDoctorDashboard();
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('View All Reports')).toBeInTheDocument();
    expect(screen.getByText('Add New Patient')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('displays dashboard guide section', () => {
    renderDoctorDashboard();
    
    expect(screen.getByText('Dashboard Guide')).toBeInTheDocument();
    expect(screen.getByText(/High-Risk Alerts:/i)).toBeInTheDocument();
    expect(screen.getByText(/Search Patients:/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient Details:/i)).toBeInTheDocument();
    expect(screen.getByText(/Auto-Refresh:/i)).toBeInTheDocument();
  });

  it('uses responsive layout classes', () => {
    const { container } = renderDoctorDashboard();
    
    // Check for responsive grid classes
    const mainGrid = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
    expect(mainGrid).toBeInTheDocument();
  });

  it('displays email when displayName is not available', () => {
    const contextWithoutName = {
      ...mockAuthContext,
      user: {
        ...mockUser,
        displayName: null
      }
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={contextWithoutName}>
          <DoctorDashboard />
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Welcome back, Dr\. doctor@test\.com/i)).toBeInTheDocument();
  });
});
