import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';
import PatientList from '../components/PatientList';
import HighRiskAlerts from '../components/HighRiskAlerts';

/**
 * DoctorDashboard Page
 * Main dashboard for doctors to monitor patients and view high-risk alerts
 * 
 * Features:
 * - High-risk patient alerts section (top priority)
 * - Patient list with search functionality
 * - Responsive layout using Tailwind CSS
 * 
 * Requirements: 6.1, 9.1, 10.1, 10.2
 */
const DoctorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Doctor Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back, Dr. {user?.displayName || user?.email}
          </p>
          <p className="text-sm text-gray-500">
            Monitor your patients and identify those requiring immediate attention
          </p>
        </div>

        {/* Main Content - Responsive Grid Layout: stack on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - High-Risk Alerts (Priority Section) */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <div className="lg:sticky lg:top-8">
              <HighRiskAlerts />
            </div>
          </div>

          {/* Right Column - Patient List with Search */}
          <div className="lg:col-span-2 order-2 lg:order-2">
            <PatientList />
          </div>
        </div>

        {/* Dashboard Statistics - Responsive: stack on mobile, 2 cols on tablet, 4 cols on desktop */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Patients */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 20H4v-2a3 3 0 015.196-2.121M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              --
            </div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </div>

          {/* High Compliance */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              --
            </div>
            <div className="text-sm text-gray-600">High Compliance (≥80%)</div>
          </div>

          {/* Medium Compliance */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              --
            </div>
            <div className="text-sm text-gray-600">Medium Compliance (60-79%)</div>
          </div>

          {/* High Risk */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-1">
              --
            </div>
            <div className="text-sm text-gray-600">High Risk (&lt;60%)</div>
          </div>
        </div>

        {/* Quick Actions - Responsive: stack on mobile, 2 cols on tablet, 3 cols on desktop */}
        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-blue-900 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <button className="flex items-center justify-center min-h-[44px] px-4 py-3 bg-white border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="truncate">View All Reports</span>
            </button>
            
            <button className="flex items-center justify-center min-h-[44px] px-4 py-3 bg-white border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="truncate">Add New Patient</span>
            </button>
            
            <button className="flex items-center justify-center min-h-[44px] px-4 py-3 bg-white border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium sm:col-span-2 lg:col-span-1">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="truncate">Analytics Dashboard</span>
            </button>
          </div>
        </div>

        {/* Help Section - Responsive: stack on mobile, 2 cols on tablet */}
        <div className="mt-6 sm:mt-8 bg-gray-100 border border-gray-300 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">
            Dashboard Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-medium">High-Risk Alerts:</span> Patients with compliance below 60% requiring immediate attention
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div>
                <span className="font-medium">Search Patients:</span> Use the search bar to quickly find specific patients by name
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-medium">Patient Details:</span> Click on any patient to view detailed adherence history and missed doses
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="font-medium">Auto-Refresh:</span> High-risk alerts automatically refresh every 5 minutes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
