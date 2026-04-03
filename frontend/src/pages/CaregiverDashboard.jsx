import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';

const CaregiverDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="mb-8">
              <h1 className="text-3xl flex items-center font-bold text-gray-900">
                Caregiver Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back, {user?.name || 'Caregiver'}. Here is the overview of your dependents.
              </p>
            </div>

            {loading ? (
              <LoadingSpinner message="Loading dependents data..." />
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Caregiver features are currently in development. You will soon be able to monitor patient adherence and receive alerts.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaregiverDashboard;