import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * AddMedicationModal
 * Raus-inspired: warm, editorial modal with generous spacing
 */
const COMMON_MEDICATIONS = [
  'Atorvastatin', 'Lisinopril', 'Levothyroxine', 'Metformin', 'Amlodipine',
  'Metoprolol', 'Albuterol', 'Omeprazole', 'Losartan', 'Gabapentin',
  'Hydrochlorothiazide', 'Sertraline', 'Simvastatin', 'Montelukast', 'Acetaminophen'
];

const AddMedicationModal = ({ isOpen, onClose, onAdd, patientId, subjectId }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    scheduledTime: '08:00',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const medicationData = {
        ...formData,
        subject_id: subjectId,
        drug: formData.name,
        dose_val_rx: formData.dosage,
        frequency: formData.frequency,
      };

      await onAdd(medicationData);
      onClose();
      setFormData({
        name: '',
        dosage: '',
        frequency: 'Once daily',
        scheduledTime: '08:00',
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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
             <h2 className="font-serif text-2xl text-forest-500">New Prescription</h2>
             <p className="text-xs font-medium text-forest-500/40 mt-1 uppercase tracking-wider">Add to your care plan</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-cream-100 hover:bg-red-50 text-forest-500/30 hover:text-red-500 rounded-xl transition-all duration-300 group active:scale-90"
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
              <label className="label-warm">Medication Name</label>
              <input
                type="text"
                required
                list="medication-suggestions"
                className="input-warm"
                placeholder="e.g. Metformin"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <datalist id="medication-suggestions">
                {COMMON_MEDICATIONS.map(med => <option key={med} value={med} />)}
              </datalist>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-warm">Frequency</label>
                <select
                  className="input-warm appearance-none cursor-pointer"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>As needed</option>
                </select>
              </div>

              <div>
                <label className="label-warm">Dosage</label>
                <input
                  type="text"
                  required
                  className="input-warm"
                  placeholder="e.g. 10mg"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label-warm">Scheduled Time</label>
              <input
                type="time"
                className="input-warm cursor-text"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              />
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
              {isSubmitting ? <LoadingSpinner size="sm" color="border-forest-500" /> : 'Add Medication →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicationModal;
