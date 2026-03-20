/**
 * FeedbackStatusBadge Component
 * 
 * Displays moderation status for feedback items
 * 
 * Props:
 * - status: string
 */
export default function FeedbackStatusBadge({ status }) {

  // Normalize status to lowercase string for consistent comparison
  const s = String(status || "").toLowerCase();

  /**
   * Determine dot color based on status value
   */
  const dot =
    s === "approved"
      ? "bg-green-500"
      : s === "rejected"
      ? "bg-red-500"
      : s === "needs_review"
      ? "bg-yellow-500"
      : "bg-gray-400";
  
  /**
   * Determine text color based on status value
   */
  const textColor = 
    s === "approved"
      ? "text-green-600"
      : s === "rejected"
      ? "text-red-600"
      : s === "needs_review"
      ? "text-yellow-600"
      : "text-gray-600";

  /**
   * Determine label based on status value
   */
  const label =
    s === "approved"
      ? "Approved"
      : s === "rejected"
      ? "Rejected"
      : s === "needs_review"
      ? "Needs Review"
      : status; // fallback to original value if unknown
  
  return (
    <div className="flex items-center gap-2">

      {/* Status Indicator Dot */}
      <span className={`h-3 w-3 rounded-full ${dot}`} />

      {/* Status Text */}
      <span className={`text-xs font-medium ${textColor}`}>{label}</span>
    </div>
  );
}