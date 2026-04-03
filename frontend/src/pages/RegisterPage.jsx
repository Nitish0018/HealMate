import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register as firebaseRegister } from '../services/authService';
import { registerUser } from '../services/userService';
import { ROUTES } from '../constants/routes';
import LoadingSpinner from '../components/LoadingSpinner';

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
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-5">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-forest-50/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-gold-50/60 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 group" id="register-logo">
            <div className="w-12 h-12 bg-forest-500 rounded-full flex items-center justify-center text-cream-50 shadow-warm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-serif text-3xl text-forest-500">HealMate</span>
          </Link>
          <p className="mt-4 text-forest-500/50 text-base font-medium">
            Begin your path to better health.
          </p>
        </div>

        {/* Card */}
        <div className="card-warm">
          {/* Error Message */}
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl" id="register-error">
              <p className="text-red-600 text-sm font-medium">{formError}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="label-warm">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input-warm"
                placeholder="Your full name"
                disabled={isSubmitting}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label-warm">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-warm"
                placeholder="you@example.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            {/* Role Selection — Card-style toggle */}
            <div>
              <label className="label-warm">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.value })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                      formData.role === r.value
                        ? 'border-forest-500 bg-forest-50'
                        : 'border-cream-200 bg-cream-50 hover:border-cream-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    <span className={`text-sm font-semibold block ${
                      formData.role === r.value ? 'text-forest-500' : 'text-forest-500/50'
                    }`}>{r.label}</span>
                    <span className="text-[11px] text-forest-500/30 mt-0.5 block">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label-warm">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input-warm"
                placeholder="At least 6 characters"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label-warm">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-warm"
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
              className="w-full btn-pill-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" color="border-forest-500" />
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-forest-500/40 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                className="text-forest-500 font-semibold hover:text-forest-300 transition-colors"
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
  );
};

export default RegisterPage;
