import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * InvitePatientModal Component
 * Premium modal for caregivers to invite new dependents
 */
const InvitePatientModal = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Parent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSuccess(true);
    
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setEmail('');
      setName('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-forest-900/20 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden transform transition-all animate-scale-in">
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-forest-300 via-forest-500 to-forest-300"></div>
        
        <div className="p-8 sm:p-12">
          {!success ? (
            <>
              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center text-forest-500 mx-auto mb-6 shadow-inner-soft">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="font-serif text-3xl text-forest-500 tracking-tight mb-2">Invite to Circle</h2>
                <p className="text-forest-500/40 text-sm font-medium italic">"Care is the thread that connects us all."</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-forest-300 uppercase tracking-widest mb-2 ml-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-cream-50/50 border border-cream-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-forest-500/5 focus:border-forest-500 transition-all outline-none text-forest-600"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-forest-300 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-cream-50/50 border border-cream-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-forest-500/5 focus:border-forest-500 transition-all outline-none text-forest-600"
                    placeholder="recipient@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-forest-300 uppercase tracking-widest mb-2 ml-1">Relationship</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Parent', 'Spouse', 'Sibling', 'Patient'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRelation(r)}
                        className={`py-3 px-4 rounded-xl border text-[11px] font-bold transition-all ${
                          relation === r 
                            ? 'bg-forest-500 text-white border-forest-500 shadow-md transform scale-[1.02]' 
                            : 'bg-white text-forest-300 border-cream-200 hover:border-forest-200'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-4 border border-cream-200 text-forest-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-cream-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] px-6 py-4 bg-forest-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-warm hover:bg-forest-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <LoadingSpinner size="sm" color="border-white" /> : 'Send Invite'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="py-12 text-center animate-fade-in">
               <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 animate-bounce-slow">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
               </div>
               <h3 className="font-serif text-3xl text-forest-500 mb-2">Invite Sent</h3>
               <p className="text-forest-400 font-medium">An invitation has been sent to <strong>{name}</strong>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitePatientModal;
