import { useState } from 'react';

/**
 * ContactPatientModal
 * Raus-inspired: editorial modal for doctor-patient direct communication
 */
const ContactPatientModal = ({ isOpen, onClose, patientName, patientEmail }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        onClose();
        setIsSent(false);
        setMessage('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-forest-500/20 backdrop-blur-md animate-fade-in">
      <div className="card-warm w-full max-w-lg overflow-hidden transform">
        <div className="flex justify-between items-start mb-8">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg mb-2">
                Secure Channel
             </div>
             <h2 className="font-serif text-3xl text-forest-500">Contact {patientName}</h2>
             <p className="text-sm font-medium text-forest-500/40 mt-1">Direct message via Patient Portal</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-cream-100 hover:bg-forest-50 text-forest-500/30 hover:text-forest-500 rounded-xl transition-all duration-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isSent ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-scale-in">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-3xl mb-4">
              ✓
            </div>
            <h3 className="font-serif text-2xl text-forest-500">Message Sent</h3>
            <p className="text-sm text-forest-500/40 mt-2">The notification has been delivered to the patient.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label className="label-warm">To</label>
              <div className="input-warm bg-cream-50 flex items-center gap-2 opacity-70">
                <span className="text-xs font-bold">{patientName}</span>
                <span className="text-[10px] text-forest-500/40">({patientEmail})</span>
              </div>
            </div>

            <div>
              <label className="label-warm">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your clinical instruction or follow-up notice..."
                className="input-warm min-h-[120px] resize-none"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-pill-outline py-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="flex-2 btn-pill-primary py-4 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message →'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPatientModal;
