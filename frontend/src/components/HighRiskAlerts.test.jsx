import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the doctor service - HOISTED manually to be safe
vi.mock('../services/doctorService', () => ({
  getHighRiskPatients: vi.fn(),
  getPatientsList: vi.fn(),
  getPatientDetail: vi.fn(),
  getClinicalPatientProfile: vi.fn(),
  getComplianceData: vi.fn(),
  getMissedDoses: vi.fn(),
}));

// Now import the mocked function and the component
import { getHighRiskPatients } from '../services/doctorService';
import HighRiskAlerts from './HighRiskAlerts';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HighRiskAlerts Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockHighRiskPatients = [
    {
      id: '1',
      name: 'John Doe',
      complianceScore: 45,
      consecutiveMissedDoses: 5,
      lastMissedDate: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      complianceScore: 55,
      consecutiveMissedDoses: 3,
      lastMissedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Bob Johnson',
      complianceScore: 58,
      consecutiveMissedDoses: 2,
      lastMissedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const mockPatientsAboveThreshold = [
    {
      id: '4',
      name: 'Alice Williams',
      complianceScore: 75,
      consecutiveMissedDoses: 0,
      lastMissedDate: null,
    },
  ];

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <HighRiskAlerts {...props} />
      </BrowserRouter>
    );
  };

  it('should display loading spinner while fetching data', () => {
    getHighRiskPatients.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderComponent();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should display high-risk patients with compliance score < 60%', async () => {
    getHighRiskPatients.mockResolvedValue(mockHighRiskPatients);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    expect(screen.getByText('45% compliance')).toBeInTheDocument();
    expect(screen.getByText('55% compliance')).toBeInTheDocument();
    expect(screen.getByText('58% compliance')).toBeInTheDocument();
  });

  it('should filter out patients with compliance score >= 60%', async () => {
    getHighRiskPatients.mockResolvedValue([
      ...mockHighRiskPatients,
      ...mockPatientsAboveThreshold,
    ]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.queryByText('Alice Williams')).not.toBeInTheDocument();
  });

  it('should sort patients by compliance score in ascending order', async () => {
    const unsortedPatients = [
      { id: '1', name: 'Patient A', complianceScore: 55, consecutiveMissedDoses: 2, lastMissedDate: new Date().toISOString() },
      { id: '2', name: 'Patient B', complianceScore: 40, consecutiveMissedDoses: 4, lastMissedDate: new Date().toISOString() },
      { id: '3', name: 'Patient C', complianceScore: 50, consecutiveMissedDoses: 3, lastMissedDate: new Date().toISOString() },
    ];

    getHighRiskPatients.mockResolvedValue(unsortedPatients);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Patient B')).toBeInTheDocument();
    });

    const patientElements = screen.getAllByRole('heading', { level: 4 });
    expect(patientElements[0]).toHaveTextContent('Patient B');
    expect(patientElements[1]).toHaveTextContent('Patient C');
    expect(patientElements[2]).toHaveTextContent('Patient A');
  });

  it('should display consecutive missed doses for each patient', async () => {
    getHighRiskPatients.mockResolvedValue(mockHighRiskPatients);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('5 consecutive missed')).toBeInTheDocument();
      expect(screen.getByText('3 consecutive missed')).toBeInTheDocument();
      expect(screen.getByText('2 consecutive missed')).toBeInTheDocument();
    });
  });

  it('should navigate to patient detail view when clicking on a patient', async () => {
    getHighRiskPatients.mockResolvedValue(mockHighRiskPatients);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const patientCard = screen.getByText('John Doe').closest('div[class*="cursor-pointer"]');
    fireEvent.click(patientCard);

    expect(mockNavigate).toHaveBeenCalledWith('/doctor/patient/1');
  });

  it('should call onPatientSelect callback when provided', async () => {
    const mockOnPatientSelect = vi.fn();
    getHighRiskPatients.mockResolvedValue(mockHighRiskPatients);

    renderComponent({ onPatientSelect: mockOnPatientSelect });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const patientCard = screen.getByText('John Doe').closest('div[class*="cursor-pointer"]');
    fireEvent.click(patientCard);

    expect(mockOnPatientSelect).toHaveBeenCalledWith('1');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should display message when no high-risk patients exist', async () => {
    getHighRiskPatients.mockResolvedValue([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No high-risk patients')).toBeInTheDocument();
    });
  });

  it('should display error message when API call fails', async () => {
    const errorMessage = 'Custom error message';
    getHighRiskPatients.mockRejectedValue(new Error(errorMessage));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Failed to load high-risk patients')).toBeInTheDocument();
    });
  });

  it('should retry fetching data when retry button is clicked', async () => {
    getHighRiskPatients
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockHighRiskPatients);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it.skip('should auto-refresh data every 5 minutes', async () => {
    vi.useFakeTimers();
    getHighRiskPatients.mockResolvedValue(mockHighRiskPatients);

    renderComponent();

    // Initial fetch
    await vi.advanceTimersByTimeAsync(100);
    expect(getHighRiskPatients).toHaveBeenCalledTimes(1);

    // Fast-forward 5 minutes
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

    // Verify it was called again
    expect(getHighRiskPatients).toHaveBeenCalledTimes(2);
    
    vi.useRealTimers();
  });

  it('should display top 10 high-risk patients only', async () => {
    const manyPatients = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Patient ${i + 1}`,
      complianceScore: 30 + i,
      consecutiveMissedDoses: i,
      lastMissedDate: new Date().toISOString(),
    }));

    getHighRiskPatients.mockResolvedValue(manyPatients);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Patient 1')).toBeInTheDocument();
    });

    const patientCards = screen.getAllByRole('heading', { level: 4 });
    expect(patientCards).toHaveLength(10);
  });

  it('should display last missed date in human-readable format', async () => {
    const today = new Date();
    const patientsWithDates = [
      {
        id: '1',
        name: 'Patient Today',
        complianceScore: 45,
        consecutiveMissedDoses: 1,
        lastMissedDate: today.toISOString(),
      },
    ];

    getHighRiskPatients.mockResolvedValue(patientsWithDates);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Last missed: Today/i)).toBeInTheDocument();
    });
  });

  it('should allow manual refresh via refresh button', async () => {
    getHighRiskPatients.mockResolvedValue(mockHighRiskPatients);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(getHighRiskPatients).toHaveBeenCalledTimes(1);

    const refreshButton = screen.getByRole('button', { name: /refresh now/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(getHighRiskPatients).toHaveBeenCalledTimes(2);
    });
  });
});
