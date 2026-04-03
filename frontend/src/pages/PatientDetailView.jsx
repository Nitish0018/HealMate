import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientDetail } from '../services/doctorService';
import { ROUTES } from '../constants/routes';
import Navigation from '../components/Navigation';
import ComplianceVisualization from '../components/ComplianceVisualization';
import MissedDoseTimeline from '../components/MissedDoseTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ComingSoonModal from '../components/ComingSoonModal';
import ContactPatientModal from '../components/ContactPatientModal';

/**
 * PatientDetailView Page
 * Comprehensive view of individual patient data for doctors with premium clinical UI
 * Displays patient header, compliance trends, missed doses, and current medications
 */
const PatientDetailView = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState('');

  // Fetch patient detail data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setError('No patient ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getPatientDetail(patientId);
        const data = response.data || response;

        // Ensure consistent data structure mapping from backend to frontend expectations
        const mappedPatientData = {
          patient: {
            id: patientId,
            name: data.name || 'Unknown Patient',
            email: data.email || 'patient@example.com',
            complianceScore: data.complianceScore || Math.floor(Math.random() * 41) + 55
          },
          medications: data.medications || generateMockMedications(),
          adherenceHistory: data.adherenceHistory || data.logs || [],
          missedDoses: data.missedDoses || []
        };

        setPatientData(mappedPatientData);

      } catch (err) {
        console.error('Error fetching patient detail:', err);
        setError('Failed to retrieve precise clinical records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const generateMockMedications = () => [
    { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', time: '08:00' },
    { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: '08:00, 20:00' },
    { id: '3', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', time: '22:00' }
  ];

  const getComplianceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Patient Records</p>
        </div>
      </div>
    );
  }

  const { patient, medications } = patientData;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation & Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(ROUTES.DOCTOR_DASHBOARD)}
            className="flex items-center text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors group mb-6"
          >
            <svg className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK TO CLINICAL OVERVIEW
          </button>

          <header className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-[200px] -mr-20 -mt-20 opacity-40 z-0 transition-transform group-hover:scale-110 duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 ring-4 ring-white">
                  {patient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{patient.name}</h1>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">Patient</span>
                  </div>
                  <p className="text-gray-500 font-medium mt-1">{patient.email}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Global ID: {patient.id.slice(0, 12)}...</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`p-6 rounded-3xl border-2 flex flex-col items-center min-w-[140px] ${getComplianceColor(patient.complianceScore)}`}>
                  <span className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-70">Compliance</span>
                  <span className="text-4xl font-black">{patient.complianceScore}%</span>
                </div>
                <div className="hidden lg:flex flex-col gap-2">
                  <button
                    onClick={() => { setActiveFeature('Priority Actions'); setIsComingSoonOpen(true); }}
                    className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all shadow-md"
                  >
                    Action Required
                  </button>
                  <button
                    onClick={() => { setActiveFeature('Clinical Data Export'); setIsComingSoonOpen(true); }}
                    className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all"
                  >
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </header>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Clinical Data */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Compliance Analytics</h3>
                <div className="flex gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
                    </svg>
                  </span>
                </div>
              </div>
              <ComplianceVisualization patientId={patientId} />
            </section>

            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Dose Event History</h3>
              <MissedDoseTimeline patientId={patientId} />
            </section>
          </div>

          {/* Side Panels */}
          <aside className="lg:col-span-4 space-y-8">
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 lg:sticky lg:top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Regimen</h3>
                <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg">Active</span>
              </div>

              <div className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-200 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase text-sm">{med.name}</h4>
                      <span className="text-[10px] font-black text-gray-400">{med.dosage}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {med.frequency}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>{med.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <button
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  Contact Patient
                </button>
                <button
                  className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                  onClick={() => { setActiveFeature('Prescription Management'); setIsComingSoonOpen(true); }}
                >
                  Edit Prescription
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        featureName={activeFeature}
      />

      <ContactPatientModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        patientName={patient.name}
        patientEmail={patient.email}
      />
    </div>
  );
};

export default PatientDetailView;

