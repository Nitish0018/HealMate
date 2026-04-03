import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientsList, filterPatientsByName, sortPatientsByCompliance } from '../services/doctorService';
import { ROUTES } from '../constants/routes';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * PatientList Component
 * Displays searchable, filterable list of patients for doctors with premium UI
 * 
 * @param {Object} props
 * @param {Function} props.onPatientSelect - Callback when patient is selected
 */
const PatientList = ({ onPatientSelect }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const patientsData = await getPatientsList();
        
        // Add mock compliance data since backend doesn't provide it yet
        // Consistently with Dashboard stats
        const patientsWithCompliance = patientsData.map((patient) => ({
          ...patient,
          complianceScore: patient.complianceScore || Math.floor(Math.random() * 41) + 55,
          lastActivity: patient.lastActivity || new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
          consecutiveMissedDoses: patient.consecutiveMissedDoses || (Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0)
        }));

        setPatients(patientsWithCompliance);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError(err.response?.data?.message || 'Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter and sort patients based on search query
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = filterPatientsByName(patients, searchQuery);
    return sortPatientsByCompliance(filtered, true); // Sort ascending (lowest first as priority)
  }, [patients, searchQuery]);

  // Handle patient selection
  const handlePatientClick = (patient) => {
    const id = patient.id || patient._id;
    if (onPatientSelect) {
      onPatientSelect(id);
    } else {
      navigate(ROUTES.getPatientDetailRoute(id));
    }
  };

  // Get compliance styling
  const getComplianceStyle = (score) => {
    if (score >= 80) return { 
      bg: 'bg-green-50', 
      text: 'text-green-700', 
      border: 'border-green-200',
      dot: 'bg-green-500'
    };
    if (score >= 60) return { 
      bg: 'bg-yellow-50', 
      text: 'text-yellow-700', 
      border: 'border-yellow-200',
      dot: 'bg-yellow-500'
    };
    return { 
      bg: 'bg-red-50', 
      text: 'text-red-700', 
      border: 'border-red-200',
      dot: 'bg-red-500'
    };
  };

  // Format last activity date
  const formatLastActivity = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 border border-cream-200/60 shadow-warm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <div className="h-8 w-48 skeleton mb-2" />
            <div className="h-4 w-32 skeleton" />
          </div>
          <div className="h-12 w-full sm:max-w-xs skeleton rounded-2xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-5 border-b border-cream-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl skeleton" />
                <div className="space-y-2">
                  <div className="h-4 w-32 skeleton" />
                  <div className="h-3 w-48 skeleton" />
                </div>
              </div>
              <div className="h-8 w-24 skeleton rounded-full" />
              <div className="h-12 w-12 rounded-full skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-8">
        <ErrorMessage message={error} onRetry={() => setLoading(true)} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Patient Directory</h3>
          <p className="text-sm text-gray-500 mt-1">Found {filteredAndSortedPatients.length} patients in your care</p>
        </div>
        
        <div className="relative w-full sm:max-w-xs group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl leading-5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-4 pt-0 font-semibold text-gray-400 text-xs uppercase tracking-wider">Patient</th>
              <th className="pb-4 pt-0 font-semibold text-gray-400 text-xs uppercase tracking-wider text-center">Status</th>
              <th className="pb-4 pt-0 font-semibold text-gray-400 text-xs uppercase tracking-wider text-center">Adherence</th>
              <th className="pb-4 pt-0 font-semibold text-gray-400 text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredAndSortedPatients.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">
                  No patients found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAndSortedPatients.map((patient) => {
                const style = getComplianceStyle(patient.complianceScore);
                return (
                  <tr 
                    key={patient.id || patient._id} 
                    className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => handlePatientClick(patient)}
                  >
                    <td className="py-5">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-100 group-hover:scale-110 transition-transform">
                          {(patient.name || patient.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{patient.name || 'Anonymous User'}</div>
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${patient.email}&su=Regarding%20Your%20HealMate%20Account`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking email
                          >
                            {patient.email}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${style.dot} animate-pulse`} />
                        {patient.complianceScore >= 80 ? 'Stable' : patient.complianceScore >= 60 ? 'Monitoring' : 'Critical'}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                        Activity: {formatLastActivity(patient.lastActivity)}
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 relative">
                          {/* Small circular progress indicator */}
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                              className="text-gray-100 stroke-current"
                              strokeWidth="3.5"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={`${style.text} stroke-current`}
                              strokeWidth="3.5"
                              strokeDasharray={`${patient.complianceScore}, 100`}
                              strokeLinecap="round"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="text-[10px] font-bold fill-current" textAnchor="middle">{patient.complianceScore}%</text>
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-right">
                      <button className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredAndSortedPatients.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
           <div className="text-sm font-medium text-gray-400">
             Showing <span className="text-gray-900 font-bold">{filteredAndSortedPatients.length}</span> results
           </div>
           <div className="flex space-x-2">
             <button className="px-4 py-2 text-sm font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">Previous</button>
             <button className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100 transition-all">Next</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
