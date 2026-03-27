/**
 * CEITrendChart.jsx
 *
 * Line chart showing the system-wide CEI score over time.
 *
 * Props:
 *   data    → { trend: [{ label, cei, feedbackCount }], actualDataDays } | null
 *   loading → boolean — true while the fetch is in flight
 *   error   → string | null — error message if the fetch failed
 *
 * The parent (DataAnalytics) owns the fetch and passes the result down,
 * so this component is purely presentational — no fetch logic lives here.
 */

import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ChartSkeleton, EmptyState, ErrorState } from './AnalyticsStates';

// computes the % change between the first and last CEI data points
// used in the subtitle, e.g. "CEI increased 8.3% over the selected period"
// returns null if there's no data or if the first value is 0 (can't divide by zero)
const calcCeiChange = (trend) => {
  if (!trend?.length) return null;
  const first = trend[0].cei;
  const last  = trend[trend.length - 1].cei;
  if (first === 0) return null; // avoid division by zero
  const pct = (((last - first) / first) * 100).toFixed(1); // one decimal, e.g. "8.3"
  return { pct, positive: last >= first }; // positive drives green vs red colouring in the subtitle
};

const CEITrendChart = ({ data, loading, error }) => {
  const ceiChange = calcCeiChange(data?.trend); // derive the subtitle text from the trend array

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-1">CEI Trend</h2>
        <p className="text-sm text-gray-600">
          {/* show % change once data is loaded, fall back to a generic description */}
          {ceiChange
            ? <>System-wide CEI {ceiChange.positive ? 'increased' : 'decreased'} <span className={ceiChange.positive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{Math.abs(ceiChange.pct)}%</span> over the selected period.</>
            : 'Showing CEI trend over the selected period.'}
        </p>
        {/* actualDataDays tells the admin how many days actually had feedback in the window */}
        {data && (
          <p className="text-xs text-gray-400 mt-1">
            Based on {data.actualDataDays} day{data.actualDataDays !== 1 ? 's' : ''} of data
          </p>
        )}
      </div>

      {/* render priority: loading → error → empty → chart */}
      {loading          ? <ChartSkeleton /> :
       error            ? <ErrorState message={error} /> :
       !data?.trend?.length ? <EmptyState /> : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.trend}> {/* each item: { label, cei, feedbackCount } */}
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="label" stroke="#6B7280" style={{ fontSize: '12px' }} /> {/* label = "Mar 20", formatted by the parent before passing down */}
            <YAxis domain={[0, 100]} stroke="#6B7280" style={{ fontSize: '12px' }} /> {/* fixed 0-100 so the axis doesn't rescale oddly with sparse data */}
            <Tooltip
              formatter={(value) => [`${value}`, 'CEI Score']}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
            />
            <Line
              type="monotone" // smooth curve instead of straight line segments
              dataKey="cei"   // which field from each data point to plot on the Y axis
              stroke="#DC2626"
              strokeWidth={2}
              dot={{ fill: '#DC2626', r: 4 }}  // static dot on each data point
              activeDot={{ r: 6 }}              // slightly bigger dot on hover
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CEITrendChart;