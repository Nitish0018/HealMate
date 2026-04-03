import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AuthContext } from '../context/AuthContext';

const HipaaCompliancePage = () => {
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
          <div className="inline-flex items-center gap-2 mb-4 bg-forest-500/50 backdrop-blur-sm px-4 py-2 rounded-full border border-forest-400">
            <svg className="w-5 h-5 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium text-white tracking-wide uppercase">Security & Compliance</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">HIPAA Compliance</h1>
          <p className="text-xl text-forest-100 max-w-2xl mx-auto">
            How HealMate protects your electronic Protected Health Information (ePHI) with industry-standard protocols.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <div className="prose prose-forest max-w-none text-gray-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Our Commitment to Privacy</h2>
              <p>
                HealMate strictly adheres to the definitions, standards, and requirements set forth by the Health Insurance Portability and Accountability Act (HIPAA) of 1996 and subsequent amendments, including the HITECH Act. We ensure all Electronic Protected Health Information (ePHI) is protected with uncompromising standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Technical Safeguards</h2>
              <p>We deploy robust technical safeguards to ensure data integrity and confidentiality:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-forest-500">
                <li><strong>Encryption in Transit:</strong> All data transmitted between clients and our servers is encrypted using standard TLS 1.2 or higher protocols (AES-256).</li>
                <li><strong>Encryption at Rest:</strong> All stored ePHI in our databases (e.g., medical logs, prescription records, adherence history) is encrypted at the volume and file level using AES-256 encryption.</li>
                <li><strong>Access Control:</strong> Strict Role-Based Access Controls (RBAC) ensure that doctors, patients, and caregivers can only view the ePHI they are specifically authorized to access.</li>
                <li><strong>Audit Controls:</strong> Hardware, software, and procedural mechanisms reliably record and periodically examine all activity involving ePHI across the platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Physical Safeguards</h2>
              <p>Our platform is hosted on industry-leading secure cloud providers (such as AWS/GCP/Azure) that provide extensive physical security measures, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-forest-500">
                <li>Biometric access controls, 24/7 security teams, and surveillance at data center facilities.</li>
                <li>Disaster recovery and automated backup systems designed specifically for HIPAA-compliant environments.</li>
                <li>Strict hardware disposal and sanitization policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Administrative Safeguards</h2>
              <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-forest-500">
                <li><strong>Security Management Process:</strong> Regular risk analysis to identify and mitigate potential vulnerabilities.</li>
                <li><strong>Information Access Management:</strong> Documented processes for granting, revoking, and modifying ePHI access for authorized employees and partners.</li>
                <li><strong>Workforce Training:</strong> Ongoing security and privacy training for all HealMate employees who manage our infrastructure.</li>
                <li><strong>Contingency Planning:</strong> Comprehensive emergency mode operations and disaster recovery plans to guarantee ePHI availability during crises.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Business Associate Agreements (BAAs)</h2>
              <p>
                HealMate requires signed Business Associate Agreements (BAAs) with all third-party vendors and cloud providers we use that may come in contact with ePHI. This legally binds them to the same strict data protection standards that we follow.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Report a Security Concern</h2>
              <p>
                The security of your ePHI is our highest priority. If you believe there is a security vulnerability or have encountered a potential compliance issue, please contact our security team immediately:
              </p>
              <div className="bg-forest-50 p-6 rounded-xl mt-4 inline-block">
                <p className="font-semibold text-gray-900">Security & Compliance Officer</p>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=security@healmate.com&su=Security%20Concern"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest-600 mt-1 hover:text-blue-600 transition-colors"
                >
                  security@healmate.com
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default HipaaCompliancePage;