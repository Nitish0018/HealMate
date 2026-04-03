import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { registerUser } from '../services/userService';

/**
 * AddPatientModal
 * Raus-inspired: warm, editorial modal for onboarding new patients
 */
const AddPatientModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mimic_subject_id: '',
    role: 'PATIENT',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Please fill in name and email');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // Register in backend (MOCKING Firebase for now if it's already registered, 
      // or just creating the DB record for the doctor to manage)
      const newPatient = await registerUser(formData);
      
      if (onAdd) {
        onAdd(newPatient);
      }
      
      onClose();
      setFormData({
        name: '',
        email: '',
        mimic_subject_id: '',
        role: 'PATIENT',
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-forest-500/20 backdrop-blur-md animate-fade-in">
      <div className="card-warm w-full max-w-lg overflow-hidden transform">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
             <h2 className="font-serif text-2xl text-forest-500">Add New Patient</h2>
             <p className="text-xs font-medium text-forest-500/40 mt-1 uppercase tracking-wider">Onboard a new member to HealMate</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-cream-100 hover:bg-forest-50 text-forest-500/30 hover:text-forest-500 rounded-xl transition-all duration-300 group active:scale-90"
            id="modal-close"
          >
            <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="label-warm">Full Name</label>
              <input
                type="text"
                required
                className="input-warm"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="label-warm">Email Address</label>
              <input
                type="email"
                required
                className="input-warm"
                placeholder="e.g. patient@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="label-warm">Clinical ID (MIMIC Subject ID)</label>
              <input
                type="text"
                className="input-warm"
                placeholder="e.g. 10006"
                value={formData.mimic_subject_id}
                onChange={(e) => setFormData({ ...formData, mimic_subject_id: e.target.value })}
              />
              <p className="mt-1.5 text-[11px] text-forest-500/30 italic">Used for clinical data synchronization</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-pill-outline py-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              id="modal-submit"
              className="flex-1 btn-pill-primary py-4 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? <LoadingSpinner size="sm" color="border-forest-500" /> : 'Register Patient →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
