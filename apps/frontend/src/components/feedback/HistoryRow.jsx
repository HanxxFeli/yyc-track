/**
 * A single row in the feedback history table.
 * Supports inline comment editing via a toggled textarea.
 *
 * Props:
 * - entry (object): { id, station, comment, cleanliness, safety, accessibility, crowding, overall, date }
 * - onEdit (fn): called with (id, newComment) when the user saves an edit
 * - onDelete (fn): called with (id) when the user clicks Delete
 */

import { useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";

const HistoryRow = ({ entry, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftComment, setDraftComment] = useState(entry.comment);

  const handleSave = () => {
    onEdit(entry.id, draftComment);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-[1fr_2fr_auto] gap-4 py-4 items-start border-b last:border-b-0">

      {/* Station name + anonymous label */}
      <div>
        <p className="text-sm font-semibold text-gray-800">{entry.station}</p>
        <p className="text-xs text-gray-400 mt-0.5">Anonymous</p>
      </div>

      {/* Comment — swaps to a textarea in edit mode */}
      <div>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={draftComment}
              onChange={(e) => setDraftComment(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#BC0B2A]"
            />
            <div className="w-20">
              <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700">{entry.comment}</p>
        )}

        {/* Score summary line */}
        <p className="text-xs text-gray-400 mt-1">
          Cleanliness: {entry.cleanliness} | Safety: {entry.safety} | Accessibility: {entry.accessibility} | Crowding: {entry.crowding} | Overall: {entry.overall}
        </p>
      </div>

      {/* Date + Edit / Delete actions */}
      <div className="flex flex-col items-end gap-2 min-w-max">
        <span className="text-xs text-gray-400">{entry.date}</span>
        <div className="flex gap-2">
          {/* <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-50 transition-colors text-gray-700"
          >
            Edit
          </button> */}
          <button
            onClick={() => onDelete(entry.id)}
            className="text-xs bg-[#BC0B2A] text-white px-3 py-1 rounded hover:bg-[#9a0922] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryRow;