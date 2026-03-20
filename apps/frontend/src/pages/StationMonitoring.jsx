/**
 * Filter configuration for the Monitoring Page
 * 
 * this uses same reusable FilterBar component but with different configuration
 */

import { useMemo, useState } from "react";
import FilterBar from "../components/FilterBar";
import MonitoringCard from "../components/admin/MonitoringCard";
import FlaggedStationsTable from "../components/admin/FlaggedStationsTable";
import { MOCK_MONITORING_STATIONS, MOCK_FLAGGED_STATIONS } from "../mockMonitoringData";

const monitoringFilters = [
  { 
    type: "search", 
    key: "query", 
    placeholder: "Search by station name..." 
  },
  {
    type: "select",
    key: "line",
    label: "All Lines",
    options: [
      { value: "Red", label: "Red Line" },
      { value: "Blue", label: "Blue Line" },
      { value: "Dual", label: "Dual" },
    ],
  },
  {
    type: "select",
    key: "ceiStatus",
    label: "CEI Status",
    options: [
      { value: "stable", label: "Stable" },
      { value: "moderate", label: "Moderate" },
      { value: "poor", label: "Poor" },
    ],
  },
  {
    type: "select",
    key: "sort",
    label: "Sort By",
    options: [
      { value: "score_desc", label: "CEI (High → Low)" },
      { value: "score_asc", label: "CEI (Low → High)" },
      { value: "name_asc", label: "Station Name (A → Z)" },
    ],
  },
];

/**
 * local filter state
 * controls search query, line filter, cei status filter, and sorting
 */
export default function StationMonitoring() {
  const [filters, setFilters] = useState({
    query: "",
    line: "all",
    ceiStatus: "all",
    sort: "all",
  });

  /**
   * memoized filtered dataset
   * - filters by search query
   * - filters by line
   * - filters by cei status
   * - applies selected sorting options
   * 
   * useMemo is for making sure that recalculation only when filters change
   */
  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    let data = MOCK_MONITORING_STATIONS
      .filter((s) => (q ? s.name.toLowerCase().includes(q) : true))
      .filter((s) => (filters.line === "all" ? true : s.line === filters.line))
      .filter((s) =>
        filters.ceiStatus === "all" ? true : s.ceiStatus === filters.ceiStatus
      );

    // Sorting options
    if (filters.sort === "score_desc") data = [...data].sort((a, b) => b.cei - a.cei);
    if (filters.sort === "score_asc") data = [...data].sort((a, b) => a.cei - b.cei);
    if (filters.sort === "name_asc") data = [...data].sort((a, b) => a.name.localeCompare(b.name));

    return data;
  }, [filters]);

  /**
   * generic filter update handler
   * keeps logic centralized and reusable
   */
  const onChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  
  // resets all filters to default values
  const onClear = () => setFilters({ query: "", line: "all", ceiStatus: "all", sort: "all" });

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Station Monitoring</h1>
        <p className="text-sm text-gray-600">
          Track CEI changes, flagged stations, and performance trends.
        </p>
      </div>

      {/* Reusable FilterBar */}
      <FilterBar filters={monitoringFilters} values={filters} onChange={onChange} onClear={onClear} />

      {/* Monitoring Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-1">
        {filtered.map((station) => (
          <MonitoringCard key={station.id} station={station} />
        ))}
      </div>

      {/* Flagged Stations Table */}
      <FlaggedStationsTable rows={MOCK_FLAGGED_STATIONS} />
    </div>
  );
}