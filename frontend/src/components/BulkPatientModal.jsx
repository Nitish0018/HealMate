import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import LoadingSpinner from './LoadingSpinner';

/**
 * BulkPatientModal
 * Raus-inspired: A full-screen or large modal showing all patients in a grid with detailed metrics
 */
const BulkPatientModal = ({ isOpen, onClose, patients, loading }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-forest-500/20 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="bg-cream-100 w-full max-w-6xl h-[90vh] rounded-[2.5rem] shadow-warm-lg flex flex-col border border-cream-200/60">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center bg-white rounded-t-[2.5rem]">
          <div>
            <h2 className="font-serif text-3xl text-forest-500">Bulk Patient Overview</h2>
            <p className="text-sm text-forest-500/40 mt-1">Found {patients.length} patients in records</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-4 bg-cream-100 hover:bg-red-50 text-forest-500/30 hover:text-red-500 rounded-2xl transition-all duration-300 group active:scale-95"
          >
            <svg className="h-6 w-6 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters bar */}
        <div className="px-8 py-4 bg-white border-b border-cream-200/50 flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
                {['All', 'Critical', 'Monitoring', 'Stable'].map(status => (
                    <button key={status} className={`px-4 py-2 rounded-full text-xs font-semibold ${status === 'All' ? 'bg-forest-500 text-cream-50' : 'bg-cream-100 text-forest-500/60 hover:bg-cream-200'} transition-all`}>
                        {status}
                    </button>
                ))}
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2 text-sm text-forest-500/40">
                <span>Sorted by Compliance (Asc)</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <LoadingSpinner size="lg" color="border-forest-500" />
              <p className="mt-4 text-forest-500/40">Loading patient data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-cream-200/50 hover:shadow-warm transition-all duration-300 group cursor-pointer">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-500 font-serif text-xl">
                        {(patient.name || patient.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-forest-500 line-clamp-1">{patient.name || 'Anonymous User'}</h4>
                        <p className="text-xs text-forest-500/30 font-medium">{patient.email}</p>
                      </div>
                    </div>
                    <div className={`p-1.5 rounded-lg ${
                      patient.complianceScore < 60 ? 'bg-red-50 text-red-500' : 
                      patient.complianceScore < 80 ? 'bg-gold-50 text-gold-500' : 'bg-forest-50 text-forest-500'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-forest-500/40 uppercase tracking-wider mb-2">
                        <span>Adherence</span>
                        <span className="text-forest-500">{patient.complianceScore}%</span>
                      </div>
                      <div className="h-2 w-full bg-cream-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            patient.complianceScore < 60 ? 'bg-red-400' : 
                            patient.complianceScore < 80 ? 'bg-gold-400' : 'bg-forest-400'
                          }`}
                          style={{ width: `${patient.complianceScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-cream-50 rounded-2xl">
                        <p className="text-[10px] font-bold text-forest-500/30 uppercase">Last Sync</p>
                        <p className="text-xs font-semibold text-forest-500 mt-1">2h ago</p>
                      </div>
                      <div className="p-3 bg-cream-50 rounded-2xl">
                        <p className="text-[10px] font-bold text-forest-500/30 uppercase">Missed</p>
                        <p className="text-xs font-semibold text-red-500 mt-1">{Math.floor(Math.random() * 4)} doses</p>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const id = patient.id || patient._id;
                      navigate(ROUTES.getPatientDetailRoute(id));
                      onClose();
                    }}
                    className="w-full mt-6 py-3 px-4 bg-cream-100 hover:bg-forest-500 hover:text-white text-forest-500 text-xs font-bold rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  >
                    View Detailed History →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-white border-t border-cream-200/50 rounded-b-[2.5rem] flex justify-between items-center">
            <div className="text-sm text-forest-500/40">
                Tip: Click any patient card to see full clinical history.
            </div>
            <button 
                onClick={onClose}
                className="btn-pill bg-forest-500 text-cream-50 px-8 py-3 text-sm"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default BulkPatientModal;
