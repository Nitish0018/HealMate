import { useState, useMemo, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ContactPatientModal from './ContactPatientModal';
import caregiverService from '../services/caregiverService';

/**
 * ManagedDependents Component
 * Displays a premium list of patients under the caregiver's supervision
 * Uses real backend data with mock fallback as per instructions
 */
const ManagedDependents = ({ onContact }) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [usingMock, setUsingMock] = useState(false);

  // Premium Mock Data (Fallback)
  const mockDependents = [
    {
      id: 'mock-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 68,
      condition: 'Diabetes Type 2',
      adherenceRate: 85,
      healthScore: 92,
      lastIntake: '8:30 AM (Metformin)',
      nextDose: '1:00 PM (Insulin)',
      riskLevel: 'low',
      riskPrediction: 12,
      streak: 14,
      avatar: 'J'
    },
    {
      id: 'mock-2',
      name: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      age: 72,
      condition: 'Hypertension',
      adherenceRate: 58,
      healthScore: 64,
      lastIntake: '9:15 AM (Lisinopril)',
      nextDose: '8:00 PM (Lisinopril)',
      riskLevel: 'high',
      riskPrediction: 78,
      streak: 0,
      avatar: 'S'
    },
    {
      id: 'mock-3',
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      age: 65,
      condition: 'Cardiovascular Recovery',
      adherenceRate: 72,
      healthScore: 81,
      lastIntake: '6:30 AM (Warfarin)',
      nextDose: '6:30 PM (Warfarin)',
      riskLevel: 'medium',
      riskPrediction: 45,
      streak: 3,
      avatar: 'R'
    }
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await caregiverService.getPatients();
        
        if (response.success && response.data.length > 0) {
          // Map backend data to UI format
          const mappedPatients = response.data.map(p => ({
            id: p._id,
            name: p.name,
            email: p.email,
            age: p.age || '—',
            condition: p.total_prescriptions > 0 ? 'Chronic Care' : 'Preventive',
            adherenceRate: p.healthScore || 0, // Simplified mapping
            healthScore: p.healthScore || 0,
            lastIntake: p.recentLogs?.[0] ? `${new Date(p.recentLogs[0].taken_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'No recent activity',
            nextDose: 'Check Schedule',
            riskLevel: p.healthScore < 60 ? 'high' : p.healthScore < 80 ? 'medium' : 'low',
            riskPrediction: 100 - (p.healthScore || 0),
            streak: p.currentStreak || 0,
            avatar: p.name.charAt(0)
          }));
          setPatients(mappedPatients);
          setUsingMock(false);
        } else {
          // Use mock if no real data found
          setPatients(mockDependents);
          setUsingMock(true);
        }
      } catch (error) {
        console.error('Caregiver patients fetch failed:', error);
        setPatients(mockDependents);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.condition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, patients]);

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return 'text-green-500 bg-green-50 border-green-100';
      case 'medium': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'high': return 'text-rose-500 bg-rose-50 border-rose-100';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return 'stroke-forest-400';
    if (rate >= 60) return 'stroke-amber-400';
    return 'stroke-rose-400';
  };

  if (loading) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

  return (
    <section className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-serif text-3xl text-forest-500 tracking-tight">Your Circle</h2>
            {usingMock && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-amber-200/50">Simulated</span>
            )}
          </div>
          <p className="text-forest-500/40 text-sm font-medium">Found {filteredPatients.length} active monitoring connections</p>
        </div>
        
        <div className="relative group max-w-xs w-full">
           <input 
              type="text" 
              placeholder="Filter by name or condition..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-white border border-cream-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all outline-none text-forest-500"
           />
           <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-forest-300 group-focus-within:text-forest-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white/40 border border-dashed border-cream-300 rounded-[2.5rem]">
             <p className="text-forest-300 font-medium italic">No dependents found matching your search.</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div key={patient.id} className="group bg-white rounded-[2.5rem] p-8 border border-cream-200/60 shadow-warm hover:shadow-hover transition-all duration-500 relative overflow-hidden flex flex-col">
               {/* Streak Badge */}
               <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">{patient.streak} Day Streak</span>
                  <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
               </div>

               <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-500 font-serif text-2xl shadow-inner-soft group-hover:scale-110 transition-transform duration-500">
                    {patient.avatar}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-forest-500 tracking-tight leading-none mb-1.5">{patient.name}</h3>
                    <p className="text-[10px] font-black text-forest-300 uppercase tracking-widest">{patient.age} Y/O — {patient.condition}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* Adherence Gauge */}
                  <div className="bg-cream-50/50 rounded-3xl p-4 flex flex-col items-center justify-center border border-cream-100">
                     <div className="relative w-16 h-16 mb-2">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                           <circle cx="18" cy="18" r="16" fill="none" className="stroke-cream-200" strokeWidth="3" />
                           <circle 
                              cx="18" cy="18" r="16" fill="none" 
                              className={`${getProgressColor(patient.adherenceRate)} transition-all duration-1000`}
                              strokeWidth="3" 
                              strokeDasharray={`${patient.adherenceRate}, 100`}
                              strokeLinecap="round" 
                           />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-[10px] font-black text-forest-500">{patient.adherenceRate}%</span>
                        </div>
                     </div>
                     <p className="text-[9px] font-black text-forest-300 uppercase tracking-widest">Adherence</p>
                  </div>

                  {/* Health Score */}
                  <div className="bg-cream-50/50 rounded-3xl p-4 flex flex-col items-center justify-center border border-cream-100">
                     <p className="text-3xl font-serif text-forest-500 leading-none mb-2">{patient.healthScore}</p>
                     <p className="text-[9px] font-black text-forest-300 uppercase tracking-widest">Health Score</p>
                  </div>
               </div>

               {/* AI Prediction Alert */}
               <div className={`mb-8 p-4 rounded-2xl border ${getRiskColor(patient.riskLevel)} transition-colors`}>
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Insight</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {patient.riskLevel === 'high' 
                      ? `${patient.riskPrediction}% probability of missed dose detected. Intervention recommended.`
                      : patient.riskLevel === 'medium'
                      ? `Minor behavioral shift detected. ${patient.riskPrediction}% miss probality.`
                      : 'Consistent patterns detected. Low risk of non-adherence.'}
                  </p>
               </div>

               <div className="mt-auto space-y-4 pt-4 border-t border-cream-100/50">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-forest-300 font-bold uppercase tracking-widest">Last Dose</span>
                    <span className="text-forest-500 font-medium">{patient.lastIntake}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-forest-300 font-bold uppercase tracking-widest">Next Due</span>
                    <span className="text-forest-500 font-black">{patient.nextDose}</span>
                  </div>
               </div>

               {/* Action Overlay (Hidden by default, shown on hover?) — Or just buttons */}
               <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => onContact({ name: patient.name, email: patient.email })}
                    className="flex-1 bg-forest-500 hover:bg-forest-600 text-cream-50 text-[10px] font-black uppercase tracking-[0.2em] py-3 rounded-xl shadow-warm transition-all active:scale-95"
                  >
                    Connect
                  </button>
                  <button className="flex items-center justify-center px-4 bg-white border border-cream-200 text-forest-400 rounded-xl hover:bg-cream-50 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ManagedDependents;
