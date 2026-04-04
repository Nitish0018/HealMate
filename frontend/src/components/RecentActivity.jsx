import { useMemo } from 'react';

/**
 * RecentActivity Timeline Component
 * Raus-inspired: clean, vertical timeline for recent clinical intake events
 */
const RecentActivity = ({ patients }) => {
  // Mock recent activities derived from patient data
  const activities = useMemo(() => {
    if (!patients || patients.length === 0) return [];

    return patients
      .slice(0, 5)
      .map((patient, index) => ({
        id: index,
        patientName: patient.name || 'Unknown Patient',
        subjectId: patient.subjectId || '#00000',
        action: index % 3 === 0 ? 'Missed Dose' : 'Medication Taken',
        time: index === 0 ? '12m ago' : index === 1 ? '45m ago' : `${index + 1}h ago`,
        type: index % 3 === 0 ? 'critical' : 'stable',
        medication: index % 2 === 0 ? 'Lisinopril' : 'Metformin'
      }));
  }, [patients]);

  if (!activities.length) return null;

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between ml-1">
        <h4 className="label-warm text-forest-300">Live Activity Feed</h4>
        <span className="text-[10px] font-black tracking-widest text-status-stable uppercase px-2 py-0.5 bg-status-stable/10 rounded-full">Live</span>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cream-200 before:via-cream-200 before:to-transparent">
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex items-start group">
            <div className={`absolute left-0 mt-1.5 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm transition-all group-hover:scale-110 ${
              activity.type === 'critical' ? 'bg-red-50 text-compliance-low' : 'bg-forest-50 text-compliance-high'
            }`}>
              {activity.type === 'critical' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            <div className="ml-14 flex-grow pb-2 border-b border-cream-100/60 last:border-0">
               <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-forest-500 hover:text-forest-400 cursor-pointer transition-colors">
                    {activity.patientName}
                  </span>
                  <span className="text-[10px] font-medium text-forest-500/30 uppercase tracking-tighter">
                    {activity.time}
                  </span>
               </div>
               <p className="text-[11px] text-forest-500/50 leading-tight">
                 {activity.action}: <span className="font-semibold text-forest-500/70">{activity.medication}</span>
               </p>
               <div className="mt-2 text-[9px] font-black text-forest-300 uppercase tracking-widest">
                 Patient ID {activity.subjectId}
               </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-forest-500/40 hover:text-forest-500 hover:bg-cream-100/50 rounded-2xl border border-dashed border-cream-200 transition-all">
         View Full Clinical Audit Log
      </button>
    </section>
  );
};

export default RecentActivity;
