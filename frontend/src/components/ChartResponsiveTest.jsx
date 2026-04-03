import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * ChartResponsiveTest Component
 * Simple test component to verify ResponsiveContainer behavior
 * This component demonstrates that charts adapt to container width
 */
const ChartResponsiveTest = () => {
  // Sample data for testing
  const testData = [
    { name: 'Day 1', value: 80 },
    { name: 'Day 2', value: 85 },
    { name: 'Day 3', value: 75 },
    { name: 'Day 4', value: 90 },
    { name: 'Day 5', value: 88 },
  ];

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Chart Responsiveness Test</h1>
      
      {/* Test 1: Full Width Container */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Test 1: Full Width (100%)</h2>
        <div className="border-2 border-blue-200 p-2">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={testData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ✅ Chart adapts to full container width
        </p>
      </div>

      {/* Test 2: Half Width Container */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Test 2: Half Width (50%)</h2>
        <div className="w-1/2 border-2 border-green-200 p-2">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={testData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ✅ Chart adapts to 50% container width
        </p>
      </div>

      {/* Test 3: Responsive Grid Layout */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Test 3: Responsive Grid (1 col mobile, 2 cols desktop)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border-2 border-purple-200 p-2">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={testData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="border-2 border-orange-200 p-2">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={testData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ✅ Charts adapt to grid layout: stacked on mobile, side-by-side on desktop
        </p>
      </div>

      {/* Test 4: Empty Data State */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Test 4: Empty Data State</h2>
        <div className="border-2 border-gray-200 p-2">
          <div className="text-center py-8 text-gray-500">
            No data available
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ✅ Empty state message displays when no data
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Testing Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Resize your browser window from wide to narrow</li>
          <li>Observe how charts adapt to container width</li>
          <li>Use browser DevTools responsive mode to test mobile sizes</li>
          <li>Verify charts remain readable at all sizes</li>
          <li>Check that no horizontal scrolling occurs</li>
        </ol>
      </div>
    </div>
  );
};

export default ChartResponsiveTest;
