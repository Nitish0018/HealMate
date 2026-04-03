import { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';
import MedicationSchedule from '../components/MedicationSchedule';
import AdherenceVisualization from '../components/AdherenceVisualization';
import { logMedicationIntake } from '../services/adherenceService';
import ErrorMessage from '../components/ErrorMessage';
import AddMedicationModal from '../components/AddMedicationModal';
import { addMedication } from '../services/medicationService';

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
        medicationId,
        patientId: user.uid,
        subjectId: user.mimic_subject_id,
        scheduledTime: new Date().toISOString(),
        actualTime: new Date().toISOString(),
        status: 'taken'
      };

      await logMedicationIntake(logData);
      setSuccessMessage('Medication logged — wonderful work today.');
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
      setTimeout(() => setSuccessMessage(null), 4000);
      setIsModalOpen(false);
    } catch (err) {
      setError('Unable to add medication. Please check your connection.');
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
      
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 lg:py-12">
        {/* Hero Section — Raus editorial style */}
        <div className="relative overflow-hidden bg-forest-500 rounded-[2.5rem] lg:rounded-[3.5rem] p-8 sm:p-12 lg:p-16 mb-12 animate-fade-in">
          {/* Decorative organic shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-forest-400/30 rounded-full -mr-28 -mt-28 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-gold-300/10 rounded-full -mb-24 blur-2xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <div className="w-2 h-2 rounded-full bg-compliance-high animate-pulse" />
                <span className="text-cream-100/80 text-xs font-medium tracking-wider uppercase">
                  Health Monitor Active
                </span>
              </div>
              
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream-50 leading-[1.1] tracking-tight">
                {greeting}, <br />
                <span className="text-gold-300">{user?.displayName || user?.email?.split('@')[0]}</span>
              </h1>
              
              <p className="mt-6 text-cream-100/60 text-lg font-light max-w-lg leading-relaxed">
                Your daily wellness rhythm matters. Let's make sure every dose is taken care of today.
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  id="add-medication-btn"
                  className="btn-pill-primary"
                >
                  Add Medication
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Daily Progress Gauge */}
            <div className="flex flex-col items-center justify-center p-8 bg-white/8 backdrop-blur-md border border-white/10 rounded-[2.5rem] min-w-[220px]">
              <div className="relative w-28 h-28 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="46" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                    <circle cx="56" cy="56" r="46" stroke="#F4B42D" strokeWidth="8" fill="none" strokeDasharray="289" strokeDashoffset={289 * (1 - 0.75)} strokeLinecap="round" />
                 </svg>
                 <span className="absolute font-serif text-3xl text-cream-50">75%</span>
              </div>
              <p className="mt-4 text-cream-100/50 text-xs font-medium uppercase tracking-widest">Daily Progress</p>
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
            <div className="card-warm">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl text-forest-500 flex items-center">
                    <span className="w-1.5 h-7 bg-gold-300 rounded-full mr-3" />
                    Medication Timeline
                  </h2>
                  <div className="flex items-center gap-1 bg-cream-100 p-1.5 rounded-full">
                    <button onClick={() => navigateDate(-1)} className="p-2.5 hover:bg-white hover:shadow-warm rounded-full transition-all" id="date-prev">
                      <svg className="w-4 h-4 text-forest-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="px-5 text-sm font-medium text-forest-500/60 select-none min-w-[140px] text-center">
                      {isToday ? 'Today' : selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button onClick={() => navigateDate(1)} className="p-2.5 hover:bg-white hover:shadow-warm rounded-full transition-all" id="date-next">
                      <svg className="w-4 h-4 text-forest-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
               </div>
               
               <MedicationSchedule 
                 date={selectedDate}
                 onLogIntake={handleLogIntake}
               />
            </div>
          </div>

          {/* Right Column: Health Analytics & Tips */}
          <div className="lg:col-span-4 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Analytics Card */}
              <div className="card-warm relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-forest-50 rounded-full opacity-30" />
                
                <div className="relative z-10">
                  <h3 className="font-serif text-xl text-forest-500 mb-6">Health Analytics</h3>
                  <AdherenceVisualization />
                  
                  <div className="mt-8 space-y-4">
                    {/* Knowledge tip */}
                    <div className="p-5 bg-cream-100 rounded-2xl border border-cream-200/50 hover:border-forest-100 transition-all cursor-pointer group">
                      <p className="text-[10px] font-semibold text-forest-300 uppercase tracking-widest mb-1.5">Knowledge Base</p>
                      <h4 className="font-semibold text-forest-500 text-sm group-hover:text-forest-400 transition-colors">Why consistent timing matters</h4>
                      <p className="text-xs text-forest-500/40 mt-1.5 line-clamp-2 leading-relaxed">Maintaining steady blood levels ensures optimal efficacy...</p>
                    </div>
                    
                    {/* Health Reminder */}
                    <div className="p-6 bg-gold-50 rounded-[1.5rem] border border-gold-100/50">
                      <h4 className="font-semibold text-forest-500 text-xs uppercase tracking-widest mb-3">Health Reminder</h4>
                      <p className="text-sm text-forest-500/70 leading-relaxed font-light">
                        Stay hydrated throughout the day. Water helps your body absorb medications and reduces side effects.
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
      />
    </div>
  );
};

export default PatientDashboard;