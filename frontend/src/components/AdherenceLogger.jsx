import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { logMedicationIntake } from '../services/adherenceService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * AdherenceLogger Component
 * Handles medication intake logging with optimistic UI updates
 * 
 * @param {Object} props
 * @param {string} props.medicationId - ID of the medication to log
 * @param {string} props.medicationName - Name of the medication for display
 * @param {string} props.scheduledTime - Scheduled time for the medication
 * @param {Function} props.onSuccess - Callback when logging succeeds
 * @param {Function} props.onError - Callback when logging fails
 * @param {boolean} props.disabled - Whether the logger is disabled
 */
const AdherenceLogger = ({ 
  medicationId, 
  medicationName, 
  scheduledTime, 
  onSuccess, 
  onError,
  disabled = false 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  const handleLogIntake = async () => {
    if (!user || disabled || isLogged) return;

    try {
      setLoading(true);
      setError(null);

      // Optimistic UI update
      setIsLogged(true);

      // Prepare log data
      const logData = {
        medicationId,
        patientId: user.uid,
        subjectId: user.mimic_subject_id,
        scheduledTime,
        actualTime: new Date().toISOString(),
        status: 'taken',
        medicationName
      };

      // Send to backend
      const result = await logMedicationIntake(logData);

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }

    } catch (err) {
      console.error('Error logging medication intake:', err);
      
      // Revert optimistic update
      setIsLogged(false);
      
      const errorMessage = err.response?.data?.message || 'Failed to log medication intake';
      setError(errorMessage);
      
      // Call error callback
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLogged(false);
    handleLogIntake();
  };

  // If already logged, show success state
  if (isLogged && !error) {
    return (
      <div className="flex items-center text-green-600">
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">Logged successfully</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Action Button */}
      <button
        onClick={handleLogIntake}
        disabled={disabled || loading || isLogged}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          disabled || isLogged
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : loading
            ? 'bg-green-400 text-white cursor-wait'
            : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
        }`}
      >
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        {loading ? 'Logging...' : 'Mark as Taken'}
      </button>

      {/* Error Display */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={handleRetry}
          variant="error"
          className="text-sm"
        />
      )}
    </div>
  );
};

/**
 * AdherenceLoggerContainer Component
 * Container component that manages multiple medication logging
 * Provides batch operations and state management
 */
export const AdherenceLoggerContainer = ({ medications, onMedicationLogged }) => {
  const [loggedMedications, setLoggedMedications] = useState(new Set());

  const handleMedicationSuccess = (medicationId, result) => {
    setLoggedMedications(prev => new Set([...prev, medicationId]));
    
    if (onMedicationLogged) {
      onMedicationLogged(medicationId, result);
    }
  };

  const handleMedicationError = (medicationId, error) => {
    setLoggedMedications(prev => {
      const newSet = new Set(prev);
      newSet.delete(medicationId);
      return newSet;
    });
    
    console.error(`Error logging medication ${medicationId}:`, error);
  };

  const isAlreadyLogged = (medicationId) => {
    return loggedMedications.has(medicationId);
  };

  return (
    <div className="space-y-4">
      {medications.map((medication) => (
        <div key={medication.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{medication.name}</h4>
              <p className="text-sm text-gray-600">
                Scheduled: {medication.scheduledTime} | Dosage: {medication.dosage}
              </p>
            </div>
            
            <AdherenceLogger
              medicationId={medication.id}
              medicationName={medication.name}
              scheduledTime={medication.scheduledTime}
              onSuccess={(result) => handleMedicationSuccess(medication.id, result)}
              onError={(error) => handleMedicationError(medication.id, error)}
              disabled={isAlreadyLogged(medication.id)}
            />
          </div>
        </div>
      ))}
      
      {/* Summary */}
      {medications.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            Progress: {loggedMedications.size} of {medications.length} medications logged
          </div>
          {loggedMedications.size === medications.length && (
            <div className="mt-2 text-green-600 font-medium">
              ✓ All medications logged for today!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdherenceLogger;