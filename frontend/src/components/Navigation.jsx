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
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className={`flex justify-between items-center px-1.5 py-1.5 rounded-full transition-all duration-700 border-2 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-2xl border-cream-200/50 shadow-warm-lg' 
            : 'bg-cream-50/20 backdrop-blur-md border-transparent'
        }`}>
          {/* Left cluster: Logo + Nav pills */}
          <div className="flex items-center gap-6">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-3 pl-4 group" id="nav-logo">
              <div className="w-10 h-10 bg-forest-500 rounded-2xl flex items-center justify-center text-cream-50 shadow-warm rotate-[-45deg] group-hover:rotate-0 transition-all duration-500">
                <svg className="w-6 h-6 rotate-[45deg]" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-serif text-xl text-forest-500 tracking-tight transition-opacity group-hover:opacity-70">HealMate</span>
            </Link>

            {/* Nav pills */}
            <div className={`hidden lg:flex items-center gap-1 rounded-full px-1 py-1`}>
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                    isActivePath(item.path)
                      ? 'bg-forest-500 text-cream-50 shadow-sm'
                      : 'text-forest-400 hover:bg-forest-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3 pr-2">
            {/* User Profile Hook */}
            <div className="hidden md:flex items-center gap-3 bg-cream-100/50 pl-2 pr-4 py-1.5 rounded-full border border-cream-200/20">
               <div className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-xs font-black text-forest-400 border border-cream-100">
                 {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
               </div>
               <span className="text-[11px] font-black text-forest-500 uppercase tracking-widest leading-none">
                 {user.displayName || user.email.split('@')[0]}
               </span>
            </div>

            {/* Logout icon button */}
            <button
              onClick={logout}
              id="nav-logout"
              className="hidden lg:flex items-center justify-center w-11 h-11 rounded-full bg-white border border-cream-200 text-forest-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all duration-300 group"
              title="Sign Out"
            >
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-full bg-forest-500 flex items-center justify-center text-cream-50 transition-all"
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
