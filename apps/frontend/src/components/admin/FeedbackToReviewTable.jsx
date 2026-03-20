import FeedbackStatusBadge from "./FeedbackStatusBadge";

/**
 * FeedbackToReviewTable Component
 * 
 * - Displays a table of feedback items that are pending review
 * - Admin users can review each entry and either approve or reject the feedback
 */
export default function FeedbackToReviewTable({ rows, onApprove, onReject }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
      
      {/* Section Title */}
      <h2 className="text-xl font-bold text-gray-900">
        Feedback to Review
      </h2>

      {/* Table Container with horizontal scroll on small screens */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">

          {/* Table Header */}
          <thead>
            <tr className="text-sm font-semibold text-gray-700 border-b">
              <th className="py-3 pr-4">User</th>
              <th className="py-3 pr-4">Station</th>
              <th className="py-3 pr-4">Feedback</th>
              <th className="py-3 pr-4">Category Ratings</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {/* Empty State */}
            {rows.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-gray-500" colSpan={6}>
                  No feedback to review.
                </td>
              </tr>
            ) : (

              // Render each feedback row dynamically
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-b-0 text-sm text-gray-900 align-top"
                >

                  {/* User Info with Submission Date */}
                  <td className="py-4 pr-4">
                    <div className="font-medium">{row.user}</div>
                    <div className="mt-1 text-xs text-gray-500">{row.submitted}</div>
                  </td>

                  {/* Station and Line Info */}
                  <td className="py-4 pr-4">
                    <div className="font-medium">{row.station}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {row.line === "Dual" ? "Dual" : `${row.line} Line`}
                    </div>
                  </td>

                  {/* Feedback Text */}
                  <td className="py-4 pr-4 max-w-[260px]">{row.feedback}</td>

                  {/* Category Ratings */}
                  <td className="py-4 pr-4 text-sm">
                    <div>Cleanliness: {row.categoryRatings.cleanliness}</div>
                    <div>Safety: {row.categoryRatings.safety}</div>
                    <div>Accessibility: {row.categoryRatings.accessibility}</div>
                    <div>Crowding: {row.categoryRatings.crowding}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 pr-4 align-top">
                    <div className="pt-1">
                      <FeedbackStatusBadge status="needs_review" />
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">

                      {/* Approve Button */}
                      <button
                        onClick={() => onApprove(row.id)}
                        className="h-8 px-3 rounded-lg border border-green-500 text-xs font-medium text-green-600 hover:bg-green-50 transition"
                      >
                        Approve
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => onReject(row.id)}
                        className="h-8 px-3 rounded-lg border border-red-500 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}