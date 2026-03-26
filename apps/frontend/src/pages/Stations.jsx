/**
 * Stations List Page
 *
 * Pulls station data directly from the API.
 * Condition is derived from CEI score:
 *   0 – 2  → poor
 *   2 – 4  → moderate
 *   4 – 5  → good
 *
 * CEI is stored on a 0-100 scale on the backend,
 * so we convert: cei / 20 to get a 0-5 equivalent before applying the thresholds.
 */

import { useMemo, useState } from "react";
import { useStations } from "../contexts/StationContext";
import FilterBar from "../components/FilterBar";
import StationCard from "../components/StationCard";

const stationListFilters = [
  {
    type: "search",
    key: "query",
    placeholder: "Search by station name...",
  },
  {
    type: "select",
    key: "condition",
    label: "All Conditions",
    options: [
      { value: "good", label: "Good Condition" },
      { value: "moderate", label: "Moderate Condition" },
      { value: "poor", label: "Poor Condition" },
    ],
  },
  {
    type: "select",
    key: "line",
    label: "All Lines",
    options: [
      { value: "Red", label: "Red Line" },
      { value: "Blue", label: "Blue Line" },
      { value: "Both", label: "Both Lines" },
    ],
  },
];

/**
 * Derives condition label from CEI score (0-100 scale from backend).
 * Converts to 0-5 first then applies thresholds:
 *   0 – 2  → poor
 *   2 – 4  → moderate
 *   4 – 5  → good
 * Returns null if no CEI yet (no feedback submitted).
 */
const getCondition = (cei) => {
  if (cei === null || cei === undefined) return null;
  const score = cei / 20; // convert 0-100 → 0-5
  if (score <= 2) return "poor";
  if (score <= 4) return "moderate";
  return "good";
};

/**
 * Maps a raw API station to the shape StationCard expects.
 */
const mapStation = (s) => ({
  id: s._id,
  name: s.name,
  line: s.line,
  overallScore: s.averageRatings?.overall ?? "N/A",
  condition: getCondition(s.cei),
  cei: s.cei,
  metrics: {
    cleanliness: s.averageRatings?.cleanliness ?? "N/A",
    safety: s.averageRatings?.safety ?? "N/A",
    accessibility: s.averageRatings?.accessibility ?? "N/A",
    crowding: s.averageRatings?.crowding ?? "N/A",
  },
  imageUrl: s.imageUrl ?? null,
});

export default function Stations() {
  const [filters, setFilters] = useState({
    query: "",
    condition: "all",
    line: "all",
  });

  const { stations: rawStations, loading, error } = useStations();
  const stations = useMemo(() => rawStations.map(mapStation), [rawStations]);

  console.log(stations[0]);

  const filteredStations = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    return stations
      .filter((s) => (q ? s.name.toLowerCase().includes(q) : true))
      .filter((s) =>
        filters.condition === "all" ? true : s.condition === filters.condition,
      )
      .filter((s) => (filters.line === "all" ? true : s.line === filters.line));
  }, [filters, stations]);

  const onChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const onClear = () =>
    setFilters({ query: "", condition: "all", line: "all" });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">CTrain Stations</h1>
        <p className="text-sm text-gray-600">
          Browse the list of CTrain stations and view their CEI ratings.
        </p>
      </div>

      {/* Reusable Filter Bar */}
      <FilterBar
        filters={stationListFilters}
        values={filters}
        onChange={onChange}
        onClear={onClear}
      />

      {/* States */}
      {loading && (
        <p className="text-sm text-gray-400 pt-2">Loading stations...</p>
      )}

      {error && <p className="text-sm text-red-500 pt-2">{error}</p>}

      {/* Station List */}
      {!loading && !error && (
        <div className="space-y-5 pt-1">
          {filteredStations.length === 0 ? (
            <p className="text-sm text-gray-500">
              No stations match your filters.
            </p>
          ) : (
            filteredStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
