import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientsList, filterPatientsByName, sortPatientsByCompliance } from '../services/doctorService';
import { ROUTES } from '../constants/routes';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * PatientList Component
 * Displays searchable, filterable list of patients for doctors
 * 
 * @param {Object} props
 * @param {Function} props.onPatientSelect - Callback when patient is selected
 */
const PatientList = ({ onPatientSelect }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const patientsData = await getPatientsList();
        
        // Add mock compliance data since backend doesn't provide it yet
        const patientsWithCompliance = patientsData.map((patient) => ({
          ...patient,
          complianceScore: Math.floor(Math.random() * 40) + 60, // Random 60-100%
          lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random last 7 days
          consecutiveMissedDoses: Math.floor(Math.random() * 5) // Random 0-4 missed doses
        }));

        setPatients(patientsWithCompliance);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError(err.response?.data?.message || 'Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter and sort patients based on search query
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = filterPatientsByName(patients, searchQuery);
    return sortPatientsByCompliance(filtered, true); // Sort ascending (lowest first)
  }, [patients, searchQuery]);

  // Handle patient selection
  const handlePatientClick = (patient) => {
    if (onPatientSelect) {
      onPatientSelect(patient.id || patient._id);
    } else {
      // Navigate to patient detail view
      navigate(ROUTES.getPatientDetailRoute(patient.id || patient._id));
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Get compliance color class
  const getComplianceColor = (score) => {
    if (score >= 80) return 'text-compliance-high bg-green-50 border-green-200';
    if (score >= 60) return 'text-compliance-medium bg-yellow-50 border-yellow-200';
    return 'text-compliance-low bg-red-50 border-red-200';
  };

  // Format last activity date
  const formatLastActivity = (dateString) => {
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
    setError(null);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient List</h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient List</h3>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Patient List ({filteredAndSortedPatients.length})
        </h3>
        
        {/* Search Input - Touch-friendly */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full min-h-[44px] pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Patient List */}
      {filteredAndSortedPatients.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 20H4v-2a3 3 0 015.196-2.121M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-500">
            {searchQuery ? 'No patients found matching your search' : 'No patients assigned'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedPatients.map((patient) => (
            <div
              key={patient.id || patient._id}
              onClick={() => handlePatientClick(patient)}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer min-h-[80px] flex items-center"
            >
              <div className="flex items-center justify-between w-full gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Patient Avatar */}
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm sm:text-base font-medium">
                        {(patient.name || patient.email).charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                        {patient.name || 'Unknown Patient'}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {patient.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Last activity: {formatLastActivity(patient.lastActivity)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Compliance Score and Arrow */}
                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                  <div className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm font-medium whitespace-nowrap ${getComplianceColor(patient.complianceScore)}`}>
                    {patient.complianceScore}%
                  </div>
                  
                  {/* Arrow Icon */}
                  <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* Additional Info - Show on separate line on mobile */}
              {patient.consecutiveMissedDoses > 0 && (
                <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-red-600 w-full">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {patient.consecutiveMissedDoses} consecutive missed doses
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredAndSortedPatients.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-medium text-gray-900">
                {filteredAndSortedPatients.filter(p => p.complianceScore >= 80).length}
              </div>
              <div className="text-green-600">High Compliance</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {filteredAndSortedPatients.filter(p => p.complianceScore >= 60 && p.complianceScore < 80).length}
              </div>
              <div className="text-yellow-600">Medium Compliance</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {filteredAndSortedPatients.filter(p => p.complianceScore < 60).length}
              </div>
              <div className="text-red-600">Low Compliance</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;