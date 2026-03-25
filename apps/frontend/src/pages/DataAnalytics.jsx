import { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Mock data - replace with API calls later
const mockCEITrendData = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 74 },
  { month: 'Mar', score: 73 },
  { month: 'Apr', score: 75 },
  { month: 'May', score: 76 },
  { month: 'Jun', score: 78 },
];

const mockCategoryScores = [
  { category: 'Cleanliness', score: 78 },
  { category: 'Accessibility', score: 82 },
  { category: 'Crowding', score: 68 },
  { category: 'Safety', score: 71 },
  { category: 'Overall', score: 75 },
];

const mockTopStations = [
  { name: 'Dalhousie', score: 89 },
  { name: 'Brentwood', score: 86 },
  { name: 'University', score: 82 },
  { name: '69th Street', score: 80 },
  { name: 'Banff Trail', score: 78 },
];

const mockBottomStations = [
  { name: 'City Hall', score: 58 },
  { name: 'Marlborough', score: 63 },
  { name: 'Rundle', score: 64 },
  { name: 'Saddletowne', score: 68 },
  { name: 'Bridgeland', score: 69 },
];

const mockSentimentData = [
  { name: 'Positive', value: 48, color: '#22C55E' },
  { name: 'Neutral', value: 32, color: '#EAB308' },
  { name: 'Negative', value: 20, color: '#EF4444' },
];

const DataAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30'); // Time range filter in days

  // TODO: Replace with actual API calls
  // const fetchAnalyticsData = async () => {
  //   const response = await fetch(`/api/analytics?days=${timeRange}`);
  //   const data = await response.json();
  //   return data;
  // };

  // Calculate CEI trend percentage change
  const calculateTrendChange = () => {
    const firstScore = mockCEITrendData[0].score;
    const lastScore = mockCEITrendData[mockCEITrendData.length - 1].score;
    const change = ((lastScore - firstScore) / firstScore) * 100;
    return change.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Data & Analytics</h1>
              <p className="text-gray-600">System-wide insights to support operational decisions.</p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
              
              {/* Export Buttons */}
              <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                Export CSV
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* CEI Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-1">CEI Trend</h2>
              <p className="text-sm text-gray-600">
                System-wide CEI increased {calculateTrendChange()}% over the last 30 days.
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockCEITrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#DC2626" 
                  strokeWidth={2}
                  dot={{ fill: '#DC2626', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Average Category Scores */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Average Category Scores</h2>
              <p className="text-sm text-gray-600">
                Safety remains the lowest-scoring category across all stations.
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockCategoryScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="category" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="score" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Station Rankings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Station Rankings</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Top 5 Stations */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Top 5 Stations</h3>
                <div className="space-y-3">
                  {mockTopStations.map((station, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{station.name}</span>
                      <span className="text-sm font-bold text-green-600">{station.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom 5 Stations */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Bottom 5 Stations</h3>
                <div className="space-y-3">
                  {mockBottomStations.map((station, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{station.name}</span>
                      <span className="text-sm font-bold text-orange-600">{station.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Sentiment */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Feedback Sentiment</h2>
            
            <div className="flex items-center justify-between">
              {/* Pie Chart */}
              <div className="flex-shrink-0">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={mockSentimentData}
                      cx={100}
                      cy={100}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {mockSentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex-1 ml-8 space-y-3">
                {mockSentimentData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DataAnalytics;