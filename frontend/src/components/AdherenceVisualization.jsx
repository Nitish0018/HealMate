import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { calculateAdherencePercentage } from '../services/adherenceService';
import { getPatientAdherenceLogs } from '../services/adherenceService';
import ChartWrapper from './ChartWrapper';
import LoadingSpinner from './LoadingSpinner';

/**
 * AdherenceVisualization Component
 * Displays adherence metrics with charts and progress indicators
 */
const AdherenceVisualization = () => {
  const { user } = useAuth();
  const [adherenceData, setAdherenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch adherence data
  useEffect(() => {
    const fetchAdherenceData = async () => {
      if (!user?.mimic_subject_id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch adherence logs
        const logs = await getPatientAdherenceLogs(user.mimic_subject_id);
        
        // Process logs into metrics
        const processedData = processAdherenceLogs(logs);
        setAdherenceData(processedData);

      } catch (err) {
        console.error('Error fetching adherence data:', err);
        setError(err.response?.data?.message || 'Failed to load adherence data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdherenceData();
  }, [user?.mimic_subject_id]);

  // Process adherence logs into daily and weekly metrics
  const processAdherenceLogs = (logs) => {
    const now = new Date();
    const dailyData = [];
    const weeklyData = [];

    // Generate last 7 days of data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Count taken vs total for this date
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp || log.createdAt);
        return logDate.toDateString() === date.toDateString();
      });

      const takenCount = dayLogs.filter(log => log.status === 'taken').length;
      const totalCount = Math.max(dayLogs.length, 3); // Assume at least 3 medications per day
      const percentage = calculateAdherencePercentage(takenCount, totalCount);

      dailyData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: dateStr,
        percentage,
        taken: takenCount,
        total: totalCount
      });
    }

    // Generate last 4 weeks of data
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - (i * 7));

      // Count taken vs total for this week
      const weekLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp || log.createdAt);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      const takenCount = weekLogs.filter(log => log.status === 'taken').length;
      const totalCount = Math.max(weekLogs.length, 21); // Assume 3 meds * 7 days
      const percentage = calculateAdherencePercentage(takenCount, totalCount);

      weeklyData.push({
        week: `Week ${4 - i}`,
        percentage,
        taken: takenCount,
        total: totalCount
      });
    }

    // Calculate current day and week percentages
    const today = new Date();
    const todayLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp || log.createdAt);
      return logDate.toDateString() === today.toDateString();
    });

    const todayTaken = todayLogs.filter(log => log.status === 'taken').length;
    const todayTotal = Math.max(todayLogs.length, 3);
    const dailyPercentage = calculateAdherencePercentage(todayTaken, todayTotal);

    // Current week (last 7 days)
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);
    const thisWeekLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp || log.createdAt);
      return logDate >= weekStart && logDate <= today;
    });

    const weekTaken = thisWeekLogs.filter(log => log.status === 'taken').length;
    const weekTotal = Math.max(thisWeekLogs.length, 21);
    const weeklyPercentage = calculateAdherencePercentage(weekTaken, weekTotal);

    return {
      dailyPercentage,
      weeklyPercentage,
      dailyData,
      weeklyData
    };
  };

  // Get color based on adherence percentage
  const getAdherenceColor = (percentage) => {
    if (percentage >= 80) return 'text-compliance-high';
    if (percentage >= 60) return 'text-compliance-medium';
    return 'text-compliance-low';
  };

  const getAdherenceColorHex = (percentage) => {
    if (percentage >= 80) return '#10b981'; // green
    if (percentage >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="font-medium">{payload[0].value}%</span> adherence
          </p>
          <p className="text-xs text-gray-600">
            {data.taken} of {data.total} medications taken
          </p>
        </div>
      );
    }
    return null;
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ChartWrapper
        title="Adherence Progress"
        error={error}
        onRetry={handleRetry}
      />
    );
  }

  if (!adherenceData) {
    return (
      <ChartWrapper title="Adherence Progress">
        <div className="text-center py-8 text-gray-500">
          No adherence data available
        </div>
      </ChartWrapper>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress Indicators - Responsive: stack on mobile, 2 cols on tablet+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Daily Progress */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Today's Adherence</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className={`text-2xl font-bold ${getAdherenceColor(adherenceData.dailyPercentage)}`}>
              {adherenceData.dailyPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{
                width: `${adherenceData.dailyPercentage}%`,
                backgroundColor: getAdherenceColorHex(adherenceData.dailyPercentage)
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Keep up the good work! Take your medications as scheduled.
          </p>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">This Week's Adherence</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className={`text-2xl font-bold ${getAdherenceColor(adherenceData.weeklyPercentage)}`}>
              {adherenceData.weeklyPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{
                width: `${adherenceData.weeklyPercentage}%`,
                backgroundColor: getAdherenceColorHex(adherenceData.weeklyPercentage)
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {adherenceData.weeklyPercentage >= 80 
              ? 'Excellent adherence this week!' 
              : adherenceData.weeklyPercentage >= 60 
              ? 'Good progress, keep improving!' 
              : 'Let\'s work on improving adherence.'}
          </p>
        </div>
      </div>

      {/* Charts - Responsive: stack on mobile, 2 cols on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Daily Trend Chart */}
        <ChartWrapper
          title="Daily Adherence Trend"
          subtitle="Last 7 days"
        >
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <LineChart data={adherenceData.dailyData}>
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
                label={{ value: 'Adherence %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              {/* Reference lines */}
              <Line
                type="monotone"
                dataKey={() => 80}
                stroke="#10b981"
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey={() => 60}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={1}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Weekly Trend Chart */}
        <ChartWrapper
          title="Weekly Adherence Trend"
          subtitle="Last 4 weeks"
        >
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={adherenceData.weeklyData}>
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
                label={{ value: 'Adherence %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="percentage"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Adherence Levels</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-compliance-high rounded mr-2"></div>
            <span>Excellent (≥80%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-compliance-medium rounded mr-2"></div>
            <span>Good (60-79%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-compliance-low rounded mr-2"></div>
            <span>Needs Improvement (&lt;60%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdherenceVisualization;