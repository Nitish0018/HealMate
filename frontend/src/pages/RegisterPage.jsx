import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register as firebaseRegister } from '../services/authService';
import { registerUser } from '../services/userService';
import { ROUTES } from '../constants/routes';
import LoadingSpinner from '../components/LoadingSpinner';
import LandingPage from '../components/LandingPage';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PATIENT',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formError) {
      setFormError('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setFormError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setFormError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    if (!formData.role) {
      setFormError('Please select a role');
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
      await firebaseRegister(formData.email, formData.password);
      await registerUser({
        email: formData.email,
        name: formData.name,
        role: formData.role,
      });
      await login(formData.email, formData.password);
      if (formData.role === 'PATIENT') {
        navigate(ROUTES.PATIENT_DASHBOARD);
      } else if (formData.role === 'DOCTOR') {
        navigate(ROUTES.DOCTOR_DASHBOARD);
      } else if (formData.role === 'CAREGIVER') {
        navigate(ROUTES.CAREGIVER_DASHBOARD);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Unable to connect. Please check your internet connection';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { value: 'PATIENT', label: 'Patient', desc: 'Track your medications & health' },
    { value: 'DOCTOR', label: 'Doctor', desc: 'Monitor patients & insights' },
    { value: 'CAREGIVER', label: 'Caregiver', desc: 'Support your loved ones' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Landing Page */}
      <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden opacity-30 pointer-events-none">
        <LandingPage />
      </div>

      {/* Glassmorphic Overlay Container */}
      <div className="fixed inset-0 z-10 flex flex-col items-center p-4 bg-white/40 backdrop-blur-md overflow-y-auto pt-16 pb-20">
        <div className="relative w-full max-w-md animate-fade-in my-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 group" id="register-logo">
              <div className="w-12 h-12 bg-forest-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-bold text-3xl text-gray-900 tracking-tight">HealMate</span>
            </Link>
            <p className="mt-4 text-gray-600 text-base">
              Begin your path to better health.
            </p>
          </div>

          {/* Glassmorphic Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Soft inner glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest-400 to-forest-600"></div>

            {/* Error Message */}
            {formError && (
              <div className="mb-6 p-4 bg-red-50/90 border border-red-100 rounded-xl backdrop-blur-sm" id="register-error">
                <p className="text-red-600 text-sm font-medium">{formError}</p>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500 outline-none transition-all placeholder-gray-400 backdrop-blur-sm shadow-inner"
                  placeholder="Your full name"
                  disabled={isSubmitting}
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500 outline-none transition-all placeholder-gray-400 backdrop-blur-sm shadow-inner"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>

              {/* Role Selection — Card-style toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.value })}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        formData.role === r.value
                          ? 'border-forest-500 bg-forest-50/80 shadow-md transform scale-[1.02]'
                          : 'border-gray-200/60 bg-white/40 hover:border-forest-300 backdrop-blur-sm shadow-inner'
                      }`}
                      disabled={isSubmitting}
                    >
                      <span className={`text-sm font-bold block ${
                        formData.role === r.value ? 'text-forest-600' : 'text-gray-600'
                      }`}>{r.label}</span>
                      <span className={`text-[11px] mt-0.5 block ${formData.role === r.value ? 'text-forest-500/80' : 'text-gray-400'}`}>{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500 outline-none transition-all placeholder-gray-400 backdrop-blur-sm shadow-inner"
                  placeholder="At least 6 characters"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500 outline-none transition-all placeholder-gray-400 backdrop-blur-sm shadow-inner"
                  placeholder="Re-enter your password"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="register-submit"
                className="w-full bg-forest-500 hover:bg-forest-600 text-white font-medium py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" color="border-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center border-t border-gray-100/50 pt-6">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="text-forest-600 font-semibold hover:text-forest-700 transition-colors"
                  disabled={isSubmitting}
                  id="register-login-link"
                >
                  Sign in →
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
