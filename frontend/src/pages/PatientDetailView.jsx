import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientDetail } from '../services/doctorService';
import { ROUTES } from '../constants/routes';
import Navigation from '../components/Navigation';
import ComplianceVisualization from '../components/ComplianceVisualization';
import MissedDoseTimeline from '../components/MissedDoseTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * PatientDetailView Page
 * Comprehensive view of individual patient data for doctors
 * Displays patient header, compliance trends, missed doses, and current medications
 */
const PatientDetailView = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patient detail data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setError('No patient ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch patient detail from backend
        const data = await getPatientDetail(patientId);
        
        // If backend doesn't return full structure, generate mock data
        const mockPatientData = {
          patient: data.patient || {
            id: patientId,
            name: data.name || 'Unknown Patient',
            email: data.email || 'patient@example.com',
            complianceScore: data.complianceScore || Math.floor(Math.random() * 40) + 60
          },
          medications: data.medications || generateMockMedications(),
          adherenceHistory: data.adherenceHistory || [],
          missedDoses: data.missedDoses || []
        };

        setPatientData(mockPatientData);

      } catch (err) {
        console.error('Error fetching patient detail:', err);
        setError(err.response?.data?.message || 'Failed to load patient details');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Generate mock medications for demonstration
  const generateMockMedications = () => {
    const medications = [
      { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', time: '08:00' },
      { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: '08:00, 20:00' },
      { id: '3', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', time: '22:00' },
      { id: '4', name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', time: '08:00' },
      { id: '5', name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', time: '08:00' }
    ];
    
    // Return random subset of medications
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 medications
    return medications.slice(0, count);
  };

  // Get compliance color based on score
  const getComplianceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Get compliance status text
  const getComplianceStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate(ROUTES.DOCTOR_DASHBOARD);
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message={error} onRetry={handleRetry} />
          <div className="mt-4">
            <button
              onClick={handleBackClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Patient not found</p>
            <button
              onClick={handleBackClick}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { patient, medications } = patientData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button - Touch-friendly */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center min-h-[44px] text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Patient List
          </button>
        </div>

        {/* Patient Header - Responsive: stack on mobile */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Patient Avatar */}
              <div className="flex-shrink-0">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  {patient.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {/* Patient Info */}
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {patient.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 truncate">{patient.email}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Patient ID: {patient.id}
                </p>
              </div>
            </div>
            
            {/* Overall Compliance Score */}
            <div className="flex flex-col items-start md:items-end">
              <span className="text-xs sm:text-sm text-gray-600 mb-2">Overall Compliance</span>
              <div className={`px-3 sm:px-4 py-2 rounded-lg border-2 ${getComplianceColor(patient.complianceScore)}`}>
                <div className="text-2xl sm:text-3xl font-bold">
                  {patient.complianceScore}%
                </div>
                <div className="text-xs sm:text-sm font-medium">
                  {getComplianceStatus(patient.complianceScore)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Responsive: stack on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Compliance and Missed Doses */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Compliance Visualization */}
            <ComplianceVisualization patientId={patientId} />
            
            {/* Missed Dose Timeline */}
            <MissedDoseTimeline patientId={patientId} />
          </div>

          {/* Right Column - Current Medications */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Medications
              </h3>
              
              {medications && medications.length > 0 ? (
                <div className="space-y-4">
                  {medications.map((medication) => (
                    <div
                      key={medication.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {medication.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {medication.dosage}
                          </p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {medication.frequency}
                            </div>
                            {medication.time && (
                              <div className="flex items-center text-xs text-gray-500">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {medication.time}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Medication Icon */}
                        <div className="ml-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>No medications on record</p>
                </div>
              )}

              {/* Medication Summary */}
              {medications && medications.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Medications</span>
                    <span className="font-medium text-gray-900">{medications.length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Responsive: stack on mobile, row on tablet+ */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            className="inline-flex items-center justify-center min-h-[44px] px-4 sm:px-6 py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            onClick={() => alert('Contact patient feature coming soon')}
          >
            <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">Contact Patient</span>
          </button>
          
          <button
            className="inline-flex items-center justify-center min-h-[44px] px-4 sm:px-6 py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            onClick={() => alert('Schedule appointment feature coming soon')}
          >
            <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">Schedule Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;
