import LoadingSpinner from './LoadingSpinner';

/**
 * ComingSoonModal
 * Raus-inspired: editorial placeholder for features currently in development
 */
const ComingSoonModal = ({ isOpen, onClose, featureName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-forest-500/20 backdrop-blur-md animate-fade-in">
      <div className="card-warm w-full max-w-md overflow-hidden transform text-center">
        {/* Decorative background */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gold-100 rounded-[2rem] flex items-center justify-center text-3xl shadow-warm">
             ⌛
          </div>
        </div>

        <h2 className="font-serif text-2xl text-forest-500 mb-2">{featureName}</h2>
        <p className="text-sm text-forest-500/40 mb-8 font-light leading-relaxed px-4">
          This clinical module is being refined for medical-grade precision. Check back soon for the latest updates.
        </p>

        <button
          onClick={onClose}
          className="w-full btn-pill-primary py-4"
        >
          Understood
        </button>
      </div>
    </div>
  );
};

export default ComingSoonModal;
