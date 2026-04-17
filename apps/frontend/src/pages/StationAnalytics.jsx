/**
 * StationAnalytics Page
 *
 * Route: /admin/analytics/station/:stationId
 *
 * Individual station analytics — mirrors the layout and patterns of DataAnalytics.jsx.
 * Uses the same chart components so the admin experience is consistent:
 *   - CEITrendChart       (line/bar chart)
 *   - CategoryScoresChart (bar chart)
 *   - FeedbackSentiment   (pie chart)
 *   - Volume chart        (recharts BarChart — replaces the plain div bars)
 *
 * API endpoints used:
 *   GET /api/admin/analytics/station/:id/cei-trend?period=7d|30d
 *   GET /api/admin/analytics/station/:id/category-averages?period=7d|30d
 *   GET /api/admin/analytics/station/:id/sentiment?period=7d|30d
 *   GET /api/admin/analytics/station/:id/volume?period=7d|30d
 *
 * Each chart has its own loading/error state so one failing fetch
 * doesn't blank the entire page — same approach as DataAnalytics.jsx.
 */

import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import SafetyIcon from "../assets/Safety.svg";
import PositiveSentimentIcon from "../assets/PositiveSentiment.svg";
import EditIcon from "../assets/Edit.svg";
import TrendingUpIcon from "../assets/TrendingUp.svg";
import StatCard from "../components/StatCard";
import CEITrendChart from "../components/analytics/CEITrendChart";
import CategoryScoresChart from "../components/analytics/CategoryScoresChart";
import FeedbackSentiment from "../components/analytics/FeedbackSentiment";

const API_URL = "http://localhost:5000/api";

// Same colour map as DataAnalytics.jsx
const SENTIMENT_COLOURS = {
  positive: "#22C55E",
  neutral: "#EAB308",
  negative: "#EF4444",
  mixed: "#8B5CF6",
};

// Same fetch helper as DataAnalytics.jsx
const apiFetch = async (path, token) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
};

// Same period mapper as DataAnalytics.jsx
const toPeriod = (days) => (days === "7" ? "7d" : "30d");

// Reusable chart card wrapper — keeps the look identical to DataAnalytics.jsx
function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">
      <div className="mb-3">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// Reusable empty/loading/error state used inside each chart card
function ChartState({ loading, error, empty }) {
  if (loading)
    return (
      <div className="h-52 flex items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="h-52 flex items-center justify-center text-sm text-red-400">
        {error}
      </div>
    );
  if (empty)
    return (
      <div className="h-52 flex items-center justify-center text-sm text-gray-400">
        No data available for this period.
      </div>
    );
  return null;
}

export default function StationAnalytics() {
  const { stationId } = useParams();

  // Read token the same way StationAnalytics.jsx already does
  const token = localStorage.getItem("adminToken");

  const [stationName, setStationName] = useState("");
  const [timeRange, setTimeRange] = useState("7"); // matches DataAnalytics.jsx default

  // Per-chart data state
  const [ceiTrend, setCeiTrend] = useState(null);
  const [categoryAvgs, setCategoryAvgs] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [volume, setVolume] = useState(null);

  // Per-chart loading + error — same pattern as DataAnalytics.jsx
  const [loadingCei, setLoadingCei] = useState(true);
  const [loadingCat, setLoadingCat] = useState(true);
  const [loadingSent, setLoadingSent] = useState(true);
  const [loadingVol, setLoadingVol] = useState(true);

  const [errorCei, setErrorCei] = useState(null);
  const [errorCat, setErrorCat] = useState(null);
  const [errorSent, setErrorSent] = useState(null);
  const [errorVol, setErrorVol] = useState(null);

  // ── Fetch functions (useCallback so timeRange changes re-trigger useEffect) ──

  const fetchCeiTrend = useCallback(async () => {
    setLoadingCei(true);
    setErrorCei(null);
    try {
      const data = await apiFetch(
        `/admin/analytics/station/${stationId}/cei-trend?period=${toPeriod(timeRange)}`,
        token,
      );
      setStationName(data.stationName);
      // Shape matches what CEITrendChart expects — same transform as DataAnalytics.jsx
      setCeiTrend({
        ...data,
        trend: data.trend.map((p) => ({
          ...p,
          label: new Date(p.date).toLocaleDateString("en-CA", {
            month: "short",
            day: "numeric",
          }),
        })),
      });
    } catch (e) {
      setErrorCei(e.message);
    } finally {
      setLoadingCei(false);
    }
  }, [stationId, token, timeRange]);

  const fetchCategoryAvgs = useCallback(async () => {
    setLoadingCat(true);
    setErrorCat(null);
    try {
      const data = await apiFetch(
        `/admin/analytics/station/${stationId}/category-averages?period=${toPeriod(timeRange)}`,
        token,
      );
      const avgs = data.data?.averages ?? {};
      // Same transform as DataAnalytics.jsx — 1-5 scale → 0-100 for the chart
      const chartData = [
        {
          category: "Cleanliness",
          score:
            avgs.cleanliness != null ? Math.round(avgs.cleanliness * 20) : null,
        },
        {
          category: "Safety",
          score: avgs.safety != null ? Math.round(avgs.safety * 20) : null,
        },
        {
          category: "Accessibility",
          score:
            avgs.accessibility != null
              ? Math.round(avgs.accessibility * 20)
              : null,
        },
        {
          category: "Crowding",
          score: avgs.crowding != null ? Math.round(avgs.crowding * 20) : null,
        },
      ].filter((d) => d.score !== null);

      setCategoryAvgs({ totalFeedback: data.data?.totalFeedback, chartData });
    } catch (e) {
      setErrorCat(e.message);
    } finally {
      setLoadingCat(false);
    }
  }, [stationId, token, timeRange]);

  const fetchSentiment = useCallback(async () => {
    setLoadingSent(true);
    setErrorSent(null);
    try {
      const data = await apiFetch(
        `/admin/analytics/station/${stationId}/sentiment?period=${toPeriod(timeRange)}`,
        token,
      );
      // Same transform as DataAnalytics.jsx
      const chartData = Object.entries(data.percentages)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: SENTIMENT_COLOURS[name],
        }));
      setSentiment({ total: data.total, chartData });
    } catch (e) {
      setErrorSent(e.message);
    } finally {
      setLoadingSent(false);
    }
  }, [stationId, token, timeRange]);

  const fetchVolume = useCallback(async () => {
    setLoadingVol(true);
    setErrorVol(null);
    try {
      const data = await apiFetch(
        `/admin/analytics/station/${stationId}/volume?period=${toPeriod(timeRange)}`,
        token,
      );
      // Shape for recharts BarChart — add a short date label for the X-axis
      const chartData = (data.volume ?? []).map((v) => ({
        ...v,
        label: new Date(v.date).toLocaleDateString("en-CA", {
          month: "short",
          day: "numeric",
        }),
      }));
      setVolume({ ...data, chartData });
    } catch (e) {
      setErrorVol(e.message);
    } finally {
      setLoadingVol(false);
    }
  }, [stationId, token, timeRange]);

  // Re-fetch all charts when period changes — same pattern as DataAnalytics.jsx
  useEffect(() => {
    if (!token) return;
    fetchCeiTrend();
    fetchCategoryAvgs();
    fetchSentiment();
    fetchVolume();
  }, [fetchCeiTrend, fetchCategoryAvgs, fetchSentiment, fetchVolume, token]);

  // Derived stat card values
  const latestCEI = ceiTrend?.trend?.[ceiTrend.trend.length - 1]?.cei ?? "—";
  const totalFeedback = categoryAvgs?.totalFeedback ?? "—";
  const positiveShare =
    sentiment?.chartData?.find((d) => d.name === "Positive")?.value ?? 0;
  const totalSentiment = sentiment?.total ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page header — mirrors DataAnalytics.jsx layout */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {stationName || "Station Analytics"}
              </h1>
              <p className="text-gray-600">
                Detailed performance insights for this station.
              </p>
            </div>

            {/* Period selector — identical to DataAnalytics.jsx */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Current CEI"
            value={latestCEI}
            iconSrc={TrendingUpIcon}
          />
          <StatCard
            title="Total Feedback"
            value={totalFeedback}
            iconSrc={EditIcon}
          />
          <StatCard
            title="Positive Sentiment"
            value={totalSentiment > 0 ? `${positiveShare}%` : "—"}
            iconSrc={PositiveSentimentIcon}
          />
          <StatCard
            title="Safety Score"
            value={
              categoryAvgs?.chartData?.find((d) => d.category === "Safety")
                ?.score != null
                ? categoryAvgs.chartData.find((d) => d.category === "Safety")
                    .score
                : "—"
            }
            iconSrc={SafetyIcon}
          />
        </div>

        {/* Top row — CEI trend + category scores (mirrors DataAnalytics.jsx top row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CEITrendChart
            data={ceiTrend}
            loading={loadingCei}
            error={errorCei}
          />

          <CategoryScoresChart
            data={categoryAvgs}
            loading={loadingCat}
            error={errorCat}
          />
        </div>

        {/* Bottom row — sentiment pie + feedback volume (mirrors DataAnalytics.jsx bottom row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeedbackSentiment
            data={sentiment}
            loading={loadingSent}
            error={errorSent}
          />

          {/* Feedback Volume — recharts BarChart */}
          <ChartCard
            title="Feedback Volume"
            subtitle={`Submissions per day · Last ${timeRange === "7" ? "7" : "30"} days`}>
            {loadingVol || errorVol || !volume?.chartData?.length ? (
              <ChartState
                loading={loadingVol}
                error={errorVol}
                empty={!loadingVol && !errorVol && !volume?.chartData?.length}
              />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={volume.chartData}
                    margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [value, "Submissions"]}
                    />
                    <Bar
                      dataKey="count"
                      fill="#BC0B2A"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
                {/* Total count below the chart — mirrors the subtitle pattern in other charts */}
                <p className="text-xs text-gray-500 mt-2 text-right">
                  {volume.totalFeedback} total submission
                  {volume.totalFeedback !== 1 ? "s" : ""} in period
                </p>
              </>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
