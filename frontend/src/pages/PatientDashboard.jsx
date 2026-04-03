import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';
import MedicationSchedule from '../components/MedicationSchedule';
import AdherenceVisualization from '../components/AdherenceVisualization';
import { logMedicationIntake } from '../services/adherenceService';
import ErrorMessage from '../components/ErrorMessage';
import AddMedicationModal from '../components/AddMedicationModal';
import { addMedication } from '../services/medicationService';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle medication intake logging
  const handleLogIntake = async (medicationId) => {
    try {
      setError(null);
      setSuccessMessage(null);

      const logData = {
        medicationId,
        patientId: user.uid,
        subjectId: user.mimic_subject_id,
        scheduledTime: new Date().toISOString(),
        actualTime: new Date().toISOString(),
        status: 'taken'
      };

      await logMedicationIntake(logData);
      
      setSuccessMessage('Medication logged successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error logging medication:', err);
      setError(err.response?.data?.message || 'Failed to log medication intake');
    }
  };

  const handleAddMedication = async (medicationData) => {
    try {
      setError(null);
      await addMedication(medicationData);
      setSuccessMessage('New medication added to your schedule!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsModalOpen(false);
      // Trigger update of MedicationSchedule by incrementing a key if needed,
      // but for now let's hope it refetches or user refreshes.
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medication');
    }
  };

  // Handle date selection
  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
  };

  // Format date for input
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Get date navigation buttons
  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isPastDate = selectedDate < new Date().setHours(0, 0, 0, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.displayName || user?.email}
            </h1>
            <p className="mt-2 text-gray-600">
              Track your medications and monitor your adherence progress
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:shadow-lg active:scale-95"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Medication
          </button>
        </div>

        {/* Global Messages */}
        {error && (
          <div className="mb-6">
            <ErrorMessage 
              message={error} 
              onRetry={() => setError(null)}
            />
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Main Content Grid - Responsive: stack on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Medication Schedule */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Date Selector */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h2>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Previous Day Button - Touch-friendly 44x44px minimum */}
                <button
                  onClick={() => navigateDate(-1)}
                  className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2 border border-gray-300 rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  aria-label="Previous day"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Date Input - Touch-friendly height */}
                <div className="flex-1">
                  <input
                    type="date"
                    value={formatDateForInput(selectedDate)}
                    onChange={handleDateChange}
                    className="block w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Next Day Button - Touch-friendly 44x44px minimum */}
                <button
                  onClick={() => navigateDate(1)}
                  className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2 border border-gray-300 rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  aria-label="Next day"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Today Button - Touch-friendly 44x44px minimum */}
                {!isToday && (
                  <button
                    onClick={() => setSelectedDate(new Date())}
                    className="inline-flex items-center justify-center min-h-[44px] px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
                  >
                    Today
                  </button>
                )}
              </div>

              {/* Date Status Indicators */}
              <div className="mt-4 flex items-center space-x-4 text-sm">
                {isToday && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Today
                  </span>
                )}
                {isPastDate && !isToday && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Past Date
                  </span>
                )}
                {selectedDate > new Date() && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Future Date
                  </span>
                )}
              </div>
            </div>

            {/* Medication Schedule */}
            <MedicationSchedule 
              date={selectedDate}
              onLogIntake={handleLogIntake}
            />
          </div>

          {/* Right Column - Adherence Visualization */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <AdherenceVisualization />
            </div>
          </div>
        </div>

        {/* Quick Stats - Responsive: stack on mobile, 3 columns on tablet+ */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {isToday ? 'Today' : selectedDate.toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">Selected Date</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              Active
            </div>
            <div className="text-sm text-gray-600">Medication Tracking</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {user?.role || 'Patient'}
            </div>
            <div className="text-sm text-gray-600">Account Type</div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            How to use your dashboard
          </h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>• Use the date selector to view medications for different days</p>
            <p>• Click "Mark as Taken" when you take your medications</p>
            <p>• Monitor your adherence progress in the right panel</p>
            <p>• Green indicators show good adherence (≥80%)</p>
            <p>• Yellow indicators suggest room for improvement (60-79%)</p>
            <p>• Red indicators need attention (&lt;60%)</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddMedicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMedication}
        patientId={user?.uid}
      />
    </div>
  );
};

export default PatientDashboard;