import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHighRiskPatients } from '../services/doctorService';
import { ROUTES } from '../constants/routes';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * HighRiskAlerts Component
 * Dashboard widget for high-risk patients (compliance score < 60%)
 * Auto-refreshes every 5 minutes
 * 
 * @param {Object} props
 * @param {Function} [props.onPatientSelect] - Optional callback when patient is selected
 */
const HighRiskAlerts = ({ onPatientSelect }) => {
  const navigate = useNavigate();
  const [highRiskPatients, setHighRiskPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch high-risk patients
  const fetchHighRiskPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const patients = await getHighRiskPatients();
      
      // Filter patients with compliance score < 60%
      const filteredPatients = patients.filter(
        patient => patient.complianceScore < 60
      );
      
      // Sort by compliance score ascending (lowest first)
      const sortedPatients = filteredPatients.sort(
        (a, b) => a.complianceScore - b.complianceScore
      );
      
      // Display top 10 high-risk patients
      setHighRiskPatients(sortedPatients.slice(0, 10));
    } catch (err) {
      console.error('Error fetching high-risk patients:', err);
      setError(err.response?.data?.message || 'Failed to load high-risk patients');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchHighRiskPatients();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchHighRiskPatients();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(refreshInterval);
  }, []);

  // Handle patient click - navigate to patient detail view
  const handlePatientClick = (patient) => {
    if (onPatientSelect) {
      onPatientSelect(patient.id || patient._id);
    } else {
      navigate(ROUTES.getPatientDetailRoute(patient.id || patient._id));
    }
  };

  // Get compliance color based on score
  const getComplianceColor = (score) => {
    if (score >= 60) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleRetry = () => {
    fetchHighRiskPatients();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">High-Risk Patient Alerts</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Critical
          </span>
        </div>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">High-Risk Patient Alerts</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Critical
          </span>
        </div>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">High-Risk Patient Alerts</h3>
          {highRiskPatients.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {highRiskPatients.length}
            </span>
          )}
        </div>
        
        {/* Critical Badge */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Critical
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-600 mb-4">
        Patients with compliance score below 60% requiring immediate attention
      </p>

      {/* High-Risk Patient List */}
      {highRiskPatients.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">
            <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">No high-risk patients</p>
          <p className="text-sm text-gray-500 mt-1">
            All patients have compliance scores above 60%
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {highRiskPatients.map((patient) => (
            <div
              key={patient.id || patient._id}
              onClick={() => handlePatientClick(patient)}
              className="border-2 border-red-200 rounded-lg p-3 sm:p-4 hover:border-red-400 hover:shadow-md transition-all cursor-pointer bg-red-50 min-h-[80px] flex items-center"
            >
              <div className="flex items-center justify-between w-full gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Patient Avatar */}
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-medium">
                        {(patient.name || patient.email).charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                        {patient.name || 'Unknown Patient'}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mt-1 gap-1 sm:gap-0">
                        {/* Compliance Score */}
                        <div className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-medium whitespace-nowrap ${getComplianceColor(patient.complianceScore)}`}>
                          {patient.complianceScore}% compliance
                        </div>
                        
                        {/* Consecutive Missed Doses */}
                        {patient.consecutiveMissedDoses > 0 && (
                          <div className="flex items-center text-xs text-red-700">
                            <svg className="h-3 w-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate">{patient.consecutiveMissedDoses} consecutive missed</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Last Missed Date */}
                      {patient.lastMissedDate && (
                        <p className="text-xs text-gray-600 mt-1">
                          Last missed: {formatDate(patient.lastMissedDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Arrow Icon */}
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      {highRiskPatients.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Auto-refreshes every 5 minutes</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
              className="text-blue-600 hover:text-blue-800 font-medium min-h-[44px] sm:min-h-0 text-left sm:text-center"
            >
              Refresh now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighRiskAlerts;
