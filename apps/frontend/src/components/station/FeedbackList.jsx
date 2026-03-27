/**
 * FeedbackList Component
 *
 * Scrollable list of feedback cards for a station.
 * Fixed height with overflow-y-auto so the header and
 * submit form stay visible while the list scrolls.
 */

import { FiFileText } from "react-icons/fi";
import FeedbackCard from "../feedback/FeedbackCard";
import FeedbackFilterBar from "./FeedbackfilterBar";

export default function FeedbackList({
  feedback,
  loading,
  sort,
  onSort,
  stationName,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
      {/* Fixed header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Community Feedback
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              What commuters are saying about {stationName}
            </p>
          </div>
          <FeedbackFilterBar sort={sort} onSort={onSort} />
        </div>
      </div>

      {/* Scrollable feedback area */}
      <div
        className="overflow-y-auto px-6 py-4 space-y-4"
        style={{ maxHeight: "480px" }}>
        {loading ? (
          <p className="text-sm text-gray-400 py-4">Loading feedback...</p>
        ) : feedback.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-1">No feedback yet</p>
            <p className="text-xs text-gray-400">
              Be the first to rate this station below
            </p>
          </div>
        ) : (
          feedback.map((entry) => (
            <FeedbackCard key={entry._id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
