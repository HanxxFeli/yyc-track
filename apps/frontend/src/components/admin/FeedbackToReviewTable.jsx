import { useState } from "react";
import FeedbackStatusBadge from "./FeedbackStatusBadge";

/**
 * FeedbackToReviewTable Component
 *
 * - Displays a table of feedback items that are pending review
 * - Admin users can review each entry and either approve or reject the feedback
 */
export default function FeedbackToReviewTable({ rows, onApprove, onReject }) {
  /** 
   * state for confirmation flow
   * - confirmingId: which row is currently in "confirm mode"
   * - confirmAction: whether the user clicked approve or reject
   */
  const [confirmingId, setConfirmingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // null | "approve" | "reject"

  /**
   * triggered when user clicks approve or reject
   * - switches that row into confirmation mode
   * - stores which action was selected
   */
  const startConfirm = (id, action) => {
    setConfirmingId(id);
    setConfirmAction(action);
  };

  /**
   * cancels confirmation mode
   * - resets state so the buttons return normal
   */
  const cancelConfirm = () => {
    setConfirmingId(null);
    setConfirmAction(null);
  };

  /**
   * final confirmation handler
   * - calls parent function (onApprove or onReject)
   * - exits confirmation mode
   */
  const handleConfirm = (id) => {
    if (confirmAction === "approve") {
      onApprove(id);
    } else if (confirmAction === "reject") {
      onReject(id);
    }

    cancelConfirm();
  };

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900">Feedback to Review</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">
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

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-gray-500" colSpan={6}>
                  No feedback to review.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-b-0 text-sm text-gray-900 align-top"
                >
                  <td className="py-4 pr-4">
                    <div className="font-medium">{row.user}</div>
                    <div className="mt-1 text-xs text-gray-500">{row.submitted}</div>
                  </td>

                  <td className="py-4 pr-4">
                    <div className="font-medium">{row.station}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {row.line === "Dual" ? "Dual" : `${row.line} Line`}
                    </div>
                  </td>

                  <td className="py-4 pr-4 max-w-[260px]">{row.feedback}</td>

                  <td className="py-4 pr-4 text-sm">
                    <div>Cleanliness: {row.categoryRatings.cleanliness}</div>
                    <div>Safety: {row.categoryRatings.safety}</div>
                    <div>Accessibility: {row.categoryRatings.accessibility}</div>
                    <div>Crowding: {row.categoryRatings.crowding}</div>
                  </td>

                  <td className="py-4 pr-4 align-top">
                    <div className="pt-1">
                      <FeedbackStatusBadge status="needs_review" />
                    </div>
                  </td>

                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-3 items-center">

                      {/* CONDITIONAL RENDERING:
                          - if this row is being confirmed, show cancel + confirm buttons 
                          - otherwise show the approve and reject buttons */}
                      {confirmingId === row.id ? (
                        <>

                          {/* Cancel Button */}
                          <button
                            onClick={cancelConfirm}
                            className="h-9 px-5 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-all duration-150"
                          >
                            Cancel
                          </button>

                          {/* Confirm Button:
                              - dynamically changes based on selected action (approve/reject)
                              - calls the handleConfirm to finalize the action */}
                          <button
                            onClick={() => handleConfirm(row.id)}
                            className={`h-9 px-5 rounded-xl text-sm font-medium text-white transition-all duration-150 ${
                              confirmAction === "approve"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-400 hover:bg-red-600"
                            }`}
                          >
                            Confirm {confirmAction === "approve" ? "Approve" : "Reject"}
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Approve Button */}
                          <button
                            onClick={() => startConfirm(row.id, "approve")}
                            className="h-8 px-4 rounded-lg border border-green-500 text-sm font-medium text-green-600 bg-white hover:bg-green-50 transition-all duration-150"
                          >
                            Approve
                          </button>
                          
                          {/* Reject Button */}
                          <button
                            onClick={() => startConfirm(row.id, "reject")}
                            className="h-8 px-4 rounded-lg border border-red-500 text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-all duration-150"
                          >
                            Reject
                          </button>
                        </>
                      )}
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