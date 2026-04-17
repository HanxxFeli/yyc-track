/**
 * StationRankings.jsx
 *
 * Two-column list showing the top 5 and bottom 5 stations by pre-computed CEI score.
 *
 * Props:
 *   data    → { top5: [...], bottom5: [...], totalRankedStations } | null
 *   loading → boolean
 *   error   → string | null
 *
 * Note: rankings are NOT filtered by the time range selector — the backend reads
 * the pre-computed `cei` field directly off each Station document, which reflects
 * all-time data. This is intentional and documented in analyticsController.js.
 */

import { EmptyState, ErrorState } from './AnalyticsStates';

// renders one row of the rankings list (station name + coloured score)
// extracted as a sub-component so top5 and bottom5 can share the same markup
const StationRow = ({ station, index, scoreClassName }) => (
  <div key={station._id ?? index} className="flex items-center justify-between">
    <span className="text-sm text-gray-900">{station.name}</span>
    <span className={`text-sm font-bold ${scoreClassName}`}>
      {station.cei != null ? Math.round(station.cei) : '—'} {/* round the float — no need to show 78.4 */}
    </span>
  </div>
);

const StationRankings = ({ data, loading, error }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="mb-4">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Station Rankings</h2>
      {/* show how many stations have enough feedback to appear — if fewer than 5 have data, both lists will be short */}
      {data && (
        <p className="text-xs text-gray-400">
          {data.totalRankedStations} station{data.totalRankedStations !== 1 ? 's' : ''} with feedback
        </p>
      )}
    </div>

    {/* row skeletons instead of ChartSkeleton since this is a list, not a chart */}
    {loading ? (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 5 }).map((_, i) => ( // 5 placeholder rows matching the 5 stations we expect
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    ) : error ? (
      <ErrorState message={error} />
    ) : !data ? (
      <EmptyState />
    ) : (
      <div className="grid grid-cols-2 gap-6">

        {/* top 5 — highest CEI first, scores in green */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Top 5 Stations</h3>
          {data.top5.length === 0 ? (
            <p className="text-xs text-gray-400">No data yet.</p> // happens when zero stations have any feedback at all
          ) : (
            <div className="space-y-3">
              {data.top5.map((station, i) => (
                <StationRow key={station._id ?? i} station={station} index={i} scoreClassName="text-green-600" />
              ))}
            </div>
          )}
        </div>

        {/* bottom 5 — lowest CEI first (backend already reverses the order), scores in orange */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Bottom 5 Stations</h3>
          {data.bottom5.length === 0 ? (
            <p className="text-xs text-gray-400">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.bottom5.map((station, i) => (
                <StationRow key={station._id ?? i} station={station} index={i} scoreClassName="text-orange-600" />
              ))}
            </div>
          )}
        </div>

      </div>
    )}
  </div>
);

export default StationRankings;