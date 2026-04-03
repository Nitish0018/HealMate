import { useState } from 'react';

/**
 * CaregiverAlertsFeed Component
 * Displays a premium feed of recent alerts for dependents
 */
/**
 * CaregiverAlertsFeed Component
 * Displays a premium feed of recent alerts for dependents
 */
const CaregiverAlertsFeed = ({ onContact }) => {
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      patientName: 'Sarah Smith',
      patientEmail: 'sarah.smith@example.com',
      type: 'missed_dose',
      message: 'Missed scheduled 9:00 AM Lisinopril dose.',
      timeSince: '24 min ago',
      severity: 'high',
      status: 'pending'
    },
    {
       id: '2',
       patientName: 'John Doe',
       patientEmail: 'john.doe@example.com',
       type: 'ai_prediction',
       message: 'AI suggests high probability (78%) of missing evening dose.',
       timeSince: '2 hr ago',
       severity: 'medium',
       status: 'read'
    },
    {
       id: '3',
       patientName: 'Robert Wilson',
       patientEmail: 'robert.wilson@example.com',
       type: 'stable_streak',
       message: 'Successfully completed a 7-day adherence streak.',
       timeSince: '5 hr ago',
       severity: 'low',
       status: 'read'
    }
  ]);

  const getSeverityStyles = (severity) => {
    switch(severity) {
      case 'high': return 'bg-rose-50 text-rose-500 border-rose-100/50';
      case 'medium': return 'bg-amber-50 text-amber-500 border-amber-100/50';
      case 'low': return 'bg-forest-50 text-forest-500 border-forest-100/50';
      default: return 'bg-gray-50 text-gray-500 border-gray-100/50';
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'missed_dose': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
      case 'ai_prediction': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      case 'stable_streak': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      default: return null;
    }
  };

  return (
    <aside className="bg-white rounded-[2.5rem] border border-cream-200/60 shadow-warm p-8 sm:p-10 sticky top-40 animate-fade-in-up">
       <div className="mb-10 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-3xl text-forest-500 tracking-tight">Focus Feed</h3>
            <p className="text-forest-500/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">Last 24 Hours</p>
          </div>
          <div className="w-10 h-10 bg-forest-50 rounded-2xl flex items-center justify-center text-forest-400 border border-forest-100 shadow-inner-soft">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
       </div>

       <div className="space-y-6">
          {alerts.map((alert) => (
            <div key={alert.id} className={`group relative p-6 rounded-3xl border transition-all duration-500 ${getSeverityStyles(alert.severity)} ${alert.status === 'pending' ? 'shadow-md border-opacity-100 scale-[1.02]' : 'opacity-70 grayscale-[0.3] hover:opacity-100 hover:grayscale-0'}`}>
               <div className="flex items-start gap-4">
                  <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-soft group-hover:scale-110 transition-transform`}>
                    {getIcon(alert.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest">{alert.patientName}</span>
                      <span className="text-[9px] font-medium opacity-60 italic">{alert.timeSince}</span>
                    </div>
                    <p className="text-xs font-bold leading-relaxed">{alert.message}</p>
                    
                    {alert.severity === 'high' && (
                      <button 
                        onClick={() => onContact({ name: alert.patientName, email: alert.patientEmail })}
                        className="mt-3 px-4 py-2 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm hover:bg-rose-600 transition-all active:scale-95"
                      >
                        Intervene Now
                      </button>
                    )}
                  </div>
               </div>
               
               {alert.status === 'pending' && (
                 <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
               )}
            </div>
          ))}
       </div>

       <button className="w-full mt-10 py-4 border border-cream-200 text-forest-300 text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-cream-50 transition-all flex items-center justify-center gap-2">
         View All History
         <svg className="w-3 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
       </button>
    </aside>
  );
};

export default CaregiverAlertsFeed;
