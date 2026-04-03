import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHighRiskPatients } from '../services/doctorService';
import { ROUTES } from '../constants/routes';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * HighRiskAlerts Component
 * Raus-inspired: warm urgency without harshness, editorial style
 */
const HighRiskAlerts = ({ onPatientSelect }) => {
  const navigate = useNavigate();
  const [highRiskPatients, setHighRiskPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHighRiskPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const patients = await getHighRiskPatients();
      
      const sortedPatients = patients
        .filter(patient => (patient.complianceScore || 0) < 60)
        .sort((a, b) => (a.complianceScore || 0) - (b.complianceScore || 0));
      
      setHighRiskPatients(sortedPatients.slice(0, 10));
    } catch (err) {
      console.error('Error fetching high-risk patients:', err);
      setError('Connection interrupted. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighRiskPatients();
    const refreshInterval = setInterval(fetchHighRiskPatients, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  const handlePatientClick = (patient) => {
    const id = patient.id || patient._id;
    if (onPatientSelect) {
      onPatientSelect(id);
    } else {
      navigate(ROUTES.getPatientDetailRoute(id));
    }
  };

  if (loading && !highRiskPatients.length) {
    return (
      <div className="card-warm border-l-4 border-l-copper-500">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-32 bg-cream-200 animate-pulse rounded-lg" />
          <div className="h-6 w-16 bg-red-50 animate-pulse rounded-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-cream-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-warm relative overflow-hidden">
      {/* Decorative shape */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-red-50 rounded-full opacity-40 z-0" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-xl text-forest-500 flex items-center">
            <span className="w-1.5 h-7 bg-copper-500 rounded-full mr-3" />
            Priority Alerts
          </h3>
          <span className="px-3 py-1.5 bg-copper-500 text-white text-[10px] font-semibold uppercase tracking-wider rounded-full animate-pulse">
            Action
          </span>
        </div>
        
        <p className="text-sm text-forest-500/40 mb-6 font-medium">
          {highRiskPatients.length > 0 
            ? `${highRiskPatients.length} patients require immediate attention`
            : "All monitored patients are above safety thresholds"}
        </p>

        {highRiskPatients.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-compliance-high" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-forest-500 font-semibold">Clear Watchlist</h4>
            <p className="text-forest-500/30 text-sm mt-1 px-4">No patients currently meet high-risk criteria.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {highRiskPatients.map((patient) => (
              <div
                key={patient.id || patient._id}
                onClick={() => handlePatientClick(patient)}
                className="group p-4 bg-cream-100 border border-cream-200/50 rounded-2xl hover:border-copper-300 hover:shadow-warm transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-xl bg-copper-500 flex items-center justify-center text-white font-semibold text-sm">
                        {(patient.name || patient.email || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-copper-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-forest-500 truncate group-hover:text-copper-500 transition-colors">
                        {patient.name || 'Anonymous Patient'}
                      </h4>
                      <div className="flex items-center text-xs font-medium text-copper-500 mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        {patient.complianceScore}% Score
                        {patient.consecutiveMissedDoses > 0 && (
                          <span className="ml-2 pl-2 border-l border-cream-300">
                             {patient.consecutiveMissedDoses} missed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-2 bg-white text-copper-500 rounded-xl hover:bg-copper-500 hover:text-white transition-all duration-300 shadow-warm border border-cream-200/50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-cream-200/50 flex items-center justify-between text-[10px] font-medium text-forest-500/30 uppercase tracking-wider">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-forest-300 mr-2" />
            <span>AI Risk Scoring: ON</span>
          </div>
          <button 
            onClick={fetchHighRiskPatients}
            className="hover:text-forest-500 transition-colors flex items-center"
          >
            <svg className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighRiskAlerts;
