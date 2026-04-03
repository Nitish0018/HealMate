import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import ChartWrapper from './ChartWrapper';

/**
 * ComplianceVisualization Component
 * Charts for patient compliance trends with multiple time periods
 * 
 * @param {Object} props
 * @param {string} props.patientId - Patient ID to fetch compliance data for
 */
const ComplianceVisualization = ({ patientId }) => {
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  // Fetch compliance data
  useEffect(() => {
    const fetchComplianceData = async () => {
      if (!patientId) return;

      try {
        setLoading(true);
        setError(null);

        // Since backend doesn't have compliance endpoint yet, generate mock data
        const mockData = generateMockComplianceData();
        setComplianceData(mockData);

      } catch (err) {
        console.error('Error fetching compliance data:', err);
        setError(err.response?.data?.message || 'Failed to load compliance data');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceData();
  }, [patientId]);

  // Generate mock compliance data for demonstration
  const generateMockComplianceData = () => {
    const now = new Date();
    
    // Generate daily data (last 30 days)
    const daily = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simulate compliance trend with some randomness
      const baseScore = 75 + Math.sin(i / 10) * 15; // Oscillating around 75%
      const randomVariation = (Math.random() - 0.5) * 20;
      const score = Math.max(40, Math.min(100, baseScore + randomVariation));
      
      daily.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0],
        score: Math.round(score),
        period: 'daily'
      });
    }

    // Generate weekly data (last 12 weeks)
    const weekly = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      
      const baseScore = 70 + Math.sin(i / 4) * 20;
      const randomVariation = (Math.random() - 0.5) * 15;
      const score = Math.max(45, Math.min(100, baseScore + randomVariation));
      
      weekly.push({
        week: `W${12 - i}`,
        score: Math.round(score),
        period: 'weekly'
      });
    }

    // Generate monthly data (last 6 months)
    const monthly = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now);
      monthDate.setMonth(monthDate.getMonth() - i);
      
      const baseScore = 65 + Math.sin(i / 2) * 25;
      const randomVariation = (Math.random() - 0.5) * 10;
      const score = Math.max(50, Math.min(100, baseScore + randomVariation));
      
      monthly.push({
        month: monthNames[monthDate.getMonth()],
        score: Math.round(score),
        period: 'monthly'
      });
    }

    return { daily, weekly, monthly };
  };

  // Get current data based on selected period
  const getCurrentData = () => {
    if (!complianceData) return [];
    return complianceData[selectedPeriod] || [];
  };

  // Get compliance color based on score
  const getComplianceColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const score = data.value;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span 
              className="font-medium"
              style={{ color: getComplianceColor(score) }}
            >
              {score}%
            </span> compliance
          </p>
          <p className="text-xs text-gray-600">
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  if (!patientId) {
    return (
      <ChartWrapper title="Patient Compliance">
        <div className="text-center py-8 text-gray-500">
          Select a patient to view compliance data
        </div>
      </ChartWrapper>
    );
  }

  const currentData = getCurrentData();
  const currentScore = currentData.length > 0 ? currentData[currentData.length - 1].score : 0;

  // Handle empty data state
  if (!complianceData || currentData.length === 0) {
    return (
      <ChartWrapper title="Patient Compliance">
        <div className="text-center py-8 text-gray-500">
          No compliance data available for this patient
        </div>
      </ChartWrapper>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Current Compliance Score */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Current Compliance</h3>
          <div className="flex items-center space-x-2">
            <span 
              className="text-2xl font-bold"
              style={{ color: getComplianceColor(currentScore) }}
            >
              {currentScore}%
            </span>
            {currentScore < 80 && (
              <div className="flex items-center text-sm">
                {currentScore < 60 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Critical
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Warning
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-300"
            style={{
              width: `${currentScore}%`,
              backgroundColor: getComplianceColor(currentScore)
            }}
          />
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          {currentScore >= 80 
            ? 'Excellent adherence! Keep up the great work.' 
            : currentScore >= 60 
            ? 'Good progress. Consider strategies to improve consistency.' 
            : 'Requires immediate attention. Consider intervention strategies.'}
        </p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Compliance Trends</h3>
          
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
            {[
              { key: 'daily', label: 'Daily (30d)', chart: 'line' },
              { key: 'weekly', label: 'Weekly (12w)', chart: 'bar' },
              { key: 'monthly', label: 'Monthly (6m)', chart: 'area' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => handlePeriodChange(period.key)}
                className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                  selectedPeriod === period.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <ChartWrapper
          loading={loading}
          error={error}
          onRetry={handleRetry}
        >
          <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
            {selectedPeriod === 'daily' && (
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: 'Compliance %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Reference lines for thresholds */}
                <ReferenceLine y={80} stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} />
                <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} />
                
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            )}

            {selectedPeriod === 'weekly' && (
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: 'Compliance %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Reference lines for thresholds */}
                <ReferenceLine y={80} stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} />
                <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} />
                
                <Bar
                  dataKey="score"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}

            {selectedPeriod === 'monthly' && (
              <AreaChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: 'Compliance %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Reference lines for thresholds */}
                <ReferenceLine y={80} stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} />
                <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} />
                
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Threshold Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-green-500 mr-2"></div>
            <span className="text-gray-600">Excellent (80%+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-yellow-500 mr-2"></div>
            <span className="text-gray-600">Good (60-79%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
            <span className="text-gray-600">Needs Improvement (&lt;60%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceVisualization;