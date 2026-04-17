import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import TrainIcon from "../assets/TrainIcon.svg";
import AlertIcon from "../assets/AlertIcon.svg";
import TrendingUpIcon from "../assets/TrendingUp.svg";
import EditIcon from "../assets/Edit.svg";
import CEITrendChart from "../components/analytics/CEITrendChart";
import DashboardStats from "../components/admin/DashboardStats";
import BottomStationsTable from "../components/admin/BottomStations";
import RecentPendingTable from "../components/admin/RecentPendingTable";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

// CEI → status label for the bottom 5 table
const getCeiStatus = (cei) => {
  if (cei === null || cei === undefined)
    return { label: "No Data", variant: "neutral" };
  if (cei <= 40) return { label: "Urgent", variant: "poor" };
  if (cei <= 70) return { label: "Moderate", variant: "moderate" };
  return { label: "Stable", variant: "good" };
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState("");

  // Stat card values
  const [totalStations, setTotalStations] = useState(null);
  const [pendingCount, setPendingCount] = useState(null);
  const [avgCEI, setAvgCEI] = useState(null);
  const [newFeedback, setNewFeedback] = useState(null);

  // CEI trend chart
  const [ceiTrend, setCeiTrend] = useState([]);
  const [trendLoading, setTrendLoading] = useState(false);

  // Bottom 5 stations (replaces flagged stations mock)
  const [bottom5, setBottom5] = useState([]);

  // Recent pending feedback (replaces recent feedback mock)
  const [recentPending, setRecentPending] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [stationsRes, pendingRes, avgRes, volumeRes, rankingsRes] =
          await Promise.all([
            fetch(`${API_URL}/api/stations`),
            fetch(`${API_URL}/api/feedback/admin/pending`, {
              headers: authHeader(),
            }),
            fetch(
              `${API_URL}/api/admin/analytics/category-averages?period=7d`,
              { headers: authHeader() },
            ),
            fetch(`${API_URL}/api/admin/analytics/volume`, {
              headers: authHeader(),
            }),
            fetch(`${API_URL}/api/admin/analytics/station-rankings`, {
              headers: authHeader(),
            }),
          ]);

        const [stationsData, pendingData, avgData, volumeData, rankingsData] =
          await Promise.all([
            stationsRes.json(),
            pendingRes.json(),
            avgRes.json(),
            volumeRes.json(),
            rankingsRes.json(),
          ]);

        setStations(stationsData.stations ?? []);
        setTotalStations(stationsData.total ?? 0);
        setPendingCount(pendingData.total ?? 0);

        // Average overall CEI across all stations — convert 1-5 avg to 0-100
        const overall = avgData.data?.averages?.overall;
        setAvgCEI(overall != null ? Math.round(overall * 20) : null);

        setNewFeedback(volumeData.totalFeedback ?? 0);
        setBottom5(rankingsData.bottom5 ?? []);
        setRecentPending((pendingData.results ?? []).slice(0, 5));

        // Set default station for trend chart
        if (stationsData.stations?.length > 0) {
          setSelectedStationId(stationsData.stations[0]._id);
        }
      } catch (err) {
        console.error("AdminDashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Fetch CEI trend when selected station changes
  const fetchTrend = useCallback(async () => {
    if (!selectedStationId) return;
    setTrendLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/admin/analytics/station/${selectedStationId}/cei-trend?period=7d`,
        { headers: authHeader() },
      );
      const data = await res.json();
      setCeiTrend(data.trend ?? []);
    } catch (err) {
      console.error("fetchTrend error:", err);
    } finally {
      setTrendLoading(false);
    }
  }, [selectedStationId]);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  const formattedTrendData = ceiTrend.map((point) => ({
    label: new Date(point.date).toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
    }),
    cei: point.cei,
    feedbackCount: point.feedbackCount ?? 0, // optional if your API doesn’t return it
  }));

  const chartData = {
    trend: formattedTrendData,
    actualDataDays: ceiTrend.length,
  };

  const stats = [
    {
      label: "Stations\nMonitored",
      value: totalStations ?? "—",
      icon: TrainIcon,
    },
    {
      label: "Pending Review",
      value: pendingCount ?? "—",
      icon: AlertIcon,
      iconClass: "w-12 h-12",
    },
    {
      label: "Avg System CEI",
      value: avgCEI != null ? `${avgCEI}` : "—",
      icon: TrendingUpIcon,
    },
    { label: "New Feedback (7d)", value: newFeedback ?? "—", icon: EditIcon },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, Admin!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's a quick overview of CEI metrics and user feedbacks.
        </p>
      </div>

      {/* Stat cards */}
      <DashboardStats stats={stats} />

      {/* CEI Trend chart */}
      <div className="bg-white border rounded-xl shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">
            CEI Trend (Last 7 Days)
          </h2>
          <select
            className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white w-56"
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}>
            {stations.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <CEITrendChart data={chartData} loading={trendLoading} error={null} />
      </div>

      {/* Bottom 5 stations (replaces flagged stations mock) */}
      <BottomStationsTable bottom5={bottom5} loading={loading} />

      {/* Recent pending feedback (replaces recent feedback mock) */}
      <RecentPendingTable data={recentPending} loading={loading} />
    </div>
  );
}
