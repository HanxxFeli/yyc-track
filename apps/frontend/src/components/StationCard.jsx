/**
 * StationCard Component
 * 
 * Displays a summary card for a single station
 * 
 * Props: 
 * - station: {
 *     id.
 *     name,
 *     line,
 *     overallScore,
 *     condition,
 *     metrics: {
 *        cleanliness,
 *        safety,
 *        accessibility,
 *        crowding
 *     },
 *     imageUrl
 *   }
 */

import StatusBadge from "./StatusBadge";

export default function StationCard({ station }) {

  /**
   * determines text color based on station list
   * keeps styling logic centralized instead of scattering
   * conditionals inside jsx
   */
  const lineColor =
    station.line === "Red"
      ? "text-red-600"
      : station.line === "Blue"
      ? "text-blue-600"
      : station.line === "Dual"
      ? "text-purple-600"
      : "text-gray-700";

  /**
   * determines label text for line
   * dual is intentionally simplified
   */
  const lineLabel =
    station.line === "Dual"
      ? "Dual"
      : `${station.line} Line`;

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm px-6 py-5">
      <div className="flex gap-6">
        
        {/* Station Image */}
        <div className="h-28 w-40 rounded-lg bg-gray-100 overflow-hidden shrink-0">
          <img
            src={station.imageUrl}
            alt={station.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Main content wrapper */}
        <div className="flex-1 flex flex-col justify-between">
          
          {/* Top Row: Title + Line + Condition */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {station.name}
              </h3>

              <p className={`text-sm font-semibold mt-1 ${lineColor}`}>
                {lineLabel}
              </p>
            </div>

            {/* Condition Indicator */}
            <StatusBadge value={station.condition} />
          </div>

          {/* Middle Section */}
          <div className="mt-3">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">Overall Score:</span>{" "}
              <span className="text-green-600 font-semibold">
                {station.overallScore}
              </span>
            </p>

            <p className="mt-1 text-sm text-gray-600">
              <span className="font-medium">Cleanliness:</span>{" "}
              {station.metrics.cleanliness}{" "}
              <span className="text-gray-400">|</span>{" "}
              <span className="font-medium">Safety:</span>{" "}
              {station.metrics.safety}{" "}
              <span className="text-gray-400">|</span>{" "}
              <span className="font-medium">Accessibility:</span>{" "}
              {station.metrics.accessibility}{" "}
              <span className="text-gray-400">|</span>{" "}
              <span className="font-medium">Crowding:</span>{" "}
              {station.metrics.crowding}
            </p>
          </div>

          {/* Bottom Section: Button */}
          <div className="flex justify-end mt-4">
            <button className="h-9 px-4 rounded-lg border border-red-500 text-sm font-medium text-red-600 hover:bg-red-50 transition">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}