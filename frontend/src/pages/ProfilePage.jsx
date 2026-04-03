import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';

/**
 * ProfilePage
 * Allows users to view and update their profile information
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

  const handleSave = (e) => {
    e.preventDefault();
    // In a real app, this would call a userService function to update the profile
    setMessage({ type: 'success', text: 'Profile updated successfully (simulated)' });
    setIsEditing(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-8 py-10 text-white">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold shadow-inner">
                {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.displayName || 'User'}</h1>
                <p className="text-blue-100 mt-1">{role} Account</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isEditing ? 'border-blue-500 ring-2 ring-blue-50' : 'border-gray-200 bg-gray-50'} transition outline-none`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    disabled={true} // Email usually not editable directly
                    value={formData.email}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                  />
                </div>

                {role === 'PATIENT' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">MIMIC Subject ID</label>
                    <input
                      type="text"
                      disabled={true}
                      value={formData.mimic_subject_id}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Security / Other Settings (Simulated) */}
        <div className="mt-8 bg-white rounded-xl shadow shadow-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-50">
              <div>
                <p className="font-medium text-gray-800">Password</p>
                <p className="text-sm text-gray-500">Change your account password regularly</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Change</button>
            </div>
            
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 text-status-pending">Currently Disabled</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Enable</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
