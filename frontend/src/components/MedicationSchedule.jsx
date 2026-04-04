import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getPatientMedications } from '../services/medicationService';
import { getPatientAdherenceLogs } from '../services/adherenceService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * MedicationSchedule Component
 * Premium clinical UI for daily medication tracking
 */
const MedicationSchedule = ({ date, onLogIntake, refreshTrigger }) => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [adherenceLogs, setAdherenceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedDateStr = useMemo(() => date.toISOString().split('T')[0], [date]);
  
  const currentTime = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      const subject_id = user.mimic_subject_id || 0;
      
      try {
        setLoading(true);
        setError(null);
        const [medsResponse, logsResponse] = await Promise.all([
          getPatientMedications(subject_id),
          getPatientAdherenceLogs(subject_id)
        ]);
        setMedications(medsResponse || []);
        setAdherenceLogs(logsResponse || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Clinical records synchronizing. Please hold...');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.mimic_subject_id, selectedDateStr, refreshTrigger]);

  const dailySchedule = useMemo(() => {
    if (!medications.length) return [];
    
    // Define typical time slots for a high-end feel
    const timeSlotLabels = {
      '08:00': 'Morning',
      '12:00': 'Noon',
      '18:00': 'Evening',
      '22:00': 'Bedtime'
    };

    const schedule = medications.map((med, index) => {
      const times = ['08:00', '12:00', '18:00', '22:00'];
      const scheduledTime = times[index % times.length];
      const [h, m] = scheduledTime.split(':').map(Number);
      const scheduledMinutes = h * 60 + m;

      const todayLog = adherenceLogs.find(log => {
        const d = new Date(log.scheduled_time || log.createdAt);
        const logId = String(log.mimic_prescription_row_id);
        const medId = String(med.row_id || med._id);
        return d.toDateString() === date.toDateString() && 
               (log.status === 'TAKEN' || log.status === 'DELAYED') &&
               logId === medId;
      });

      let status = 'pending';
      const gracePeriodMinutes = 120; // 2 hour grace period to stay "pending"
      
      if (todayLog) {
        status = 'taken';
      } else if (date.toDateString() === new Date().toDateString()) {
        if (scheduledMinutes + gracePeriodMinutes < currentTime) {
          status = 'missed'; // It's quite late
        } else {
          status = 'pending'; // Still within grace period or not yet time
        }
      } else if (date < new Date()) {
        status = 'missed'; // Past date
      }

      return {
        id: med.row_id || med._id || `med-${index}`,
        name: med.drug || med.drug_name_poe || 'Prescription Med',
        dosage: `${med.dose_val_rx || ''} ${med.dose_unit_rx || ''}`.trim() || 'Standard Dose',
        slot: timeSlotLabels[scheduledTime],
        scheduledTime,
        scheduledMinutes,
        status,
        route: med.route || 'Oral'
      };
    });

    return schedule.sort((a, b) => a.scheduledMinutes - b.scheduledMinutes);
  }, [medications, adherenceLogs, date, currentTime]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-cream-200 flex items-center justify-between opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full skeleton" />
              <div className="space-y-2">
                <div className="h-4 w-32 skeleton rounded-md" />
                <div className="h-3 w-20 skeleton rounded-md" />
              </div>
            </div>
            <div className="h-8 w-24 skeleton rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={() => setLoading(true)} />;

  if (!dailySchedule.length) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h4 className="text-gray-900 font-black text-lg">Regimen Clear</h4>
        <p className="text-gray-400 text-sm mt-1 max-w-xs font-medium">You have no medications scheduled for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 before:z-0">
      {dailySchedule.map((med, idx) => {
        const isPast = med.status === 'taken' || med.status === 'missed';
        const isComingUp = med.status === 'pending' && Math.abs(med.scheduledMinutes - currentTime) <= 60;

        return (
          <div key={med.id} className="relative z-10 flex gap-6 group">
            {/* Timeline Node */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ring-8 ring-white ${
              med.status === 'taken' ? 'bg-green-500 shadow-lg shadow-green-100' :
              med.status === 'missed' ? 'bg-red-500 shadow-lg shadow-red-100' :
              isComingUp ? 'bg-blue-600 animate-pulse' : 'bg-gray-200'
            }`}>
              {med.status === 'taken' ? (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              ) : med.status === 'missed' ? (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <div className={`w-2 h-2 rounded-full ${isComingUp ? 'bg-white' : 'bg-gray-400'}`} />
              )}
            </div>

            {/* Content Card */}
            <div className={`flex-1 p-6 rounded-3xl border transition-all duration-300 ${
              med.status === 'taken' ? 'bg-green-50/30 border-green-100' :
              med.status === 'missed' ? 'bg-red-50/30 border-red-100' :
              isComingUp ? 'bg-blue-50/50 border-blue-200 shadow-xl shadow-blue-50/50' :
              'bg-white border-gray-100 hover:border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{med.slot} • {med.scheduledTime}</span>
                     {isComingUp && <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded uppercase">Next Up</span>}
                   </div>
                   <h4 className={`text-lg font-black tracking-tight ${isPast ? 'text-gray-400' : 'text-gray-900 group-hover:text-blue-600'} transition-colors uppercase`}>
                     {med.name}
                   </h4>
                   <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                     <span>{med.dosage}</span>
                     <span className="w-1 h-1 bg-gray-300 rounded-full" />
                     <span>{med.route}</span>
                   </div>
                </div>

                {(med.status === 'pending' || med.status === 'missed') && onLogIntake && (
                  <button
                    onClick={() => onLogIntake(med.id)}
                    className={`w-full sm:w-auto px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 ${
                      med.status === 'missed' 
                        ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-600 hover:text-white hover:border-amber-600'
                        : 'bg-white border-gray-200 hover:bg-green-600 hover:text-white hover:border-green-600'
                    }`}
                  >
                    {med.status === 'missed' ? 'Log Late Intake' : 'Mark as Taken'}
                  </button>
                )}
                
                {med.status === 'taken' && (
                  <span className="px-4 py-2 bg-green-100 text-green-700 text-[10px] font-black rounded-xl uppercase tracking-widest">
                    COMPLETED
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MedicationSchedule;
