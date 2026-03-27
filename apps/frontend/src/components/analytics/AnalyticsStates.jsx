/**
 * AnalyticsStates.jsx
 *
 * Three tiny shared components used by every chart on the DataAnalytics page:
 *   - ChartSkeleton  → shown while a fetch is in flight
 *   - EmptyState     → shown when the fetch succeeded but returned no data
 *   - ErrorState     → shown when the fetch itself threw an error
 *
 * Keeping them here means each chart file just imports what it needs
 * instead of re-defining the same divs over and over.
 */

// animated placeholder that looks like a bar chart so the layout doesn't jump when data loads
export const ChartSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-3 h-[300px] justify-end">
    {[60, 80, 50, 90, 70, 85].map((h, i) => ( // arbitrary heights just to create a bar-chart silhouette
      <div key={i} className="bg-gray-200 rounded" style={{ height: `${h}%` }} />
    ))}
  </div>
);

// shown when the API returned ok but the period simply has no data yet
// message has a sensible default so most callers don't need to pass anything
export const EmptyState = ({ message = 'No data available for this period.' }) => (
  <div className="flex items-center justify-center h-[300px] text-sm text-gray-400">
    {message}
  </div>
);

// shown when the fetch threw — message comes from the Error caught in each chart's fetch function,
// which surfaces the backend's own error string via apiFetch
export const ErrorState = ({ message }) => (
  <div className="flex items-center justify-center h-[300px] text-sm text-red-500">
    {message}
  </div>
);