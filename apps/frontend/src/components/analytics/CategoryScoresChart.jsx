/**
 * CategoryScoresChart.jsx
 *
 * Bar chart showing average scores per feedback category (cleanliness, safety, etc.)
 * across all stations for the selected time period.
 *
 * Props:
 *   data    → { chartData: [{ category, score }], totalFeedback } | null
 *   loading → boolean
 *   error   → string | null
 *
 * Scores arrive here already converted to the 0-100 scale (the parent multiplies
 * the raw 1-5 ratings by 20 before passing data down).
 */

import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ChartSkeleton, EmptyState, ErrorState } from './AnalyticsStates';

// finds the lowest-scoring category so we can call it out in the subtitle
// spreads into a new array before sorting so we don't mutate the prop in place
const findLowestCategory = (chartData) => {
  if (!chartData?.length) return null;
  return [...chartData].sort((a, b) => a.score - b.score)[0].category; // ascending sort, first item = lowest
};

const CategoryScoresChart = ({ data, loading, error }) => {
  const lowestCategory = findLowestCategory(data?.chartData);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Average Category Scores</h2>
        <p className="text-sm text-gray-600">
          {/* highlight the weakest category once data is available */}
          {lowestCategory
            ? <>{lowestCategory} is the lowest-scoring category across all stations.</>
            : 'Average ratings per category across all stations.'}
        </p>
        {/* show the submission count so admins know if the averages are backed by 3 responses or 3000 */}
        {data?.totalFeedback != null && (
          <p className="text-xs text-gray-400 mt-1">
            Based on {data.totalFeedback.toLocaleString()} feedback submission{data.totalFeedback !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {loading               ? <ChartSkeleton /> :
       error                 ? <ErrorState message={error} /> :
       !data?.chartData?.length ? <EmptyState /> : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.chartData}> {/* each item: { category, score } where score is 0-100 */}
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="category" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis domain={[0, 100]} stroke="#6B7280" style={{ fontSize: '12px' }} /> {/* fixed domain matches the 0-100 scale set by the parent */}
            <Tooltip
              formatter={(value) => [`${value}/100`, 'Score']} // e.g. "78/100" so the scale is obvious
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
            />
            <Bar dataKey="score" fill="#DC2626" radius={[4, 4, 0, 0]} /> {/* radius only on top corners for rounded bar tops */}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategoryScoresChart;