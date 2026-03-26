
// // Mock data - replace with API calls later
// const mockCEITrendData = [
//   { month: 'Jan', score: 72 },
//   { month: 'Feb', score: 74 },
//   { month: 'Mar', score: 73 },
//   { month: 'Apr', score: 75 },
//   { month: 'May', score: 76 },
//   { month: 'Jun', score: 78 },
// ];

// const mockCategoryScores = [
//   { category: 'Cleanliness', score: 78 },
//   { category: 'Accessibility', score: 82 },
//   { category: 'Crowding', score: 68 },
//   { category: 'Safety', score: 71 },
//   { category: 'Overall', score: 75 },
// ];

// const mockTopStations = [
//   { name: 'Dalhousie', score: 89 },
//   { name: 'Brentwood', score: 86 },
//   { name: 'University', score: 82 },
//   { name: '69th Street', score: 80 },
//   { name: 'Banff Trail', score: 78 },
// ];

// const mockBottomStations = [
//   { name: 'City Hall', score: 58 },
//   { name: 'Marlborough', score: 63 },
//   { name: 'Rundle', score: 64 },
//   { name: 'Saddletowne', score: 68 },
//   { name: 'Bridgeland', score: 69 },
// ];

// const mockSentimentData = [
//   { name: 'Positive', value: 48, color: '#22C55E' },
//   { name: 'Neutral', value: 32, color: '#EAB308' },
//   { name: 'Negative', value: 20, color: '#EF4444' },
// ];

// const DataAnalytics = () => {
//   const [timeRange, setTimeRange] = useState('30'); // Time range filter in days

  // TODO: Replace with actual API calls
  // const fetchAnalyticsData = async () => {
  //   const response = await fetch(`/api/analytics?days=${timeRange}`);
  //   const data = await response.json();
  //   return data;
  // };

/**
 * DataAnalytics.jsx
 *
 * Main analytics page. This file owns:
 *   - All fetch logic and state (loading, error, data per chart)
 *   - The time range selector that re-triggers fetches
 *   - Layout (page header, grid)
 *
 * The actual chart rendering lives in the components imported below.
 * Each chart gets its own data, loading, and error props so one failing
 * fetch doesn't blank the entire page.
 *
 * API endpoints used (all require admin JWT via protectAdmin middleware):
 *   GET /api/admin/analytics/cei-trend?period=7d|30d
 *   GET /api/admin/analytics/category-averages?period=7d|30d
 *   GET /api/admin/analytics/sentiment?period=7d|30d
 *   GET /api/admin/analytics/station-rankings   (no period — uses pre-computed CEI)
 */

import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext'; // admin-specific context — exposes token stored under "adminToken" in localStorage

import CEITrendChart       from './analytics/CEITrendChart';
import CategoryScoresChart from './analytics/CategoryScoresChart';
import StationRankings     from './analytics/StationRankings';
import FeedbackSentiment   from './analytics/FeedbackSentiment';

const API_URL = 'http://localhost:5000/api'; // matches PORT in .env

// colour map for the 4 sentiment labels the backend returns
// kept here (not in FeedbackSentiment) because the parent shapes the data before passing it down
const SENTIMENT_COLOURS = {
  positive: '#22C55E',
  neutral:  '#EAB308',
  negative: '#EF4444',
  mixed:    '#8B5CF6', // the backend returns "mixed"; the original mock data didn't include it
};

// shared fetch helper — attaches the Bearer token so protectAdmin lets the request through
// throws with the backend's own error message if the response is not ok
const apiFetch = async (path, token) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})); // fall back to empty object if the body isn't JSON
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
};

// the backend only understands "7d" and "30d"
// the UI exposes 90 and 365 day options for when the controller is extended later
const toPeriod = (days) => (days === '7' ? '7d' : '30d');

const DataAnalytics = () => {
  const { token } = useAdminAuth(); // JWT from AdminAuthContext — stored under "adminToken" in localStorage, set on admin login

  const [timeRange, setTimeRange] = useState('30'); // days as string, matches <select> option values

  // data state for each chart — null means not yet loaded
  const [ceiTrend,     setCeiTrend]     = useState(null); // { trend: [{ label, cei, feedbackCount }], actualDataDays }
  const [categoryAvgs, setCategoryAvgs] = useState(null); // { chartData: [{ category, score }], totalFeedback }
  const [sentiment,    setSentiment]    = useState(null); // { chartData: [{ name, value, color }], total }
  const [rankings,     setRankings]     = useState(null); // { top5, bottom5, totalRankedStations }

  // per-chart loading flags so each chart can show its own skeleton independently
  const [loadingCei,  setLoadingCei]  = useState(true);
  const [loadingCat,  setLoadingCat]  = useState(true);
  const [loadingSent, setLoadingSent] = useState(true);
  const [loadingRank, setLoadingRank] = useState(true);

  // per-chart error strings — one failing endpoint doesn't affect the others
  const [errorCei,  setErrorCei]  = useState(null);
  const [errorCat,  setErrorCat]  = useState(null);
  const [errorSent, setErrorSent] = useState(null);
  const [errorRank, setErrorRank] = useState(null);

  // useCallback so the function reference only changes when token or timeRange changes,
  // which prevents the useEffect below from re-running on every render
  const fetchCeiTrend = useCallback(async () => {
    setLoadingCei(true); setErrorCei(null); // reset before each fetch so stale errors don't linger
    try {
      const data = await apiFetch(`/admin/analytics/cei-trend?period=${toPeriod(timeRange)}`, token);
      // backend sends dates as ISO strings — convert to short labels like "Mar 20" for the X-axis
      const trend = data.trend.map((d) => ({
        ...d, // keep cei, feedbackCount, etc.
        label: new Date(d.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }),
      }));
      setCeiTrend({ ...data, trend }); // keep actualDataDays + periodDays alongside the formatted trend
    } catch (e) {
      setErrorCei(e.message);
    } finally {
      setLoadingCei(false); // always stop the spinner, even if the fetch failed
    }
  }, [token, timeRange]);

  const fetchCategoryAvgs = useCallback(async () => {
    setLoadingCat(true); setErrorCat(null);
    try {
      const data = await apiFetch(`/admin/analytics/category-averages?period=${toPeriod(timeRange)}`, token);
      const avgs = data.data?.averages ?? {}; // data.data because the controller wraps the payload in a "data" key

      // backend stores ratings on a 1-5 scale — multiply by 20 to get 0-100 for the chart
      const chartData = [
        { category: 'Cleanliness',   score: avgs.cleanliness   != null ? Math.round(avgs.cleanliness   * 20) : null },
        { category: 'Accessibility', score: avgs.accessibility != null ? Math.round(avgs.accessibility * 20) : null },
        { category: 'Crowding',      score: avgs.crowding      != null ? Math.round(avgs.crowding      * 20) : null },
        { category: 'Safety',        score: avgs.safety        != null ? Math.round(avgs.safety        * 20) : null },
        { category: 'Overall',       score: avgs.overall       != null ? Math.round(avgs.overall       * 20) : null },
      ].filter((d) => d.score !== null); // drop categories with no data so bars don't render at height 0

      setCategoryAvgs({ totalFeedback: data.data?.totalFeedback, chartData });
    } catch (e) {
      setErrorCat(e.message);
    } finally {
      setLoadingCat(false);
    }
  }, [token, timeRange]);

  const fetchSentiment = useCallback(async () => {
    setLoadingSent(true); setErrorSent(null);
    try {
      const data = await apiFetch(`/admin/analytics/sentiment?period=${toPeriod(timeRange)}`, token);
      // backend returns percentages as { positive: 48.2, negative: 20.1, neutral: 31.7, mixed: 0 }
      // filter out 0% labels so the pie doesn't have invisible slices, then shape for recharts
      const chartData = Object.entries(data.percentages)
        .filter(([, v]) => v > 0) // leading comma skips the key in destructuring — we only need the value here
        .map(([name, value]) => ({
          name:  name.charAt(0).toUpperCase() + name.slice(1), // "positive" → "Positive"
          value,
          color: SENTIMENT_COLOURS[name], // look up by original lowercase key before capitalising
        }));
      setSentiment({ total: data.total, chartData });
    } catch (e) {
      setErrorSent(e.message);
    } finally {
      setLoadingSent(false);
    }
  }, [token, timeRange]);

  const fetchRankings = useCallback(async () => {
    setLoadingRank(true); setErrorRank(null);
    try {
      // no period param — the backend reads the pre-computed cei field on each Station document
      const data = await apiFetch(`/admin/analytics/station-rankings`, token);
      setRankings(data); // { top5, bottom5, totalRankedStations } — CEI is already 0-100
    } catch (e) {
      setErrorRank(e.message);
    } finally {
      setLoadingRank(false);
    }
  }, [token]); // no timeRange dependency — rankings aren't period-filtered

  // re-fetch the three period-sensitive charts when the time range changes or on first load
  // all three fire in parallel so the page doesn't load charts one by one
  useEffect(() => {
    if (!token) return; // AuthContext might still be hydrating — don't fetch without a token
    fetchCeiTrend();
    fetchCategoryAvgs();
    fetchSentiment();
  }, [fetchCeiTrend, fetchCategoryAvgs, fetchSentiment, token]); // useCallbacks are in the dep array — they only change when token/timeRange changes

  // rankings is in its own effect because it doesn't re-run when timeRange changes
  useEffect(() => {
    if (!token) return;
    fetchRankings();
  }, [fetchRankings, token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* page header + controls */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Data & Analytics</h1>
              <p className="text-gray-600">System-wide insights to support operational decisions.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* changing this re-creates the useCallback functions, which triggers the useEffect to re-fetch */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>  {/* maps to "30d" until the controller supports longer windows */}
                <option value="365">Last Year</option>    {/* same — maps to "30d" for now */}
              </select>

              {/* placeholders — wire these up when export endpoints exist */}
              <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                Export CSV
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* top row — CEI trend + category averages */}
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

        {/* bottom row — station rankings + sentiment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StationRankings
            data={rankings}
            loading={loadingRank}
            error={errorRank}
          />
          <FeedbackSentiment
            data={sentiment}
            loading={loadingSent}
            error={errorSent}
          />
        </div>

      </div>
    </div>
  );
};

export default DataAnalytics;