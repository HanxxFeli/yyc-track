/**
 * StatusBadge Component
 * 
 * displays a visual indicator (colored dot + label)
 * represents a station's condition
 * 
 * props: 
 * - value: string 
 */
export default function StatusBadge({ value }) {

  /**
   * Normalize value to lowercase string
   * this prevents issues if:
   * - value is undefined
   * - value has inconsistent casing 
   */
  const v = String(value || "").toLowerCase();

  /**
   * determines dot color based on condition
   * tailwind classes are selected dynamically
   */
  const dot =
    v === "good"
      ? "bg-green-500"
      : v === "moderate"
      ? "bg-yellow-500"
      : v === "poor"
      ? "bg-red-500"
      : "bg-gray-400";

  /**
   * determines display label based on condition
   * fallback: shows raw value if it is not recognized
   */
  const label =
    v === "good"
      ? "Good Condition"
      : v === "moderate"
      ? "Moderate Condition"
      : v === "poor"
      ? "Poor Condition"
      : value;

  return (
    <div className="flex items-center gap-3">
      {/* Colored Status Dot */}
      <span className={`h-4 w-4 rounded-full ${dot}`} />

      {/* Status Text Label */}
      <span className="text-sm font-semibold text-gray-900">{label}</span>
    </div>
  );
}