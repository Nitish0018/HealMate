import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

/**
 * Navigation Component
 * Raus-inspired: minimal, warm, floating pill nav
 */
const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Profile', path: ROUTES.PROFILE },
    ];

    if (role === 'PATIENT') {
      return [
        { name: 'Dashboard', path: ROUTES.PATIENT_DASHBOARD },
        ...commonItems
      ];
    } else if (role === 'DOCTOR') {
      return [
        { name: 'Dashboard', path: ROUTES.DOCTOR_DASHBOARD },
        ...commonItems
      ];
    } else if (role === 'CAREGIVER') {
      return [
        { name: 'Dashboard', path: ROUTES.CAREGIVER_DASHBOARD },
        ...commonItems
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  const isActivePath = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between items-center">
          {/* Left cluster: Logo + Nav pills */}
          <div className="flex items-center gap-3">
            {/* Brand */}
            <Link to="/" className="flex items-center group" id="nav-logo">
              <div className="w-11 h-11 bg-forest-500 rounded-full flex items-center justify-center text-cream-50 shadow-warm group-hover:scale-105 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </Link>

            {/* Nav pills — floating capsule like Raus */}
            <div className={`hidden lg:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500 ${
              scrolled 
                ? 'bg-forest-500/80 backdrop-blur-xl shadow-warm' 
                : 'bg-forest-500/70 backdrop-blur-md'
            }`}>
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActivePath(item.path)
                      ? 'bg-white/20 text-white'
                      : 'text-cream-100/70 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            {/* User info — hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 mr-1">
              <div className="w-9 h-9 rounded-full bg-forest-50 text-forest-500 flex items-center justify-center text-sm font-semibold border-2 border-cream-200">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-forest-500 leading-tight">
                  {user.displayName || user.email.split('@')[0]}
                </span>
                <span className="text-[10px] font-medium text-forest-300 uppercase tracking-wider">
                  {role}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              id="nav-logout"
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-forest-500/10 text-forest-500/60 text-sm font-medium hover:border-red-200 hover:text-red-500 hover:bg-red-50/50 transition-all duration-300 active:scale-95"
            >
              Sign out
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-full bg-forest-500/80 backdrop-blur-md flex items-center justify-center text-cream-50 transition-all"
              id="nav-mobile-toggle"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-cream-50/95 backdrop-blur-xl border-b border-cream-200 shadow-warm-lg p-5 space-y-2 animate-fade-in">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block w-full p-4 rounded-2xl text-sm font-semibold transition-all ${
                isActivePath(item.path) 
                  ? 'bg-forest-500 text-cream-50' 
                  : 'text-forest-500/60 hover:bg-cream-200'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={logout}
            className="w-full mt-3 p-4 text-left text-sm font-semibold text-red-500 border-t border-cream-200 flex justify-between items-center"
          >
            Sign out
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
