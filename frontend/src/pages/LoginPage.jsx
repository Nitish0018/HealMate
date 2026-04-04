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
  
  const { login, loginWithGoogle, error: authError, role, isAuthenticated, loading: authLoading } = useAuth();
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

  const handleGoogleLogin = async () => {
    setFormError('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google login failed:', err);
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

            {/* Separator */}
            <div className="relative my-8 border-t border-gray-100/50">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider backdrop-blur-sm">
                Or continue with
              </span>
            </div>

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              id="google-login-btn"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3.5 rounded-xl border border-gray-200/60 shadow-sm hover:shadow transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

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
