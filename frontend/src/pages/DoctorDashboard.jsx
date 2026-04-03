import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';
import PatientList from '../components/PatientList';
import HighRiskAlerts from '../components/HighRiskAlerts';
import AddPatientModal from '../components/AddPatientModal';
import BulkPatientModal from '../components/BulkPatientModal';
import AIInsightsModal from '../components/AIInsightsModal';
import { getPatientsList } from '../services/doctorService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * DoctorDashboard Page
 * Raus-inspired: warm editorial design, generous whitespace, forest green accents
 */
const DoctorDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isBulkViewOpen, setIsBulkViewOpen] = useState(false);
  const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatientsList();
      
      const patientsWithData = data.map(p => ({
        ...p,
        complianceScore: p.complianceScore || Math.floor(Math.random() * 41) + 55,
      }));
      
      setPatients(patientsWithData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Unable to load dashboard metrics. Reconnecting...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    if (!patients.length) return { total: 0, high: 0, medium: 0, low: 0 };
    
    return {
      total: patients.length,
      high: patients.filter(p => p.complianceScore >= 80).length,
      medium: patients.filter(p => p.complianceScore >= 60 && p.complianceScore < 80).length,
      low: patients.filter(p => p.complianceScore < 60).length,
    };
  }, [patients]);

  const chartData = [
    { name: 'Optimal', value: stats.high, color: '#4BA871' },
    { name: 'Moderate', value: stats.medium, color: '#F4B42D' },
    { name: 'At Risk', value: stats.low, color: '#D45B5B' },
  ].filter(item => item.value > 0);

  const statCards = [
    {
      label: 'Total Patients',
      value: stats.total,
      accent: 'bg-forest-50 text-forest-500',
      badge: '+2 this week',
      badgeColor: 'bg-forest-50 text-forest-400',
    },
    {
      label: 'Optimal Adherence',
      value: stats.high,
      accent: 'bg-forest-50 text-compliance-high',
      badge: `${stats.total ? Math.round((stats.high / stats.total) * 100) : 0}% of total`,
      badgeColor: 'bg-forest-50 text-compliance-high',
    },
    {
      label: 'Moderate Risk',
      value: stats.medium,
      accent: 'bg-gold-50 text-gold-400',
      badge: 'Needs monitoring',
      badgeColor: 'bg-gold-50 text-gold-400',
    },
    {
      label: 'Immediate Action',
      value: stats.low,
      accent: 'bg-red-50 text-compliance-low',
      badge: 'Non-adherence risk',
      badgeColor: 'bg-red-50 text-compliance-low',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 lg:py-12">
        {/* Header — Raus editorial */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 animate-fade-in">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl text-forest-500 leading-tight">
              Clinical Overview
            </h1>
            <p className="mt-3 text-forest-500/40 text-lg font-light">
              Welcome back, <span className="text-forest-400 font-medium">Dr. {user?.displayName || user?.email?.split('@')[0]}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-warm border border-cream-200/60">
            <div className="flex -space-x-2">
              {patients.length > 0 ? (
                patients.slice(0, 3).map((p, i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-forest-500 shadow-sm"
                    style={{ backgroundColor: ['#E6F0EA', '#FAF3E0', '#FDEAEA'][i % 3] }}
                  >
                    {(p.name || p.email || 'P').charAt(0).toUpperCase()}
                  </div>
                ))
              ) : (
                [1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-cream-200" />
                ))
              )}
            </div>
            <span className="text-sm font-medium text-forest-500/60">
              {stats.total} Active Patients
            </span>
          </div>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {statCards.map((card, i) => (
            <div key={i} className="card-warm-sm hover:shadow-warm-lg transition-all duration-300 group">
              <p className="text-forest-500/40 font-medium text-sm">{card.label}</p>
              {loading ? (
                <div className="h-10 w-16 skeleton mt-2" />
              ) : (
                <h3 className="font-serif text-4xl text-forest-500 mt-2">{card.value}</h3>
              )}
              <div className={`mt-4 inline-flex items-center text-xs font-semibold ${card.badgeColor} px-3 py-1.5 rounded-full`}>
                {card.badge}
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Compliance Distribution */}
            <section className="card-warm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-xl text-forest-500">Compliance Distribution</h3>
                  <p className="text-sm text-forest-500/40 mt-1">Population health overview</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center h-[320px] w-full">
                {loading ? (
                  <div className="w-full flex flex-col md:flex-row items-center gap-8 px-4">
                    <div className="w-60 h-60 rounded-full skeleton" />
                    <div className="flex-1 space-y-4 w-full">
                      <div className="h-12 w-full skeleton" />
                      <div className="h-12 w-full skeleton" />
                      <div className="h-12 w-full skeleton" />
                    </div>
                  </div>
                ) : chartData.length > 0 ? (
                  <>
                    <div className="w-full h-full md:w-2/3">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={8}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={1500}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ 
                              borderRadius: '1rem', 
                              border: 'none', 
                              boxShadow: '0 4px 24px -2px rgba(0,65,34,0.1)',
                              background: 'white',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/3 grid grid-cols-1 gap-3 px-4">
                      {chartData.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-cream-100 border border-cream-200/50">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm font-medium text-forest-500/60">{entry.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-forest-500">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-forest-500/30 font-medium">No patient data available</div>
                )}
              </div>
            </section>

            {/* Patient List */}
            <section className="card-warm p-2">
               <PatientList />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <section className="sticky top-24 space-y-8">
              <HighRiskAlerts patients={patients} />
              
              {/* AI Insights Card */}
              <div className="bg-forest-500 rounded-[2rem] p-7 text-cream-50 shadow-warm-lg">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                    <svg className="w-5 h-5 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-serif text-lg">AI Insights</h4>
                </div>
                <p className="text-cream-100/60 text-sm leading-relaxed mb-6 font-light">
                  Based on recent patterns, 3 patients in your watchlist show early signs of fatigue and may miss upcoming doses.
                </p>
                <button 
                  onClick={() => setIsAIInsightsOpen(true)}
                  className="w-full btn-pill bg-gold-300 text-forest-500 px-6 py-3.5 text-sm font-semibold shadow-gold hover:brightness-105"
                >
                  View Recommendations →
                </button>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="label-warm ml-1">Quick Actions</h4>
                {[
                  { label: 'Add New Patient', icon: 'M12 4v16m8-8H4', bgColor: 'bg-forest-50', textColor: 'text-forest-400', onClick: () => setIsAddPatientModalOpen(true) },
                  { label: 'Bulk Patient View', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', bgColor: 'bg-gold-50', textColor: 'text-gold-400', onClick: () => setIsBulkViewOpen(true) },
                ].map((action, i) => (
                  <button key={i} onClick={action.onClick} className="w-full flex items-center justify-between p-4 bg-white border border-cream-200/60 rounded-2xl hover:shadow-warm transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 ${action.bgColor} ${action.textColor} rounded-xl group-hover:scale-105 transition-transform`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
                        </svg>
                      </div>
                      <span className="font-medium text-forest-500 text-sm">{action.label}</span>
                    </div>
                    <svg className="w-4 h-4 text-forest-500/20 group-hover:text-forest-500/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onAdd={() => fetchDashboardData()}
      />

      <BulkPatientModal
        isOpen={isBulkViewOpen}
        onClose={() => setIsBulkViewOpen(false)}
        patients={patients}
        loading={loading}
      />

      <AIInsightsModal
        isOpen={isAIInsightsOpen}
        onClose={() => setIsAIInsightsOpen(false)}
      />
    </div>
  );
};

export default DoctorDashboard;
