import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AuthContext } from '../context/AuthContext';

const HelpCenterPage = () => {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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

  const faqs = [
    {
      question: "How do I create a HealMate account?",
      answer: "Click the 'Get Started' button in the top right corner. You can sign up as a Patient, Doctor, or Caregiver. Follow the prompts to complete your profile.",
      category: "Getting Started"
    },
    {
      question: "Is my medical data secure?",
      answer: "Yes, absolutely. HealMate uses enterprise-grade AES-256 bit encryption and is fully HIPAA compliant. You control who has access to your health information.",
      category: "Security & Privacy"
    },
    {
      question: "How do I connect with my doctor?",
      answer: "Once logged in, go to the 'My Team' or 'Connections' tab in your dashboard. You can search for your doctor by their invite code or name and send a connection request.",
      category: "For Patients"
    },
    {
      question: "How do I set up medication reminders?",
      answer: "In the Patient Dashboard, navigate to the 'Medications' tab. Click 'Add Medication', enter the dosage and schedule, and turn on the toggle for mobile/email notifications.",
      category: "For Patients"
    },
    {
      question: "Can I view my patient's adherence logs?",
      answer: "Yes. In the Doctor Dashboard, click on a specific patient's profile from your roster. You will see a detailed graph and log of their daily medication adherence and vitals.",
      category: "For Doctors"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-forest-600 py-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-forest-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <h1 className="text-4xl font-extrabold mb-4">How can we help you?</h1>
            <p className="text-forest-100 text-lg mb-8">Search our knowledge base for answers to common questions.</p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 rounded-2xl border-none outline-none text-gray-900 shadow-xl focus:ring-4 focus:ring-forest-300 transition-all text-lg"
                placeholder="Search for articles, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories Container */}
        {!searchQuery && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-16 h-16 bg-forest-50 text-forest-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Account Management</h3>
                <p className="text-gray-500">Manage your profile, password, and personal details.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-16 h-16 bg-forest-50 text-forest-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Platform Features</h3>
                <p className="text-gray-500">Learn about tracking adherence, stats, and reports.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-16 h-16 bg-forest-50 text-forest-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy & Security</h3>
                <p className="text-gray-500">Understand how we protect your sensitive medical data.</p>
              </div>
            </div>
          </div>
        )}

        {/* FAQs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          {filteredFaqs.length > 0 ? (
            <div className="space-y-6">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <span className="text-xs font-bold text-forest-600 tracking-wider uppercase mb-2 block">{faq.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">We couldn't find any articles matching "{searchQuery}".</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-forest-600 font-bold hover:text-forest-700"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Still Need Help CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12 text-center">
          <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Can't find what you're looking for? Our support team is ready to help you with any issues or questions you might have.
            </p>
            <Link 
              to={ROUTES.CONTACT} 
              className="inline-block px-8 py-4 bg-forest-500 text-white rounded-xl font-bold hover:bg-forest-600 transition-colors shadow-md"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpCenterPage;