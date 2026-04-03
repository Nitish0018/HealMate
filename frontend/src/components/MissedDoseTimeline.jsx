import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * MissedDoseTimeline Component
 * Displays chronological list of missed medications for a patient
 * 
 * @param {Object} props
 * @param {string} props.patientId - Patient ID to fetch missed doses for
 */
const MissedDoseTimeline = ({ patientId }) => {
  const [missedDoses, setMissedDoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch missed doses data
  useEffect(() => {
    const fetchMissedDoses = async () => {
      if (!patientId) {
        setMissedDoses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Since backend doesn't have missed doses endpoint yet, generate mock data
        const mockMissedDoses = generateMockMissedDoses();
        setMissedDoses(mockMissedDoses);

      } catch (err) {
        console.error('Error fetching missed doses:', err);
        setError(err.response?.data?.message || 'Failed to load missed doses');
      } finally {
        setLoading(false);
      }
    };

    fetchMissedDoses();
  }, [patientId]);

  // Generate mock missed doses data
  const generateMockMissedDoses = () => {
    const now = new Date();
    const missedDoses = [];
    
    // Generate random missed doses over the last 30 days
    const medicationNames = [
      'Lisinopril 10mg',
      'Metformin 500mg',
      'Atorvastatin 20mg',
      'Amlodipine 5mg',
      'Omeprazole 20mg',
      'Aspirin 81mg',
      'Levothyroxine 50mcg'
    ];

    const timeSlots = ['08:00', '12:00', '18:00', '22:00'];
    
    // Randomly generate 5-15 missed doses
    const numMissedDoses = Math.floor(Math.random() * 11) + 5;
    
    for (let i = 0; i < numMissedDoses; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      
      const medicationName = medicationNames[Math.floor(Math.random() * medicationNames.length)];
      const scheduledTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      
      missedDoses.push({
        id: `missed-${i}`,
        medicationName,
        scheduledTime,
        date: date.toISOString(),
        daysSinceOccurred: daysAgo
      });
    }

    // Sort by date and time descending (most recent first)
    return missedDoses.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Get severity color based on how recent the missed dose was
  const getSeverityColor = (daysSince) => {
    if (daysSince <= 1) return 'border-red-300 bg-red-50';
    if (daysSince <= 7) return 'border-orange-300 bg-orange-50';
    return 'border-yellow-300 bg-yellow-50';
  };

  // Get severity icon
  const getSeverityIcon = (daysSince) => {
    if (daysSince <= 1) {
      return (
        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    if (daysSince <= 7) {
      return (
        <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    );
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  if (!patientId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Missed Dose Timeline</h3>
        <div className="text-center py-8 text-gray-500">
          Select a patient to view missed doses
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Missed Dose Timeline</h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Missed Dose Timeline</h3>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Missed Dose Timeline
        </h3>
        <span className="text-xs sm:text-sm text-gray-500">
          Last 30 days
        </span>
      </div>

      {missedDoses.length === 0 ? (
        // Perfect adherence message
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Perfect Adherence!</h4>
          <p className="text-gray-600">
            This patient has not missed any doses in the last 30 days.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Stats - Responsive: stack on mobile */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-red-600">
                  {missedDoses.filter(d => d.daysSinceOccurred <= 1).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Recent (1-2 days)</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-orange-600">
                  {missedDoses.filter(d => d.daysSinceOccurred > 1 && d.daysSinceOccurred <= 7).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">This week</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {missedDoses.filter(d => d.daysSinceOccurred > 7).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Older</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flow-root">
            <ul className="-mb-8">
              {missedDoses.map((dose, index) => (
                <li key={dose.id}>
                  <div className="relative pb-8">
                    {index !== missedDoses.length - 1 && (
                      <span 
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
                        aria-hidden="true" 
                      />
                    )}
                    
                    <div className="relative flex space-x-3">
                      {/* Icon */}
                      <div className="relative">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getSeverityColor(dose.daysSinceOccurred)}`}>
                          {getSeverityIcon(dose.daysSinceOccurred)}
                        </div>
                      </div>
                      
                      {/* Content - Responsive layout */}
                      <div className="min-w-0 flex-1">
                        <div className={`border rounded-lg p-3 sm:p-4 ${getSeverityColor(dose.daysSinceOccurred)}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm sm:text-base font-medium text-gray-900 break-words">
                                {dose.medicationName}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600">
                                Scheduled for {dose.scheduledTime}
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-xs sm:text-sm font-medium text-gray-900">
                                {formatDate(dose.date)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(dose.date).toLocaleDateString('en-US', { 
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Recommendations */}
          {missedDoses.length > 0 && (
            <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-medium text-blue-900 mb-2">
                Recommendations
              </h4>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                {missedDoses.filter(d => d.daysSinceOccurred <= 1).length > 0 && (
                  <li>• Contact patient immediately about recent missed doses</li>
                )}
                {missedDoses.length >= 5 && (
                  <li>• Consider medication adherence counseling</li>
                )}
                {missedDoses.filter(d => d.daysSinceOccurred <= 7).length >= 3 && (
                  <li>• Review medication schedule and barriers to adherence</li>
                )}
                <li>• Schedule follow-up appointment to discuss adherence strategies</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MissedDoseTimeline;