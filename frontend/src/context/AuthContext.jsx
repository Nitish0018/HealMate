/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as firebaseLogin, logout as firebaseLogout, onAuthChange } from '../services/authService';
import { getUserProfile } from '../services/userService';
import { ROUTES } from '../constants/routes';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check localStorage for persisted auth state
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('userRole');
        
        if (storedUser && storedRole) {
          setUser(JSON.parse(storedUser));
          setRole(storedRole);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user role from backend
          const profile = await getUserProfile();
          
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: profile.name || firebaseUser.displayName,
            role: profile.role,
            mimic_subject_id: profile.mimic_subject_id,
            currentStreak: profile.currentStreak || 0,
            maxStreak: profile.maxStreak || 0,
            healthScore: profile.healthScore || 100,
            badges: profile.badges || [],
          };

          setUser(userData);
          setRole(profile.role);
          
          // Persist to localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userRole', profile.role);
          
          setError(null);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Unable to retrieve account information');
          // If profile fetch fails, log out the user
          handleLogout();
        }
      } else {
        // User is signed out
        setUser(null);
        setRole(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
      setLoading(false);
    });

    // Listen for unauthorized events from API client
    const handleUnauthorized = () => {
      handleLogout();
    };
    
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      unsubscribe();
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Authenticate with Firebase
      await firebaseLogin(email, password);
      
      // The onAuthChange listener will handle fetching the profile and setting state
    } catch (err) {
      console.error('Login error:', err);
      
      // Map Firebase error codes to user-friendly messages
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Unable to connect. Please check your internet connection';
      }
      
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await firebaseLogout();
      
      // Clear state
      setUser(null);
      setRole(null);
      setError(null);
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      // Redirect to login
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    role,
    loading,
    error,
    login,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
