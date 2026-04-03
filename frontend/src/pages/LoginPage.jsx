import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import LoadingSpinner from '../components/LoadingSpinner';

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
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-5">
      {/* Decorative background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-forest-50/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gold-50/60 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 group" id="login-logo">
            <div className="w-12 h-12 bg-forest-500 rounded-full flex items-center justify-center text-cream-50 shadow-warm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-serif text-3xl text-forest-500">HealMate</span>
          </Link>
          <p className="mt-4 text-forest-500/50 text-base font-medium">
            Welcome back. Sign in to continue your journey.
          </p>
        </div>

        {/* Card */}
        <div className="card-warm">
          {/* Error Message */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl" id="login-error">
              <p className="text-red-600 text-sm font-medium">{displayError}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="label-warm">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-warm"
                placeholder="you@example.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="label-warm">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-warm"
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
              className="w-full btn-pill-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" color="border-forest-500" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-forest-500/40 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate(ROUTES.REGISTER)}
                className="text-forest-500 font-semibold hover:text-forest-300 transition-colors"
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
  );
};

export default LoginPage;
