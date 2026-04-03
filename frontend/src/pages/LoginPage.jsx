import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import LoadingSpinner from '../components/LoadingSpinner';
import LandingPage from '../components/LandingPage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error: authError, role, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role && !authLoading) {
      if (role === 'PATIENT') {
        navigate(ROUTES.PATIENT_DASHBOARD);
      } else if (role === 'DOCTOR') {
        navigate(ROUTES.DOCTOR_DASHBOARD);
      } else if (role === 'CAREGIVER') {
        navigate(ROUTES.CAREGIVER_DASHBOARD);
      }
    }
  }, [isAuthenticated, role, authLoading, navigate]);

  const validateForm = () => {
    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    }
    if (!password) {
      setFormError('Password is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = formError || authError;

  return (
    <div className="relative min-h-screen">
      {/* Background Landing Page */}
      <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden opacity-30 pointer-events-none">
        <LandingPage />
      </div>

      {/* Glassmorphic Overlay Container */}
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 bg-white/40 backdrop-blur-md overflow-hidden">
        <div className="relative w-full max-w-md animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 group" id="login-logo">
              <div className="w-12 h-12 bg-forest-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-bold text-3xl text-gray-900 tracking-tight">HealMate</span>
            </Link>
            <p className="mt-4 text-gray-600 text-base">
              Welcome back. Sign in to continue your journey.
            </p>
          </div>

          {/* Glassmorphic Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Soft inner glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest-400 to-forest-600"></div>

            {/* Error Message */}
            {displayError && (
              <div className="mb-6 p-4 bg-red-50/90 border border-red-100 rounded-xl backdrop-blur-sm" id="login-error">
                <p className="text-red-600 text-sm font-medium">{displayError}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500 outline-none transition-all placeholder-gray-400 backdrop-blur-sm shadow-inner"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500 outline-none transition-all placeholder-gray-400 backdrop-blur-sm shadow-inner"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="login-submit"
                className="w-full bg-forest-500 hover:bg-forest-600 text-white font-medium py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" color="border-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center border-t border-gray-100/50 pt-6">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="text-forest-600 font-semibold hover:text-forest-700 transition-colors"
                  disabled={isSubmitting}
                  id="login-register-link"
                >
                  Create one →
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
