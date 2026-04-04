import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    switch (role) {
      case 'PATIENT': navigate(ROUTES.PATIENT_DASHBOARD); break;
      case 'DOCTOR': navigate(ROUTES.DOCTOR_DASHBOARD); break;
      case 'CAREGIVER': navigate(ROUTES.CAREGIVER_DASHBOARD); break;
      default: navigate('/');
    }
  };

  // Same Koox animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  // Falling back to a clean background or use the generated one
  const heroImage = "/hero-medical.jpg";

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#1A3A32] selection:bg-[#1A3A32] selection:text-[#FCFAF7] font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FCFAF7]/90 backdrop-blur-xl border-b border-[#1A3A32]/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-[#1A3A32] text-white rounded-lg shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">HealMate</span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
               <button onClick={handleDashboardRedirect} className="text-sm font-semibold hover:opacity-60 transition-opacity">Dashboard</button>
            ) : (
               <Link to={ROUTES.LOGIN} className="text-sm font-semibold hover:opacity-60 transition-opacity">Log In</Link>
            )}
            
            <button 
              onClick={user ? logout : () => navigate(ROUTES.REGISTER)}
              className="bg-[#1A3A32] text-[#FCFAF7] px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              {user ? 'Logout' : 'Sign Up'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Koox Intro Animation */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative z-10 max-w-5xl px-4 text-center">
          <motion.div
            variants={containerVars}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.h1 
              variants={itemVars} 
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-[-0.03em] leading-[1.1] text-[#1A3A32]"
            >
              Your Health Journey, <br className="hidden md:block" />
              <span className="text-[#A39C8F]">Supported Every Step</span>
            </motion.h1>

            <motion.p 
              variants={itemVars} 
              className="text-lg md:text-xl text-[#1A3A32]/70 max-w-2xl mx-auto leading-relaxed"
            >
              HealMate connects patients, doctors, and caregivers on a single intelligent platform designed to improve outcomes and simplify care coordination.
            </motion.p>

            <motion.div variants={itemVars} className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Link to={ROUTES.REGISTER} className="bg-[#1A3A32] hover:bg-[#2A4A42] text-[#FCFAF7] px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#1A3A32]/10 transition-all active:scale-95 flex items-center justify-center gap-2">
                Get Started for Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link to={ROUTES.LOGIN} className="bg-white hover:bg-gray-50 text-[#1A3A32] px-10 py-4 rounded-2xl font-bold text-lg border border-[#1A3A32]/10 transition-all">
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with staggered scroll reveals */}
      <section className="bg-white py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-[#1A3A32] mb-4">Empowering Care For Everyone</h2>
            <p className="text-[#1A3A32]/60 max-w-2xl mx-auto text-lg leading-relaxed font-medium">Whether you are managing your own health, treating patients, or caring for a loved one, we have tools designed specifically for you.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { t: "For Patients", d: "Track medications, monitor vital signs, and stay connected with your care team through an intuitive dashboard.", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", color: "#EFF6FF" },
               { t: "For Doctors", d: "Review patient history, manage prescriptions, and analyze AI-powered insights for better clinical decisions.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "#F0FDF4" },
               { t: "For Caregivers", d: "Stay informed about your loved ones' health status, upcoming appointments, and medication schedules securely.", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", color: "#F5F3FF" }
             ].map((svc, i) => (
               <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#FCFAF7] p-10 rounded-3xl border border-[#1A3A32]/5 hover:border-[#1A3A32]/10 transition-colors group"
               >
                 <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: svc.color }}>
                   <svg className="w-7 h-7 text-[#1A3A32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={svc.icon} />
                   </svg>
                 </div>
                 <h3 className="text-2xl font-serif font-black mb-4">{svc.t}</h3>
                 <p className="text-[#1A3A32]/60 font-medium leading-relaxed">{svc.d}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* How it Works with Koox Dividers */}
      <section className="bg-[#FCFAF7] py-32 px-4 border-t border-dashed border-[#1A3A32]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-[#1A3A32] mb-4">How HealMate Works</h2>
            <p className="text-[#1A3A32]/60 max-w-2xl mx-auto font-medium">Get started in minutes and experience a seamless connection between health pillars.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              { n: '1', t: "Create Your Profile", d: "Sign up for free and build your comprehensive health profile by entering your medical history." },
              { n: '2', t: "Connect Your Team", d: "Link your account securely with your preferred doctors or invite family caregivers for better coordination." },
              { n: '3', t: "Track & Thrive", d: "Log your daily adherence, track vital signs, and let our AI provide insights to optimize your health journey." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#1A3A32] text-[#FCFAF7] rounded-full mx-auto flex items-center justify-center text-xl font-black mb-8 shadow-lg shadow-[#1A3A32]/20">
                  {step.n}
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">{step.t}</h3>
                <p className="text-[#1A3A32]/50 font-medium leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Koox high contrast */}
      <section className="bg-[#1A3A32] py-20 text-[#FCFAF7]">
         <div className="max-w-7xl mx-auto px-4 divide-y md:divide-y-0 md:flex items-center justify-around gap-10 divide-[#FCFAF7]/10">
            {[
              { v: "50k+", l: "Active Patients" },
              { v: "2M+", l: "Doses Tracked" },
              { v: "98%", l: "Adherence Rate" },
              { v: "5k+", l: "Partner Doctors" }
            ].map((stat, i) => (
              <motion.div 
               key={i}
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="py-10 md:py-0 text-center"
              >
                <div className="text-4xl md:text-5xl font-serif font-black mb-1">{stat.v}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FCFAF7]/40">{stat.l}</div>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Final CTA with butter smooth zoom */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-[#1A3A32] rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#A39C8F]/10 rounded-full blur-3xl" />
           
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-8 leading-tight">Ready to prioritize your health?</h2>
           <p className="text-[#FCFAF7]/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">Join HealMate today and experience a smarter, simpler way to manage your medications and connect with your care team.</p>
           
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to={ROUTES.REGISTER} className="px-10 py-4 bg-[#FCFAF7] text-[#1A3A32] rounded-2xl font-bold text-lg hover:scale-105 transition-transform">
                Get Started for Free
              </Link>
              <Link to={ROUTES.LOGIN} className="px-10 py-4 border-2 border-[#FCFAF7]/20 text-[#FCFAF7] rounded-2xl font-bold text-lg hover:bg-white/5 transition-colors">
                Sign In to Account
              </Link>
           </div>
        </motion.div>
      </section>
      
      {/* No Footer here because global Footer is active in App.jsx */}
    </div>
  );
};

export default LandingPage;