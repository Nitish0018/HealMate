import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivacyPolicyPage = () => {
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
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-xl text-forest-100 max-w-2xl mx-auto">
            How HealMate collects, uses, and protects your personal health information.
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">1. Introduction</h2>
              <p>
                At HealMate ("we", "our", or "us"), we are deeply committed to protecting your privacy and ensuring the security of your personal and health information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use the HealMate platform, website, and associated medical gamification services (collectively, the "Services").
              </p>
              <p>
                By using HealMate, you consent to the data practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">a. Personal Identification Information</h3>
              <p>
                When you register for HealMate, we may collect basic credentials including your name, email address, phone number, and account passwords.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">b. Protected Health Information (PHI)</h3>
              <p>
                As a healthcare management tool, we securely process and store medical data such as past diagnoses, active prescriptions (medication adherence logs), treatment schedules, and symptom reporting. This data is strictly categorized under HIPAA compliance models.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">c. Usage and Device Data</h3>
              <p>
                We collect diagnostic metrics regarding how you interact with our Services, device identifiers, IP addresses, and gamification interactions (such as point accumulation and daily streaks).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-forest-500">
                <li><strong>To Provide Care Coordination:</strong> Connecting patients with verified doctors and assigned caregivers.</li>
                <li><strong>Health Reminders & Gamification:</strong> Alerting you about prescriptions and rewarding positive adherence behavior.</li>
                <li><strong>Improve AI Insights:</strong> Training predictive ML models related to patient adherence explicitly using anonymized/de-identified data.</li>
                <li><strong>Security & Identity Verification:</strong> Preventing fraud, unauthorized access, or policy violations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">4. Data Sharing & Disclosure</h2>
              <p>
                We <strong>do not sell</strong> your personal or medical data to third parties. We only share information under the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-forest-500">
                <li><strong>With Your Care Team:</strong> Your PHI is explicitly shared with the doctors and caregivers linked to your profile network.</li>
                <li><strong>Service Providers:</strong> We employ trusted vendors (e.g., secure cloud hosting, Firebase authentication) bound by strict confidentiality agreements and BAAs.</li>
                <li><strong>Legal Requirements:</strong> If mandated by law, court order, or governmental regulation, we may disclose requisite data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">5. Data Security</h2>
              <p>
                We use industry-standard encryption (e.g., TLS/SSL protocols) for data in transit and at rest. We enforce role-based access control (RBAC), multi-factor authentication standards, and regular security audits to prevent data breaches.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">6. Your Rights & Choices</h2>
              <p>Depending on your jurisdiction, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-forest-500">
                <li>Access the personal and medical data we hold about you.</li>
                <li>Request corrections of inaccurate or incomplete records.</li>
                <li>Request the deletion or anonymization of your data (Right to be Forgotten).</li>
                <li>Withdraw consent for optional data processing.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please reach out to our privacy officer via our contact channels.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">7. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our treatment of the information you provide us, please write to us at:
              </p>
              <div className="bg-forest-50 p-6 rounded-xl mt-4 inline-block">
                <p className="font-semibold text-gray-900">HealMate Privacy Officer</p>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=support@healmate.com&su=Privacy%20Policy%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest-600 mt-1 hover:text-blue-600 transition-colors"
                >
                  support@healmate.com
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;