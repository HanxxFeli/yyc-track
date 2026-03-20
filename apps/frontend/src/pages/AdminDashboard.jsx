/**
 * Admin Dashboard Page
 * 
 * - Uses mock data for now 
 * - Backend routes not merged yet ** later replace mock data with API calls (fetch)
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import StatCard from "../components/StatCard";
import TrainIcon from "../assets/TrainIcon.svg";
import AlertIcon from "../assets/AlertIcon.svg";
import TrendingUpIcon from "../assets/TrendingUp.svg";
import EditIcon from "../assets/Edit.svg";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const [selectedStation, setSelectedStation] = useState("");

  const stations = useMemo(
    () => [
      "Brentwood",
      "Chinook",
      "City Hall",
      "Dalhousie",
      "Marlborough",
      "Somerset",
      "Crowfoot",
      "Heritage",
    ],
    []
  );

  // mock data (needs to be replaced)
  const stats = useMemo(
    () => [
      { label: "Stations\nMonitored", value: 45, icon: TrainIcon },
      { label: "Total Alerts", value: 8, icon: AlertIcon, iconClass: "w-12 h-12" },
      { label: "Average Station Rating Given", value: 84, icon: TrendingUpIcon },
      { label: "New Feedback", value: 16, icon: EditIcon },
    ],
    []
  );

  const flaggedStations = useMemo(
    () => [
      {
        station: "City Hall",
        alertType: "CEI dropped below 65",
        avgCei: 64,
        status: "Urgent",
        date: "2 hours ago",
      },
      {
        station: "Marlborough",
        alertType: "Safety concerns reported",
        avgCei: 66,
        status: "Moderate",
        date: "1 day ago",
      },
      {
        station: "Brentwood",
        alertType: "New feedback spike detected",
        avgCei: 86,
        status: "Information",
        date: "3 days ago",
      },
    ],
    []
  );

  const recentFeedback = useMemo(
    () => [
      {
        user: "Anonymous",
        station: "Brentwood",
        feedback: "Very clean station, but gets packed after sports games.",
        impact: -2,
        date: "2 days ago",
      },
      {
        user: "CalgaryTransit",
        station: "City Hall",
        feedback:
          "Always super busy during rush hour. It’s convenient but crowded.",
        impact: -3,
        date: "6 days ago",
      },
      {
        user: "ILoveTransit",
        station: "Chinook",
        feedback: "Clean and well lit, but parking can be chaos on weekends.",
        impact: -2,
        date: "2 weeks ago",
      },
      {
        user: "Anonymous",
        station: "Marlborough",
        feedback: "Not the safest feeling place at night. Needs more lighting.",
        impact: -5,
        date: "1 week ago",
      },
      {
        user: "Anonymous",
        station: "Dalhousie",
        feedback: "Always clean and quiet. Feels safe even in the evening.",
        impact: +6,
        date: "3 weeks ago",
      },
    ],
    []
  );

  const dashboardStatusMap = useMemo(
    () => ({
      Urgent: "danger",
      Moderate: "warning",
      Information: "info",
    }),
    []
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin!</h1>
        <p className="text-gray-600 mt-1">
          Here’s a quick overview of CEI metrics and user feedbacks.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            title={stat.label}
            value={stat.value}
            iconSrc={stat.icon}
            iconClass={stat.iconClass}
          />
        ))}
      </div>

      {/* Chart card */}
      <div className="bg-white border rounded-xl shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">CEI Trend by Week</h2>
          <select 
            className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white w-56"
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
          >
            <option value="" disabled>
              View CEI Trend for...
            </option>

            {stations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Placeholder chart area */}
        <div className="h-64 w-full rounded-lg border bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
          Chart placeholder (connect to API later)
        </div>
      </div>

      {/* Flagged stations table */}
      <div className="bg-white border rounded-xl shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Flagged / Alerted Stations</h2>
          <Link
            to="/admin/stations"
            className="text-sm font-medium text-[#BC0B2A] hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-3 pr-4">Station</th>
                <th className="py-3 pr-4">Alert Type</th>
                <th className="py-3 pr-4">Avg CEI</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {flaggedStations.map((row) => (
                <tr key={row.station} className="border-b last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-gray-900">{row.station}</td>
                  <td className="py-3 pr-4 text-gray-700">{row.alertType}</td>
                  <td className="py-3 pr-4 text-gray-700">{row.avgCei}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge
                      label={row.status}
                      variant={dashboardStatusMap[row.status] || "neutral"}
                    />
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent feedback table */}
      <div className="bg-white border rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Recent Feedback</h2>
          <Link
            to="/admin/feedback"
            className="text-sm font-medium text-[#BC0B2A] hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-3 pr-4">User</th>
                <th className="py-3 pr-4">Station</th>
                <th className="py-3 pr-4">Feedback</th>
                <th className="py-3 pr-4">CEI Impact</th>
                <th className="py-3 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedback.map((row, idx) => (
                <tr key={idx} className="border-b last:border-b-0 align-top">
                  <td className="py-3 pr-4 font-medium text-gray-900">{row.user}</td>
                  <td className="py-3 pr-4 text-gray-700">{row.station}</td>
                  <td className="py-3 pr-4 text-gray-700 max-w-md">
                    {row.feedback}
                  </td>
                  <td className="py-3 pr-4">
                    <Impact value={row.impact} />
                  </td>
                  <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Impact
 * Shows positive/negative impact with arrow and color.
 */
function Impact({ value }) {
  const isPositive = value > 0;
  return (
    <span className={`inline-flex items-center gap-1 font-medium ${isPositive ? "text-green-700" : "text-red-700"}`}>
      {isPositive ? "↑" : "↓"} {Math.abs(value)}
    </span>
  );
}