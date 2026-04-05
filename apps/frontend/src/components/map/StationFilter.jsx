// ============================================================================
// Station Filter Component
// ============================================================================
// Real-time search and filter — fires onFilterChange on every interaction.
// No Apply button needed. Has a Reset button to clear all filters.
// On mobile, collapses into a toggle so it doesn't push the map off screen.
// Props: { onFilterChange, isAuthenticated }
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { FiChevronDown, FiFilter, FiX, FiChevronUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TRANSIT_LINES = [
  { value: "all", label: "All Lines" },
  { value: "red", label: "Red Line" },
  { value: "blue", label: "Blue Line" },
  { value: "both", label: "Both Lines" },
];

const CEI_RANGES = [
  { value: "good", label: "Good (3.5 – 5)", color: "bg-green-500" },
  { value: "moderate", label: "Moderate (2 – 3.5)", color: "bg-amber-500" },
  { value: "poor", label: "Poor (0 – 2)", color: "bg-red-500" },
];

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "cleanliness", label: "Cleanliness" },
  { value: "safety", label: "Safety" },
  { value: "accessibility", label: "Accessibility" },
  { value: "crowding", label: "Crowding" },
];

const SORT_OPTIONS = [
  { value: "none", label: "Default" },
  { value: "cei_desc", label: "CEI: High → Low" },
  { value: "cei_asc", label: "CEI: Low → High" },
  { value: "name_asc", label: "Name: A → Z" },
  { value: "feedback", label: "Most Feedback" },
];

const RADIO_STYLES = {
  selected: "bg-[#BC0B2A] border-2 border-[#BC0B2A]",
  unselected: "border border-gray-300 bg-transparent",
};

const DEFAULT_FILTERS = {
  searchQuery: "",
  transitLine: "all",
  category: "",
  ceiRange: "",
  sortBy: "none",
};

const StationFilter = ({ onFilterChange, isAuthenticated }) => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isExpanded, setIsExpanded] = useState(false); // mobile collapse state

  // Count active filters (excluding defaults) for the badge
  const activeCount = [
    filters.searchQuery !== "",
    filters.transitLine !== "all",
    filters.category !== "",
    filters.ceiRange !== "",
    filters.sortBy !== "none",
  ].filter(Boolean).length;

  // Fire onFilterChange every time any filter changes — real-time, no button
  const updateFilter = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        onFilterChange(next);
        return next;
      });
    },
    [onFilterChange],
  );

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
  };

  // Fire once on mount so the parent has the initial state
  useEffect(() => {
    onFilterChange(DEFAULT_FILTERS);
  }, []);

  return (
    <div className="w-full h-auto lg:h-full lg:max-h-full bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Find a CTrain Station
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Filters apply instantly — no button needed.
            </p>
          </div>

          {/* Mobile toggle button */}
          <button
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition relative"
            onClick={() => setIsExpanded((v) => !v)}>
            <FiFilter className="w-4 h-4" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#BC0B2A] text-white text-xs font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
            {isExpanded ? (
              <FiChevronUp className="w-3 h-3" />
            ) : (
              <FiChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Search — always visible even on mobile */}
        <div className="mt-4">
          <input
            type="text"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BC0B2A] focus:border-transparent transition-all"
            placeholder="e.g., Chinook, City Hall..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter("searchQuery", e.target.value)}
          />
        </div>
      </div>

      {/* ── Scrollable filter body ──
           On mobile: hidden unless expanded
           On desktop: always visible                                        */}
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 ${isExpanded ? "block" : "hidden lg:block"}`}>
        <div className="space-y-5">
          {/* Transit Line — radio buttons */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Transit Line
            </label>
            <div className="flex flex-col gap-2.5">
              {TRANSIT_LINES.map(({ value, label }) => (
                <label key={value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="transitLine"
                    value={value}
                    checked={filters.transitLine === value}
                    onChange={() => updateFilter("transitLine", value)}
                    className="sr-only"
                  />
                  <span
                    className={`w-5 h-5 rounded-full mr-2.5 transition-all ${
                      filters.transitLine === value
                        ? RADIO_STYLES.selected
                        : RADIO_STYLES.unselected
                    }`}
                  />
                  <span className="text-sm text-gray-800">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category — dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md text-sm text-gray-900 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BC0B2A] focus:border-transparent transition-all"
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}>
                {CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* CEI Range — toggle buttons */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              CEI Range
            </label>
            <div className="flex flex-col gap-2">
              {CEI_RANGES.map((item) => (
                <button
                  key={item.value}
                  onClick={() =>
                    updateFilter(
                      "ceiRange",
                      filters.ceiRange === item.value ? "" : item.value,
                    )
                  }
                  className={`flex items-center px-3 py-2 rounded-md border text-sm transition ${
                    filters.ceiRange === item.value
                      ? "border-[#BC0B2A] bg-red-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}>
                  <span
                    className={`w-4 h-4 rounded-full ${item.color} mr-2 shrink-0`}
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active filters summary — only shown when something is active */}
          {activeCount > 0 && (
            <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  {activeCount} filter{activeCount > 1 ? "s" : ""} active
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs text-[#BC0B2A] font-semibold hover:underline flex items-center gap-1">
                  <FiX className="w-3 h-3" /> Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filters.transitLine !== "all" && (
                  <Tag
                    label={`Line: ${filters.transitLine}`}
                    onRemove={() => updateFilter("transitLine", "all")}
                  />
                )}
                {filters.category && (
                  <Tag
                    label={`Cat: ${filters.category}`}
                    onRemove={() => updateFilter("category", "")}
                  />
                )}
                {filters.ceiRange && (
                  <Tag
                    label={`CEI: ${filters.ceiRange}`}
                    onRemove={() => updateFilter("ceiRange", "")}
                  />
                )}
                {filters.sortBy !== "none" && (
                  <Tag
                    label={`Sort: ${SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label}`}
                    onRemove={() => updateFilter("sortBy", "none")}
                  />
                )}
                {filters.searchQuery && (
                  <Tag
                    label={`"${filters.searchQuery}"`}
                    onRemove={() => updateFilter("searchQuery", "")}
                  />
                )}
              </div>
            </div>
          )}

          {/* Login/Register prompt — only when not authenticated */}
          {!isAuthenticated && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Want to leave feedback?
              </p>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Login or register to share your station experience.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 px-4 py-2 bg-[#BC0B2A] text-white text-sm font-semibold rounded-md hover:bg-[#A30A26] transition-colors">
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 px-4 py-2 bg-white text-[#BC0B2A] text-sm font-semibold rounded-md border border-[#BC0B2A] hover:bg-red-50 transition-colors">
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer: Reset button — replaces Apply button ── */}
      <div
        className={`flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 ${isExpanded ? "block" : "hidden lg:block"}`}>
        <button
          onClick={handleReset}
          disabled={activeCount === 0}
          className="w-full px-4 py-3 bg-[#BC0B2A] text-white text-sm sm:text-base font-semibold rounded-md hover:bg-[#A30A26] active:translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {activeCount > 0
            ? `Reset Filters (${activeCount})`
            : "No Filters Active"}
        </button>
      </div>
    </div>
  );
};

// Small removable tag shown in the active filters summary
function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#BC0B2A] text-white text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:opacity-75">
        <FiX className="w-3 h-3" />
      </button>
    </span>
  );
}

export default StationFilter;
