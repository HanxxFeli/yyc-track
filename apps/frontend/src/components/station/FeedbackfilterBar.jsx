/**
 * FeedbackFilterBar Component
 *
 * Sort buttons for the feedback list.
 * Active sort is highlighted with a filled style.
 */

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
];

export default function FeedbackFilterBar({ sort, onSort }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onSort(option.value)}
          className={`h-8 px-4 rounded-lg text-xs font-medium transition border
            ${
              sort === option.value
                ? "bg-[#BC0B2A] text-white border-[#BC0B2A]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#BC0B2A] hover:text-[#BC0B2A]"
            }`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
