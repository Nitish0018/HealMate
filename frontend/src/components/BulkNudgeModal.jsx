import { useState } from 'react';
import { sendBulkReminder } from '../services/doctorService';

/**
 * BulkNudgeModal Component
 * Raus-inspired: editorial design for bulk clinical interventions
 */
const BulkNudgeModal = ({ isOpen, onClose, patients }) => {
  const [message, setMessage] = useState("Important clinical reminder from your doctor at HealMate. Please remember to log your medication for today's optimal care.");
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(null);

  if (!isOpen) return null;

  const handleSend = async () => {
    try {
      setIsSending(true);
      const patientIds = patients.map(p => p.id || p._id);
      await sendBulkReminder(patientIds, message);
      setSentCount(patients.length);
      setTimeout(() => {
        onClose();
        setSentCount(null);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-forest-500/20 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-warm-lg overflow-hidden animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-cream-100 transition-colors"
        >
          <svg className="w-5 h-5 text-forest-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 sm:p-10">
          {sentCount ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
               <div className="w-20 h-20 bg-status-stable/10 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-status-stable" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
               </div>
               <div>
                  <h3 className="font-serif text-3xl text-forest-500">Nudge Delivered</h3>
                  <p className="mt-2 text-forest-500/40 text-sm font-medium">Successfully notified {sentCount} patients in your watchlist.</p>
               </div>
            </div>
          ) : (
            <div className="space-y-8">
              <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-100 rounded-full mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-gold-500">Bulk Intervention</span>
                </div>
                <h2 className="font-serif text-3xl text-forest-500 leading-tight">SMS Patient Nudge</h2>
                <p className="mt-2 text-forest-500/40 text-sm font-medium">Sending to <span className="text-forest-400">{patients.length} patients</span> with poor adherence.</p>
              </header>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest text-forest-500/30 ml-1">Message Content</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-6 bg-cream-50 border-0 rounded-3xl text-sm text-forest-500 focus:ring-2 focus:ring-gold-300 min-h-[160px] resize-none transition-all placeholder:text-forest-500/20"
                  placeholder="Draft your clinical instructions..."
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSend}
                  disabled={isSending || !message.trim()}
                  className="w-full py-4 bg-forest-500 text-cream-50 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-forest-500/10 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSending ? 'Transmitting...' : `Send Nudge to ${patients.length} Patients`}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 text-forest-500/40 font-black text-xs uppercase tracking-[0.2em] hover:text-forest-500 transition-colors"
                >
                  Cancel Action
                </button>
              </div>
              
              <p className="text-[10px] text-center text-forest-500/20 max-w-[280px] mx-auto leading-relaxed">
                Messages will be delivered via secure HealMate health portal and registered SMS contact.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkNudgeModal;
