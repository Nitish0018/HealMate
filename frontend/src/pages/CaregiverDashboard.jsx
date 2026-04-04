import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';
import ManagedDependents from '../components/ManagedDependents';
import CaregiverAlertsFeed from '../components/CaregiverAlertsFeed';
import InvitePatientModal from '../components/InvitePatientModal';
import ContactPatientModal from '../components/ContactPatientModal';

const CaregiverDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [contactPatient, setContactPatient] = useState(null);

  const handleContact = (patient) => {
    setContactPatient(patient);
  };

  return (
    <div className="min-h-screen bg-cream-100 selection:bg-forest-200">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-12 lg:pt-40">
        {/* Header — Raus editorial */}
        <header className="mb-20 flex flex-col md:flex-row md:items-start md:justify-between gap-12 animate-fade-in">
          <div className="space-y-6 max-w-2xl">
             <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-forest-50/80 backdrop-blur-sm border border-forest-100 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
                <span className="text-[10px] font-black text-forest-500 uppercase tracking-[0.3em]">Caregiver Command</span>
             </div>
             <h1 className="font-serif text-6xl sm:text-8xl text-forest-500 tracking-tight leading-[0.85]">
               Support <br />
               <span className="text-forest-300 italic">Sphere</span>
             </h1>
             <div className="pt-6 space-y-4">
                <p className="text-forest-500/50 text-xs font-black uppercase tracking-[0.4em]">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <div className="flex items-start gap-4">
                  <div className="w-0.5 h-12 bg-forest-100 mt-1" />
                  <p className="text-forest-500/40 text-base max-w-[380px] leading-relaxed font-light italic">
                    "Healing is a collaborative art. Your presence is the strongest medicine in their journey."
                  </p>
                </div>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-8 self-end md:self-start">
            <div className="flex items-center gap-6">
              {/* Dependents Stat */}
              <div className="flex items-center gap-5 group cursor-default">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-forest-300 uppercase tracking-widest leading-none mb-1.5">Connected Lives</p>
                    <p className="text-3xl font-serif text-forest-500">03</p>
                 </div>
                 <div className="w-14 h-14 rounded-[1.25rem] bg-white shadow-soft border border-cream-200/60 flex items-center justify-center text-forest-400 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                 </div>
              </div>

              {/* Overall Pulse */}
              <div className="flex items-center gap-5 group cursor-default pl-8 border-l border-cream-200">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-forest-300 uppercase tracking-widest leading-none mb-1.5">Collective Pulse</p>
                    <p className="text-3xl font-serif text-forest-500">Steady</p>
                 </div>
                 <div className="w-14 h-14 rounded-[1.25rem] bg-forest-500 flex items-center justify-center text-white shadow-warm group-hover:bg-forest-600 transition-all duration-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
              </div>
            </div>

            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="w-full bg-white border border-cream-200/80 text-forest-500 text-[10px] font-black uppercase tracking-[0.3em] py-4 px-6 rounded-2xl shadow-soft hover:shadow-hover hover:border-forest-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
               Invite New Dependent
            </button>
          </div>
        </header>

        {/* Dashboard 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
           {/* Main Managed Dependents Section */}
           <div className="lg:col-span-8 flex flex-col gap-12 order-2 lg:order-1">
              <ManagedDependents onContact={handleContact} />
           </div>

           {/* Alerts Feed Sidebar */}
           <div className="lg:col-span-4 order-1 lg:order-2">
              <CaregiverAlertsFeed onContact={handleContact} />
           </div>
        </div>

        {/* Coming Soon Section — Visual Polish */}
        <div className="relative group overflow-hidden rounded-[3rem] bg-forest-500 p-12 sm:p-20 shadow-warm">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-forest-400 rounded-full blur-[100px] -mr-48 -mt-48 opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest-600 rounded-full blur-[80px] -ml-32 -mb-32 opacity-30" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-forest-400/20 backdrop-blur-xl border border-forest-400/30 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700">
                  <svg className="w-10 h-10 text-forest-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl text-cream-50 tracking-tight mb-6">
                  Intelligent <br />
                  <span className="text-forest-200">Interventions</span>
                </h2>
                <p className="text-cream-50/60 text-lg leading-relaxed font-light mb-10 italic">
                  "Soon, our AI will provide predictive behavioral alerts, allowing you to intercept non-adherence before it happens."
                </p>
                <div className="flex items-center gap-3 px-6 py-2 bg-forest-400/40 border border-forest-400/50 rounded-full">
                   <span className="text-[10px] font-black text-forest-100 uppercase tracking-widest">Adoption Phase 2: In Preview</span>
                </div>
            </div>
        </div>

        {/* Invite Modal */}
        <InvitePatientModal 
          isOpen={isInviteModalOpen} 
          onClose={() => setIsInviteModalOpen(false)} 
        />

        {/* Contact Modal */}
        <ContactPatientModal
          isOpen={!!contactPatient}
          onClose={() => setContactPatient(null)}
          patientName={contactPatient?.name}
          patientEmail={contactPatient?.email}
        />
      </main>
    </div>
  );
};

export default CaregiverDashboard;