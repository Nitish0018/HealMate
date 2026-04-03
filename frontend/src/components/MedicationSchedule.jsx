import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getPatientMedications } from '../services/medicationService';
import { getPatientAdherenceLogs } from '../services/adherenceService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * MedicationSchedule Component
 * Displays daily medication schedule with intake status
 * 
 * @param {Object} props
 * @param {Date} props.date - Selected date for medication schedule
 * @param {Function} props.onLogIntake - Callback for logging medication intake
 */
const MedicationSchedule = ({ date, onLogIntake }) => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [adherenceLogs, setAdherenceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date for display and API calls
  const selectedDate = useMemo(() => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }, [date]);

  const currentTime = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes(); // Convert to minutes for comparison
  }, []);

  // Fetch medications and adherence logs
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.mimic_subject_id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch medications and adherence logs in parallel
        const [medsResponse, logsResponse] = await Promise.all([
          getPatientMedications(user.mimic_subject_id),
          getPatientAdherenceLogs(user.mimic_subject_id)
        ]);

        setMedications(medsResponse || []);
        setAdherenceLogs(logsResponse || []);
      } catch (err) {
        console.error('Error fetching medication data:', err);
        setError(err.response?.data?.message || 'Failed to load medication schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.mimic_subject_id, selectedDate]);

  // Process medications into daily schedule with simulated times
  const dailySchedule = useMemo(() => {
    if (!medications.length) return [];

    // Create a daily schedule by assigning typical medication times
    const schedule = medications.map((med, index) => {
      // Simulate different medication times throughout the day
      const timeSlots = ['08:00', '12:00', '18:00', '22:00'];
      const scheduledTime = timeSlots[index % timeSlots.length];
      
      // Convert scheduled time to minutes for comparison
      const [hours, minutes] = scheduledTime.split(':').map(Number);
      const scheduledMinutes = hours * 60 + minutes;

      // Check if medication was taken today
      const todayLog = adherenceLogs.find(log => {
        const logDate = new Date(log.timestamp || log.createdAt);
        return logDate.toDateString() === date.toDateString() && 
               log.medicationId === med._id;
      });

      // Determine status based on time and logs
      let status = 'pending';
      if (todayLog) {
        status = todayLog.status || 'taken';
      } else if (scheduledMinutes < currentTime && date.toDateString() === new Date().toDateString()) {
        status = 'missed';
      }

      return {
        id: med._id || `med-${index}`,
        name: med.drug || med.drug_name_poe || 'Unknown Medication',
        dosage: `${med.dose_val_rx || ''} ${med.dose_unit_rx || ''}`.trim() || 'As prescribed',
        scheduledTime,
        scheduledMinutes,
        status,
        route: med.route || 'Oral',
        adherenceLogId: todayLog?._id,
        originalMed: med
      };
    });

    // Sort by scheduled time (ascending order)
    return schedule.sort((a, b) => a.scheduledMinutes - b.scheduledMinutes);
  }, [medications, adherenceLogs, date, currentTime]);

  const handleRetry = () => {
    // Trigger re-fetch by updating a dependency
    setError(null);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Medication Schedule - {date.toLocaleDateString()}
        </h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Medication Schedule - {date.toLocaleDateString()}
        </h3>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (!dailySchedule.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Medication Schedule - {date.toLocaleDateString()}
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 11.172V5L8 4z" />
            </svg>
          </div>
          <p className="text-gray-500">No medications scheduled for this date</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
        Medication Schedule - {date.toLocaleDateString()}
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {dailySchedule.map((medication) => {
          const isCurrentTime = date.toDateString() === new Date().toDateString() && 
                               Math.abs(medication.scheduledMinutes - currentTime) <= 30; // Within 30 minutes
          
          return (
            <div
              key={medication.id}
              className={`border rounded-lg p-3 sm:p-4 transition-all ${
                isCurrentTime 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0">
                <div className="flex-1 w-full sm:w-auto">
                  <div className="flex items-start sm:items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 break-words">
                        {medication.name}
                      </h4>
                      <div className="mt-1 text-xs sm:text-sm text-gray-600 space-y-1">
                        <p>Dosage: {medication.dosage}</p>
                        <p>Route: {medication.route}</p>
                        <p className="font-medium">Scheduled: {medication.scheduledTime}</p>
                      </div>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center flex-shrink-0">
                      {medication.status === 'taken' && (
                        <div className="flex items-center text-status-taken">
                          <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Taken</span>
                        </div>
                      )}
                      
                      {medication.status === 'missed' && (
                        <div className="flex items-center text-status-missed">
                          <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Missed</span>
                        </div>
                      )}
                      
                      {medication.status === 'pending' && (
                        <div className="flex items-center text-status-pending">
                          <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Button - Touch-friendly 44x44px minimum */}
                {medication.status === 'pending' && onLogIntake && (
                  <div className="ml-2 sm:ml-4">
                    <button
                      onClick={() => onLogIntake(medication.id)}
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[120px] px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors whitespace-nowrap"
                    >
                      Mark as Taken
                    </button>
                  </div>
                )}
              </div>
              
              {/* Current Time Indicator */}
              {isCurrentTime && (
                <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Time to take this medication
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicationSchedule;