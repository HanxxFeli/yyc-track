import { useMemo, useState, useEffect } from "react";
import FilterBar from "../components/FilterBar";
import MonitoringCard from "../components/admin/MonitoringCard";
import FlaggedStationsTable from "../components/admin/FlaggedStationsTable";
import { useStations } from "../contexts/StationContext";

const API_URL = "http://localhost:5000";

const monitoringFilters = [
  { type: "search", key: "query", placeholder: "Search by station name..." },
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

export default function StationMonitoring() {
  const { stations, loading: stationsLoading } = useStations();

  const [filters, setFilters] = useState({
    query: "",
    line: "all",
    ceiStatus: "all",
    sort: "all",
  });

  const [monitoringData, setMonitoringData] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  });

  // ONLY CEI TREND FETCHING (stations come from context now)
  useEffect(() => {
    const fetchMonitoring = async () => {
      try {
        if (!stations?.length) return;

        const results = await Promise.all(
          stations.map(async (station) => {
            try {
              const res = await fetch(
                `${API_URL}/api/admin/analytics/station/${station._id}/cei-trend?period=7d`,
                { headers: authHeader() },
              );

              const data = await res.json();

              const trend = data.trend ?? [];
              const latest = trend[trend.length - 1]?.cei ?? null;

              return {
                id: station._id,
                name: station.name,
                line: station.line,
                cei: latest,
                ceiStatus:
                  latest == null
                    ? "moderate"
                    : latest <= 40
                      ? "poor"
                      : latest <= 70
                        ? "moderate"
                        : "stable",
                trend,
              };
            } catch (err) {
              console.error("Trend fetch failed:", station.name);
              return null;
            }
          }),
        );

        setMonitoringData(results.filter(Boolean));
      } catch (err) {
        console.error("Monitoring fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitoring();
  }, [stations]);

  // FILTERING
  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    let data = monitoringData
      .filter((s) => (q ? s.name.toLowerCase().includes(q) : true))
      .filter((s) => (filters.line === "all" ? true : s.line === filters.line))
      .filter((s) =>
        filters.ceiStatus === "all" ? true : s.ceiStatus === filters.ceiStatus,
      );

    if (filters.sort === "score_desc")
      data = [...data].sort((a, b) => (b.cei ?? 0) - (a.cei ?? 0));

    if (filters.sort === "score_asc")
      data = [...data].sort((a, b) => (a.cei ?? 0) - (b.cei ?? 0));

    if (filters.sort === "name_asc")
      data = [...data].sort((a, b) => a.name.localeCompare(b.name));

    return data;
  }, [filters, monitoringData]);

  const onChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const onClear = () =>
    setFilters({
      query: "",
      line: "all",
      ceiStatus: "all",
      sort: "all",
    });

  const isLoading = loading || stationsLoading;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Station Monitoring</h1>
        <p className="text-sm text-gray-600">
          Track CEI changes, flagged stations, and performance trends.
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        filters={monitoringFilters}
        values={filters}
        onChange={onChange}
        onClear={onClear}
      />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-1">
        {isLoading ? (
          <p className="text-gray-400">Loading monitoring data...</p>
        ) : (
          filtered.map((station) => (
            <MonitoringCard key={station.id} station={station} />
          ))
        )}
      </div>
    </div>
  );
}
