/**
 * FeedbackSentiment.jsx
 *
 * Donut chart + legend showing the breakdown of feedback sentiment
 * (positive / negative / neutral / mixed) for the selected time period.
 *
 * Props:
 *   data    → { chartData: [{ name, value, color }], total } | null
 *   loading → boolean
 *   error   → string | null
 *
 * Only feedback submissions that included a comment get a sentiment label
 * from Azure — the `total` count reflects that subset, not all submissions.
 */

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartSkeleton, EmptyState, ErrorState } from './AnalyticsStates';

const FeedbackSentiment = ({ data, loading, error }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="mb-4">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Feedback Sentiment</h2>
      {/* total = number of comments that had a sentiment label, not total feedback submissions */}
      {data?.total != null && (
        <p className="text-xs text-gray-400">
          Based on {data.total.toLocaleString()} comment{data.total !== 1 ? 's' : ''} with sentiment data
        </p>
      )}
    </div>

    {loading           ? <ChartSkeleton /> :
     error             ? <ErrorState message={error} /> :
     !data?.chartData?.length ? <EmptyState message="No sentiment data for this period." /> : (
      <div className="flex items-center justify-between">

        {/* donut chart — innerRadius creates the hole, paddingAngle adds tiny gaps between slices */}
        <div className="flex-shrink-0"> {/* flex-shrink-0 stops the chart being squished by the legend next to it */}
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data.chartData} // each item: { name, value (%), color }
                cx={100} cy={100}     // centre point inside the 200x200 container
                innerRadius={60} outerRadius={80} // difference between these = thickness of the donut ring
                paddingAngle={2}      // small gap between slices so they don't bleed into each other
                dataKey="value"       // which field holds the slice size
              >
                {data.chartData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} /> // each slice gets its colour from SENTIMENT_COLOURS, set by the parent
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} /> {/* show percentage on hover */}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* manual legend — recharts' built-in Legend doesn't give enough layout control for this design */}
        <div className="flex-1 ml-8 space-y-3">
          {data.chartData.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /> {/* colour swatch matching the pie slice */}
                <span className="text-sm font-medium text-gray-900">{item.name}</span> {/* e.g. "Positive" */}
              </div>
              <span className="text-sm text-gray-600">({item.value}%)</span>
            </div>
          ))}
        </div>

      </div>
    )}
  </div>
);

export default FeedbackSentiment;