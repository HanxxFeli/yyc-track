/**
 * Monitoring Component
 * 
 * Displays analytics summary for a station in the Monitoring page
 * 
 * props:
 * - station: {
 *    id,
 *    name,
 *    line,
 *    cei,
 *    ceiStatus,
 *    trend
 * }
 */

export default function MonitoringCard({ station }) {

  // determines line text color
  const lineColor =
    station.line === "Red"
      ? "text-red-600"
      : station.line === "Blue"
      ? "text-blue-600"
      : station.line === "Dual"
      ? "text-purple-600"
      : "text-gray-700";

  // determines cei status pill background color
  const statusPill =
    station.ceiStatus === "stable"
      ? "bg-green-500"
      : station.ceiStatus === "moderate"
      ? "bg-yellow-500"
      : "bg-red-600";

  // status label
  const statusLabel =
    station.ceiStatus === "stable"
      ? "Stable"
      : station.ceiStatus === "moderate"
      ? "Moderate"
      : "Poor";

  // determine score bubble background color which is based on cei status
  const scoreBubble =
    station.ceiStatus === "stable"
      ? "bg-green-600"
      : station.ceiStatus === "moderate"
      ? "bg-yellow-500"
      : "bg-red-700";

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
      
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{station.name}</h3>
          <p className={`text-sm font-medium ${lineColor}`}>
            {station.line === "Dual" ? "Dual" : `${station.line} Line`}
          </p>
        </div>

        {/* CEI Score Bubble */}
        <div className={`h-10 w-10 rounded-full ${scoreBubble} text-white flex items-center justify-center font-bold text-sm`}>
          {station.cei}
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="mt-4 h-28 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        Chart Placeholder
      </div>

      {/* Footer Section */}
      <div className="mt-4 flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${statusPill}`}>
          {statusLabel}
        </span>

        {/* Action Button */}
        <button className="h-9 px-4 rounded-lg border border-red-500 text-sm font-medium text-red-600 hover:bg-red-50 transition">
          View Details
        </button>
      </div>
    </div>
  );
}