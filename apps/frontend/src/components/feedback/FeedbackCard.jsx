const SCORE_FIELDS = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "safety", label: "Safety" },
  { key: "accessibility", label: "Accessibility" },
  { key: "crowding", label: "Crowding" },
];

const FeedbackCard = ({ entry }) => {
  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm px-6 py-5">
      {/* Top row: username + date */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-900">
          {entry.userId?.firstName ?? "Anonymous"}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(entry.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Ratings grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {SCORE_FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className="bg-gray-50 rounded-lg px-3 py-2 text-center border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-lg font-bold text-gray-900">
              {entry.ratings?.[key] ?? "—"}
              <span className="text-xs font-normal text-gray-400">/5</span>
            </p>
          </div>
        ))}
      </div>

      {/* Overall rating */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-700">Overall:</span>
        <span className="text-sm font-bold text-gray-900">
          {entry.ratings?.overall ?? "—"}/5
        </span>
      </div>

      {/* Comment */}
      {entry.comment ? (
        <p className="text-sm text-gray-700 leading-relaxed">{entry.comment}</p>
      ) : (
        <p className="text-sm text-gray-400 italic">No comment provided.</p>
      )}
    </div>
  );
};

export default FeedbackCard;
