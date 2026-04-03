import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
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
    <div className="min-h-screen bg-cream-50 font-sans">
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
                    className="bg-forest-500 hover:bg-forest-600 text-white px-5 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} className="text-gray-600 hover:text-forest-600 font-medium transition-colors">
                    Log In
                  </Link>
                  <Link to={ROUTES.REGISTER} className="bg-forest-500 hover:bg-forest-600 text-white px-5 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all active:scale-95">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
           <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-forest-100 to-forest-200 blur-3xl"></div>
           <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-earth-100 to-earth-200 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Your Health Journey, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-500 to-forest-700">Supported Every Step</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              HealMate connects patients, doctors, and caregivers on a single intelligent platform designed to improve outcomes and simplify care coordination.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={ROUTES.REGISTER} className="bg-forest-500 hover:bg-forest-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-warm hover:shadow-lg transition-all active:scale-95 text-center flex items-center justify-center gap-2">
                Get Started for Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link to={ROUTES.LOGIN} className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg border border-gray-200 shadow-sm hover:shadow transition-all text-center">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Empowering Care For Everyone</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Whether you are managing your own health, treating patients, or caring for a loved one, we have tools designed specifically for you.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-cream-50 p-8 rounded-2xl border border-gray-100 hover:shadow-warm transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Patients</h3>
              <p className="text-gray-600">Track medications, monitor vital signs, and stay connected with your care team through an intuitive dashboard.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-cream-50 p-8 rounded-2xl border border-gray-100 hover:shadow-warm transition-shadow">
              <div className="w-12 h-12 bg-forest-100 text-forest-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Doctors</h3>
              <p className="text-gray-600">Review patient history, manage prescriptions, and analyze AI-powered insights for better clinical decisions.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-cream-50 p-8 rounded-2xl border border-gray-100 hover:shadow-warm transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Caregivers</h3>
              <p className="text-gray-600">Stay informed about your loved ones' health status, upcoming appointments, and medication schedules securely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-cream-50 py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How HealMate Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get started in minutes and experience a seamless connection between patients, doctors, and caregivers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gray-200 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white border-[6px] border-cream-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-forest-200 transition-colors">
                <span className="text-2xl font-black text-forest-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Your Profile</h3>
              <p className="text-gray-600 max-w-sm">Sign up for free and build your comprehensive health profile by entering your basic medical history.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white border-[6px] border-cream-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-forest-200 transition-colors">
                <span className="text-2xl font-black text-forest-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect Your Team</h3>
              <p className="text-gray-600 max-w-sm">Link your account securely with your preferred doctors or invite family caregivers for better coordination.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-forest-500 border-[6px] border-forest-100 rounded-full flex items-center justify-center mb-6 shadow-warm">
                <span className="text-2xl font-black text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track & Thrive</h3>
              <p className="text-gray-600 max-w-sm">Log your daily adherence, track vital signs, and let our AI provide insights to optimize your health journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section */}
      <section className="bg-forest-600 py-16 text-white relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-forest-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-forest-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-forest-500/50">
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-2">50k+</div>
              <div className="text-forest-100 font-medium">Active Patients</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-2">2M+</div>
              <div className="text-forest-100 font-medium">Medications Tracked</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-2">98%</div>
              <div className="text-forest-100 font-medium">Adherence Rate</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black mb-2">5k+</div>
              <div className="text-forest-100 font-medium">Partner Doctors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real stories from the patients, doctors, and caregivers who use HealMate every day.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-cream-50 p-8 rounded-2xl border border-gray-100 shadow-sm relative pt-12">
              <div className="absolute -top-6 left-8 bg-forest-500 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <div className="flex gap-1 text-gold-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"Managing my mom's medications used to be so stressful. With HealMate, I get notifications and I know exactly when she has taken her pills. It’s given our family so much peace of mind."</p>
              <div>
                <p className="font-bold text-gray-900">Sarah Jenkins</p>
                <p className="text-sm text-forest-600 font-medium">Caregiver</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-cream-50 p-8 rounded-2xl border border-gray-100 shadow-sm relative pt-12">
              <div className="absolute -top-6 left-8 bg-forest-500 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <div className="flex gap-1 text-gold-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"As a physician, having real-time data on my patients' medication adherence is game-changing. The AI insights help me catch potential issues before they become emergencies."</p>
              <div>
                <p className="font-bold text-gray-900">Dr. Michael Chen</p>
                <p className="text-sm text-forest-600 font-medium">Cardiologist</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-cream-50 p-8 rounded-2xl border border-gray-100 shadow-sm relative pt-12">
              <div className="absolute -top-6 left-8 bg-forest-500 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <div className="flex gap-1 text-gold-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"The app is incredibly easy to use. I log my blood pressure daily, and it graphs everything for me. It makes my appointments with my doctor much more productive."</p>
              <div>
                <p className="font-bold text-gray-900">David Rodriguez</p>
                <p className="text-sm text-forest-600 font-medium">Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="py-20 bg-forest-50 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Security & Privacy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Your health data is sensitive. We protect it with industry-leading security standards so you can focus on what matters most.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center pt-8">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-forest-100">
              <div className="bg-forest-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">End-to-End Encryption</h3>
              <p className="text-gray-600">All your medical data, communications, and personal info are encrypted in transit and at rest using AES-256 bit encryption.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-forest-100">
              <div className="bg-forest-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">HIPAA Compliant</h3>
              <p className="text-gray-600">Our platform is built strictly in accordance with the Health Insurance Portability and Accountability Act guidelines to ensure complete privacy.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-forest-100">
              <div className="bg-forest-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Strict Access Controls</h3>
              <p className="text-gray-600">You are in full control. Easily grant or revoke data access for specific doctors, caregivers, or family members at any time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-forest-600 to-teal-700 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Decorative background elements inside the CTA */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-teal-400 opacity-20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to prioritize your health?</h2>
              <p className="text-lg md:text-xl text-forest-50 mb-10 max-w-2xl mx-auto font-medium">
                Join HealMate today and experience a smarter, simpler way to manage your medications and connect with your care team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={ROUTES.REGISTER} className="px-8 py-4 bg-white text-forest-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors shadow-xl shadow-white/10 text-lg">
                  Get Started for Free
                </Link>
                <Link to={ROUTES.LOGIN} className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors text-lg">
                  Log In to Your Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;