import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AuthContext } from '../context/AuthContext';

const DocumentationPage = () => {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('introduction');

  const handleDashboardRedirect = () => {
    switch (role) {
      case 'PATIENT':
        return navigate(ROUTES.PATIENT_DASHBOARD);
      case 'DOCTOR':
        return navigate(ROUTES.DOCTOR_DASHBOARD);
      case 'CAREGIVER':
        return navigate(ROUTES.CAREGIVER_DASHBOARD);
      default:
        return navigate('/');
    }
  };

  const navItems = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'quickstart', label: 'Quick Start' },
    { id: 'patient-guide', label: 'Patient Guide' },
    { id: 'doctor-guide', label: 'Doctor Guide' },
    { id: 'caregiver-guide', label: 'Caregiver Guide' },
    { id: 'gamification', label: 'Gamification & Streaks' },
    { id: 'api-reference', label: 'API Reference' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'introduction':
        return (
          <div className="prose max-w-none text-gray-700">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Introduction to HealMate</h1>
            <p className="text-lg mb-4">
              Welcome to the HealMate Documentation! HealMate is a comprehensive platform designed to bridge the gap between patients, doctors, and caregivers, ensuring better medication adherence and health tracking.
            </p>
            <p className="mb-4">
              Our platform offers a seamless experience with features like predictive insights, real-time tracking, gamified adherence rewards for patients, and rich patient analytics for healthcare professionals.
            </p>
            <div className="bg-forest-50 border-l-4 border-forest-500 p-4 rounded-r-lg mt-8">
              <h3 className="font-bold text-forest-800">Note:</h3>
              <p className="text-forest-700 text-sm mt-1">This documentation covers Web Platform features. Mobile app sync is covered under the API Reference.</p>
            </div>
          </div>
        );
      case 'quickstart':
        return (
          <div className="prose max-w-none text-gray-700">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Quick Start Guide</h1>
            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-3">1. Create an Account</h2>
            <p className="mb-4">Click "Get Started" and select your Role (Patient, Doctor, or Caregiver). Complete your profile details to enter your dashboard.</p>
            
            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-3">2. Connect Your Team</h2>
            <p className="mb-4">Patients can generate a unique invite code to share with their doctors and caregivers. Doctors and Caregivers can enter this code to securely access the patient's records.</p>
            
            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-3">3. Track Health</h2>
            <p className="mb-4">Start logging medications, recording vitals, and monitoring progress. The AI will automatically start analyzing your data after your first 3 entries.</p>
          </div>
        );
      case 'patient-guide':
        return (
          <div className="prose max-w-none text-gray-700">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Patient Guide</h1>
            <p className="text-lg mb-6">As a patient, your dashboard is your central hub for all your health needs.</p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Medication Log:</strong> View your daily pill schedule and mark them as taken to maintain your streak.</li>
              <li><strong>Vitals Tracking:</strong> Add your daily blood pressure, heart rate, or blood sugar.</li>
              <li><strong>AI Insights:</strong> Read custom-generated insights about your adherence trends and health predictions.</li>
              <li><strong>Care Team:</strong> Manage which doctors and caregivers have access to your data. Revoke access at any time.</li>
            </ul>
          </div>
        );
      case 'doctor-guide':
        return (
          <div className="prose max-w-none text-gray-700">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Doctor Guide</h1>
            <p className="text-lg mb-6">The Doctor Dashboard is built to provide high-level overviews and detailed patient analytics.</p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Patient Roster:</strong> See all connected patients in a unified grid, sorted by latest alerts or required attention.</li>
              <li><strong>Detailed Analytics:</strong> Click a patient to view their adherence history and vital graphs.</li>
              <li><strong>Adjust Prescriptions:</strong> Update a patient's medication list securely (syncs directly to the patient's schedule).</li>
            </ul>
          </div>
        );
      case 'gamification':
        return (
          <div className="prose max-w-none text-gray-700">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Gamification & Streaks</h1>
            <p className="text-lg mb-4">We believe that staying healthy should feel rewarding. That's why HealMate incorporates gamification.</p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Daily Streaks:</strong> Every consecutive day a patient successfully takes all their required medications, their streak increases.</li>
              <li><strong>Health Score:</strong> An AI-computed score out of 100 representing overall adherence and vitals stability.</li>
              <li><strong>Badges:</strong> Unlock achievements like "7-Day Streak", "Perfect Month", and "Early Bird" for consistent habit-building.</li>
            </ul>
          </div>
        );
      default:
        return (
          <div className="prose max-w-none text-gray-700">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Work in Progress</h1>
            <p>This documentation section is currently being updated. Check back soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-forest-500 text-white rounded-lg shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">HealMate</span>
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <button 
                    onClick={handleDashboardRedirect}
                    className="text-gray-600 hover:text-forest-600 font-medium transition-colors"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 bg-forest-600 text-white rounded-xl font-medium hover:bg-forest-700 transition-colors shadow-sm shadow-forest-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} className="text-gray-600 hover:text-forest-600 font-medium transition-colors">
                    Log In
                  </Link>
                  <Link to={ROUTES.REGISTER} className="px-4 py-2 bg-forest-600 text-white rounded-xl font-medium hover:bg-forest-700 transition-colors shadow-sm shadow-forest-200">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Documentation Layout */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 text-left">
        {/* Mobile Dropdown for Sidebar */}
        <div className="md:hidden mb-6">
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            {navItems.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Documentation</h3>
              <nav className="space-y-1 text-left">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-colors ${
                      activeTab === item.id 
                        ? 'bg-forest-50 text-forest-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 min-h-[600px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;