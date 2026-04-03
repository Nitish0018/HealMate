import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AuthContext } from '../context/AuthContext';

const TermsOfServicePage = () => {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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

      {/* Page Header */}
      <div className="bg-forest-600 text-white py-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-forest-500 mix-blend-multiply blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-teal-500 mix-blend-multiply blur-3xl opacity-50"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-xl text-forest-100 max-w-2xl mx-auto">
            The rules and guidelines for using the HealMate platform.
          </p>
          <p className="mt-8 text-sm text-forest-200 uppercase tracking-widest">
            Last Updated: April 4, 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <div className="prose prose-forest max-w-none text-gray-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the HealMate website, mobile application, and related services (collectively, the "Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not access or use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">2. Medical Disclaimer</h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-md">
                <p className="text-red-800 font-medium m-0">
                  HealMate is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>
              <p>
                The content provided on HealMate, including text, graphics, images, gamification elements, and AI-driven insights, is for informational purposes only. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. In case of a medical emergency, call your local emergency services immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">3. User Accounts & Responsibilities</h2>
              <p>
                When creating an account as a Patient, Doctor, or Caregiver, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-forest-500">
                <li>Provide accurate, current, and complete information during registration.</li>
                <li>Maintain the security and confidentiality of your login credentials.</li>
                <li>Promptly notify us if you discover or suspect any security breaches related to the Platform.</li>
                <li>Take responsibility for all activities that occur under your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">4. Platform Gamification & Rewards</h2>
              <p>
                HealMate employs gamification features (such as points, badges, and streaks) to encourage medication adherence and healthy habits. These rewards have no cash value and cannot be exchanged for currency. We reserve the right to modify, suspend, or terminate any gamification feature, point balance, or reward system at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">5. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-forest-500">
                <li>Use the Platform for any illegal or unauthorized purpose, including violating patient privacy laws (such as HIPAA).</li>
                <li>Attempt to gain unauthorized access to other users' accounts or health information.</li>
                <li>Upload viruses, malicious code, or structural elements that disrupt the Platform's functionality.</li>
                <li>Provide false or misleading medical information that could impact the care coordination of yourself or others.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">6. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, HealMate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-forest-500">
                <li>Your access to or use of or inability to access or use the Platform.</li>
                <li>Any conduct or content of any third party (including doctors or caregivers) on the Platform.</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify you of any changes by updating the "Last Updated" date at the top of this page. Your continued use of the Platform following the posting of changes constitutes your acceptance of such changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">8. Contact Information</h2>
              <p>
                For questions or concerns regarding these Terms of Service, please contact our legal team:
              </p>
              <div className="bg-forest-50 p-6 rounded-xl mt-4 inline-block">
                <p className="font-semibold text-gray-900">HealMate Legal Department</p>
                <p className="text-forest-600 mt-1">legal@healmate.com</p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfServicePage;