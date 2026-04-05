/**
 * StationHeader Component
 *
 * Shows:
 * - Back button
 * - Station name + line label
 * - CEI circle (color based on overall average rating 1-5)
 */

import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import CategoryScoreCards from "./CategoryScoreCards";

/**
 * Circle color based on overall average rating (1-5):
 *   1.0 - 2.0 → red    (poor)
 *   2.0 - 3.5 → yellow (moderate)
 *   3.5 - 5.0 → green  (good)
 */
const getCircleColor = (overall) => {
  if (overall === null || overall === undefined)
    return "bg-gray-200 text-gray-400";
  if (overall <= 2.0) return "bg-red-100 text-red-600 border-red-300";
  if (overall <= 3.5) return "bg-yellow-100 text-yellow-600 border-yellow-300";
  return "bg-green-100 text-green-600 border-green-300";
};

const lineColor = (line) => {
  if (line === "Red") return "text-red-600";
  if (line === "Blue") return "text-blue-600";
  return "text-purple-600";
};

export default function StationHeader({ station }) {
  const navigate = useNavigate();
  const overall = station.averageRatings?.overall ?? null;
  const circleColor = getCircleColor(overall);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
      <div className="flex items-center justify-between">
        {/* Left — back button + station info */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition shrink-0">
            <FiArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {station.name}
            </h1>
            <p
              className={`text-sm font-semibold mt-0.5 ${lineColor(station.line)}`}>
              {station.line === "Both" ? "Both Lines" : `${station.line} Line`}
            </p>
          </div>
        </div>

        {/* Right — overall score circle */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center ${circleColor}`}>
            <span className="text-xl sm:text-2xl font-bold leading-none">
              {overall !== null ? overall.toFixed(2) : "—"}
            </span>
            <span className="text-xs mt-0.5 opacity-70">/ 5</span>
          </div>
          <p className="text-xs text-gray-500 mt-1.5 text-center">Overall</p>
        </div>
      </div>
      <div className="mt-5">
        <CategoryScoreCards averageRatings={station.averageRatings} />
      </div>
    </div>
  );
}
