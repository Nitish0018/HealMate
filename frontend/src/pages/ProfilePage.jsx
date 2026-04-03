import Navigation from '../components/Navigation';
import ComingSoonModal from '../components/ComingSoonModal';

/**
 * ProfilePage
 * Raus-inspired: warm, editorial, generous spacing
 */
const ProfilePage = () => {
  const { user, role } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    mimic_subject_id: user?.mimic_subject_id || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Profile updated successfully.' });
    setIsEditing(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 lg:py-16 animate-fade-in">
        <div className="card-warm overflow-hidden">
          {/* Header */}
          <div className="bg-forest-500 px-8 py-12 -mx-8 -mt-8 mb-8 rounded-t-[2rem]">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-cream-50 text-forest-500 flex items-center justify-center font-serif text-3xl shadow-warm">
                {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-serif text-3xl text-cream-50">{user?.displayName || 'User'}</h1>
                <p className="text-cream-100/50 mt-1 text-sm font-medium uppercase tracking-wider">{role} Account</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-0">
            {message && (
              <div className={`mb-6 p-4 rounded-2xl border ${message.type === 'success' ? 'bg-forest-50 border-forest-100 text-forest-500' : 'bg-red-50 border-red-100 text-red-600'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-warm">Display Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`input-warm ${!isEditing ? 'opacity-60' : ''}`}
                  />
                </div>

                <div>
                  <label className="label-warm">Email Address</label>
                  <input
                    type="email"
                    disabled={true}
                    value={formData.email}
                    className="input-warm opacity-60"
                  />
                </div>

                {role === 'PATIENT' && (
                  <div>
                    <label className="label-warm">MIMIC Subject ID</label>
                    <input
                      type="text"
                      disabled={true}
                      value={formData.mimic_subject_id}
                      className="input-warm opacity-60"
                    />
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-cream-200 flex justify-end gap-3">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-pill-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-pill-primary"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn-pill-dark"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Security Settings */}
        <div className="mt-8 card-warm">
          <h2 className="font-serif text-xl text-forest-500 mb-6">Security Settings</h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-5 border-b border-cream-200/50">
              <div>
                <p className="font-medium text-forest-500">Password</p>
                <p className="text-sm text-forest-500/40 mt-0.5">Change your account password regularly</p>
              </div>
              <button 
                onClick={() => { setActiveFeature('Password Management'); setIsComingSoonOpen(true); }}
                className="btn-pill-ghost text-forest-400 hover:text-forest-500"
              >
                Change
              </button>
            </div>
            
            <div className="flex items-center justify-between py-5">
              <div>
                <p className="font-medium text-forest-500">Two-Factor Authentication</p>
                <p className="text-sm text-status-pending mt-0.5">Currently Disabled</p>
              </div>
              <button 
                onClick={() => { setActiveFeature('Multi-Factor Authentication'); setIsComingSoonOpen(true); }}
                className="btn-pill-ghost text-forest-400 hover:text-forest-500"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>

      <ComingSoonModal 
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        featureName={activeFeature}
      />
    </div>
  );
};

export default ProfilePage;
