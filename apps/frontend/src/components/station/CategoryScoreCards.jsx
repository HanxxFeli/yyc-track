/**
 * CategoryScoreCards Component
 *
 * Displays a grid of category rating cards for a station.
 * Color of the score depends on the value (1-5 scale):
 *   1.0 - 2.0 → red
 *   2.0 - 3.5 → yellow
 *   3.5 - 5.0 → green
 *   null       → gray (no data yet)
 *
 * Props:
 *   averageRatings: {
 *     cleanliness, safety, accessibility, crowding
 *   }
 */

const CATEGORIES = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "safety", label: "Safety" },
  { key: "accessibility", label: "Accessibility" },
  { key: "crowding", label: "Crowding" },
];

const getScoreColor = (value) => {
  if (value === null || value === undefined) return "text-gray-400";
  if (value <= 2.0) return "text-red-600";
  if (value <= 3.5) return "text-yellow-500";
  return "text-green-600";
};

export default function CategoryScoreCards({ averageRatings }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CATEGORIES.map(({ key, label }) => {
        const value = averageRatings?.[key] ?? null;
        return (
          <div key={key} className="border rounded-lg py-4 px-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`font-semibold text-lg mt-1 ${getScoreColor(value)}`}>
              {value !== null ? `${value}/5` : "—"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
