/**
 * ArchiveColumn Component
 * 
 * - This component is a reusable column for displaying either approved or rejected feedback.
 * - Displays a title, and list of feedback entries
 */
function ArchiveColumn({ title, titleColor, rows }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">

      {/* Column Header */}
      <div className={`px-6 py-4 border-b border-gray-200 ${titleColor}`}>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      {/* Column Content */}
      <div className="p-6 space-y-4">

        {/* If no feedback exists, show empty state message */}
        {rows.length === 0 ? (
          <p className="text-sm text-gray-500">No feedback to display.</p>
        ) : (
          
          // map through feedback entries and render each entry in a card-like format
          rows.map((row) => (
            <div 
              key={row.id} 
              className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  {/* User Name */}
                  <div className="font-medium text-gray-900">
                    {row.user}
                  </div>

                  {/* Station and Line Info */}
                  <div className="text-sm text-gray-700 mt-1">
                    {row.station} | {row.line} Line
                  </div>
                </div>
              </div>

              {/* Feedback Text */}
              <p className="mt-3 text-sm text-gray-800">
                {row.feedback}
              </p>

              {/* Submission Date */}
              <div className="mt-3 text-xs text-gray-500">
                {row.submitted}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * FeedbackArchive Component
 * 
 * - Displays two column side by side (one for approved and one for rejected)
 * - Renders two ArchiveColumn components side-by-side
 */
export default function FeedbackArchive({ approved, rejected}) {
  return (
    <div className="space-y-4">

      {/* Section Title */}
      <h2 className="text-xl font-bold text-gray-900">
        Archived Feedback
      </h2>

      {/* Grid Layout for Approved and Rejected Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Approved Feedback Column */}
        <ArchiveColumn
          title="Approved"
          titleColor="text-green-700"
          rows={approved}
        />

        {/* Rejected Feedback Column */}
        <ArchiveColumn
          title="Rejected"
          titleColor="text-red-700"
          rows={rejected}
        />
      </div>
    </div>
  );
}