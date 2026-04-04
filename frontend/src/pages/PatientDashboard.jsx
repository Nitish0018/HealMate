import { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';
import MedicationSchedule from '../components/MedicationSchedule';
import AdherenceVisualization from '../components/AdherenceVisualization';
import { logMedicationIntake } from '../services/adherenceService';
import ErrorMessage from '../components/ErrorMessage';
import AddMedicationModal from '../components/AddMedicationModal';
import { addMedication } from '../services/medicationService';
import Chatbot from '../components/Chatbot';

/**
 * PatientDashboard Component
 * Raus-inspired: warm, nature-luxe, editorial design with generous whitespace
 */
const PatientDashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const handleLogIntake = async (medicationId) => {
    try {
      setError(null);
      setSuccessMessage(null);

      const logData = {
        user_id: user.uid,
        mimic_prescription_row_id: medicationId,
        mimic_subject_id: user.mimic_subject_id,
        status: 'TAKEN',
        scheduled_time: selectedDate.toISOString()
      };

      await logMedicationIntake(logData);
      setSuccessMessage('Medication logged — wonderful work today.');
      setLastUpdated(Date.now());
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Error logging medication:', err);
      setError("We couldn't log that right now. We'll try again shortly.");
    }
  };

  const handleAddMedication = async (medicationData) => {
    try {
      setError(null);
      await addMedication(medicationData);
      setSuccessMessage('New medication added to your care plan.');
      setLastUpdated(Date.now());
      setTimeout(() => setSuccessMessage(null), 4000);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Unable to add medication. Please check your connection.';
      setError(errorMessage);
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="min-h-screen bg-cream-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-12 lg:pt-40">
        {/* Page Header — Raus clean style */}
        <header className="mb-14 flex flex-col md:flex-row md:items-start md:justify-between gap-8 animate-fade-in">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-3 px-3 py-1 bg-forest-50 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
                <span className="text-[10px] font-black text-forest-500 uppercase tracking-[0.2em]">Patient Portal</span>
             </div>
             <h1 className="font-serif text-5xl sm:text-7xl text-forest-500 tracking-tight leading-[0.9]">
               Daily <br />
               <span className="text-forest-300">Sanctuary</span>
             </h1>
             <div className="pt-4 space-y-2">
                <p className="text-forest-500/40 text-xs font-black uppercase tracking-[0.3em]">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-forest-500/30 text-sm max-w-[280px] leading-relaxed italic font-light">
                  "Healing is a quiet conversation between the heart and the habit. You are doing beautiful work."
                </p>
             </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
            {/* Health Pulse Stat */}
            <div className="flex items-center gap-4 group cursor-default">
               <div className="text-right">
                  <p className="text-[10px] font-black text-forest-300 uppercase tracking-widest leading-none mb-1">Health Score</p>
                  <p className="text-2xl font-serif text-forest-500">{user?.healthScore || 98}%</p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-white shadow-soft border border-cream-100 flex items-center justify-center text-forest-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
               </div>
            </div>

            {/* Streak Stat */}
            <div className="flex items-center gap-4 group cursor-default pl-6 border-l border-cream-200">
               <div className="text-right">
                  <p className="text-[10px] font-black text-forest-300 uppercase tracking-widest leading-none mb-1">Wellness Streak</p>
                  <p className="text-2xl font-serif text-forest-500">{user?.currentStreak || 12} Days</p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-gold-400 flex items-center justify-center text-white shadow-gold">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.334-.398-1.81 a1 1 0 00-1.814-.622c-.12.192-.263.432-.423.722-.317.576-.74 1.354-1.107 2.174-.37.825-.667 1.648-.812 2.395-.144.737-.177 1.232-.177 1.465a5.5 5.5 0 1011 0c0-.553-.046-1.015-.153-1.423-.105-.407-.25-.739-.42-1.013a6.802 6.802 0 00-.815-1.163 31.393 31.393 0 00-.815-1.163c-.244-.312-.498-.584-.742-.833a18.85 18.85 0 00-1.103-1.023c-.387-.34-.785-.64-1.162-.914z" clipRule="evenodd" /></svg>
               </div>
            </div>
          </div>
        </header>

        {/* Hero Section — Raus editorial style */}
        <div className="relative overflow-hidden bg-forest-500 rounded-4xl lg:rounded-5xl p-8 sm:p-12 lg:p-16 mb-12 animate-fade-in delay-100">
          {/* Decorative organic shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-forest-400/30 rounded-full -mr-28 -mt-28 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-gold-300/10 rounded-full -mb-24 blur-2xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 transition-colors hover:bg-white/20">
                <div className="w-2 h-2 rounded-full bg-compliance-high animate-pulse" />
                <span className="text-cream-100/80 text-[10px] font-bold tracking-widest uppercase">
                  Care System Connected
                </span>
              </div>
              
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-cream-50 leading-[1.05] tracking-tight">
                {greeting}, <br />
                <span className="text-gold-300">{user?.displayName || user?.email?.split('@')[0]}</span>
              </h2>
              
              <p className="mt-8 text-cream-100/60 text-xl font-light max-w-lg leading-relaxed">
                Your rhythm today is steady. Every small action you take is a win for your health.
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  id="add-medication-btn"
                  className="btn-pill-primary group px-10 py-5 text-base"
                >
                  <span>Add Medication</span>
                  <div className="w-6 h-6 bg-forest-500/10 rounded-full flex items-center justify-center transition-transform group-hover:rotate-90">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Daily Progress Gauge */}
            <div className="flex flex-col items-center justify-center p-10 bg-white/8 backdrop-blur-md border border-white/10 rounded-4xl min-w-[260px] transform hover:scale-[1.02] transition-transform">
              <div className="relative w-36 h-36 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="62" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
                    <circle cx="72" cy="72" r="62" stroke="#F4B42D" strokeWidth="10" fill="none" strokeDasharray="390" strokeDashoffset={390 * (1 - 0.75)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                    <span className="font-serif text-4xl text-cream-50">75%</span>
                    <span className="text-[10px] text-cream-100/40 font-bold tracking-widest uppercase">Done</span>
                 </div>
              </div>
              <p className="mt-6 text-cream-100/50 text-xs font-bold uppercase tracking-[0.2em]">Adherence Flow</p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-8 animate-fade-in">
            <ErrorMessage message={error} onRetry={() => setError(null)} />
          </div>
        )}

        {successMessage && (
          <div className="mb-8 card-warm-sm flex items-center gap-4 border-l-4 border-l-compliance-high animate-fade-in">
            <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="h-5 w-5 text-compliance-high" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-forest-500 font-medium text-sm">{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Medication Timeline */}
          <div className="lg:col-span-8 space-y-8">
            <div className="card-warm group transition-all hover:shadow-warm-lg">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                  <h2 className="font-serif text-3xl text-forest-500 flex items-center">
                    <span className="w-1.5 h-8 bg-gold-300 rounded-full mr-4" />
                    Care Schedule
                  </h2>
                  <div className="flex items-center gap-1 bg-cream-100 p-1.5 rounded-full border border-cream-200/50">
                    <button onClick={() => navigateDate(-1)} className="p-2.5 hover:bg-white hover:text-forest-500 hover:shadow-warm rounded-full transition-all text-forest-500/40" id="date-prev" title="Previous Day">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="px-5 text-sm font-semibold text-forest-500/70 select-none min-w-[140px] text-center">
                      {isToday ? 'Today' : selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button onClick={() => navigateDate(1)} className="p-2.5 hover:bg-white hover:text-forest-500 hover:shadow-warm rounded-full transition-all text-forest-500/40" id="date-next" title="Next Day">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
               </div>
               
               <MedicationSchedule 
                 date={selectedDate}
                 onLogIntake={handleLogIntake}
                 refreshTrigger={lastUpdated}
               />
            </div>
          </div>

          {/* Right Column: Health Analytics & Tips */}
          <div className="lg:col-span-4 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Analytics Card */}
              <div className="card-warm relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-forest-50 rounded-full opacity-60 group-hover:scale-110 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl text-forest-500 mb-8">Snapshot</h3>
                  <AdherenceVisualization refreshTrigger={lastUpdated} />
                  
                  <div className="mt-10 space-y-4">
                    {/* Knowledge tip */}
                    <div className="p-6 bg-cream-100 rounded-3xl border border-cream-200/50 hover:border-forest-100 transition-all cursor-pointer group/tip">
                      <p className="text-[10px] font-bold text-forest-300 uppercase tracking-widest mb-2 leading-none">Journal</p>
                      <h4 className="font-bold text-forest-500 text-sm group-hover/tip:text-forest-400 transition-colors">Why consistent timing matters</h4>
                      <p className="text-xs text-forest-500/40 mt-2 line-clamp-2 leading-relaxed">Maintaining steady levels in your circulation ensures the treatment remains effective throughout the day...</p>
                    </div>
                    
                    {/* Health Reminder */}
                    <div className="p-6 bg-gold-50 rounded-3xl border border-gold-100/50">
                      <h4 className="font-bold text-forest-400 text-[10px] uppercase tracking-widest mb-3 leading-none">Gentle Reminder</h4>
                      <p className="text-sm text-forest-500/80 leading-relaxed font-light">
                        Water flows where attention goes. Staying hydrated helps your wellness journey feel smoother.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddMedicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMedication}
        patientId={user?.uid}
        subjectId={user?.mimic_subject_id}
      />

      {/* AI Health Assistant Chatbot */}
      <Chatbot />
    </div>
  );
};

export default PatientDashboard;