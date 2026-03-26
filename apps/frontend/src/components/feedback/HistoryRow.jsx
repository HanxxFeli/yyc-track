/**
 * A single row in the feedback history table.
 * Supports inline comment editing via a toggled textarea.
 *
 * Props:
 * - entry (object): { id, station, comment, cleanliness, safety, accessibility, crowding, overall, date }
 * - onDelete (fn): called with (id) when the user clicks Delete
 */

import React, { useState } from 'react';

const HistoryRow = ({ entry, onDelete }) => {

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="grid grid-cols-[1fr_2fr_auto] gap-4 py-4 items-start border-b last:border-b-0">

      {/* Station name + anonymous label */}
      <div>
        <p className="text-sm font-semibold text-gray-800">{entry.station}</p>
        <p className="text-xs text-gray-400 mt-0.5">Anonymous</p>
      </div>

      {/* Comment — swaps to a textarea in edit mode */}
      <div>
        <p className="text-sm text-gray-700">{entry.comment}</p>

        {/* Score summary line */}
        <p className="text-xs text-gray-400 mt-1">
          Cleanliness: {entry.cleanliness} | Safety: {entry.safety} | Accessibility: {entry.accessibility} | Crowding: {entry.crowding} | Overall: {entry.overall}
        </p>
      </div>

      {/* Date / Delete actions */}
      <div className="flex flex-col items-end gap-2 min-w-max">
        <span className="text-xs text-gray-400">{entry.date}</span>
        <div className="flex gap-2">
          {showConfirm ? (
            <>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Confirm Delete?
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="text-xs bg-[#BC0B2A] text-white px-3 py-1 rounded hover:bg-[#9a0922] transition-colors"
              >
                Delete
            </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default HistoryRow;