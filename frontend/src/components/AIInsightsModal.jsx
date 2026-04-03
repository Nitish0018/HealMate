import LoadingSpinner from './LoadingSpinner';

/**
 * AIInsightsModal
 * Raus-inspired: editorial modal for AI-driven clinical recommendations
 */
const AIInsightsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const recommendations = [
    { title: 'Sleep Pattern Monitoring', detail: 'Subject #10006 shows frequent late-night activity, which correlates with morning dose fatigue. Recommend a 30-min schedule shift.', icon: '🌙' },
    { title: 'Predictive Intervention', detail: 'Increased heart rate variance detected for Patient Doe. High probability (84%) of missing dose tomorrow. Consider SMS nudge.', icon: '⚡' },
    { title: 'Regimen Optimization', detail: 'MIMIC-III patterns suggest that Lisinopril is better tolerated in the evening for this metabolic profile.', icon: '💊' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-forest-500/20 backdrop-blur-md animate-fade-in">
      <div className="card-warm w-full max-w-xl overflow-hidden transform">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-200 text-forest-500 text-[10px] font-black uppercase rounded-lg mb-2">
                Predictive Analysis
             </div>
             <h2 className="font-serif text-3xl text-forest-500">Clinical Recommendations</h2>
             <p className="text-sm font-medium text-forest-500/40 mt-1">Based on HealMate AI Pattern Recognition</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-cream-100 hover:bg-forest-50 text-forest-500/30 hover:text-forest-500 rounded-xl transition-all duration-300 active:scale-90"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {recommendations.map((rec, i) => (
            <div key={i} className="p-5 bg-cream-50 rounded-[1.5rem] border border-cream-100 flex gap-4 hover:shadow-warm transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                {rec.icon}
              </div>
              <div>
                <h4 className="font-bold text-forest-500 text-sm mb-1">{rec.title}</h4>
                <p className="text-xs text-forest-500/50 leading-relaxed font-light">{rec.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-pill-outline py-4"
          >
            Close
          </button>
          <button
            onClick={() => { alert('Applied recommendations to patient care plans'); onClose(); }}
            className="flex-3 btn-pill-primary py-4"
          >
            Apply All Recommendations →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsModal;
