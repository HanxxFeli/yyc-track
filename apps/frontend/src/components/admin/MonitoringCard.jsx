import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

/**
 * Monitoring Component
 */

export default function MonitoringCard({ station }) {
  const lineColor =
    station.line === "Red"
      ? "text-red-600"
      : station.line === "Blue"
        ? "text-blue-600"
        : station.line === "Both"
          ? "text-purple-600"
          : "text-gray-700";

  const statusLabel =
    station.ceiStatus === "stable"
      ? "Stable"
      : station.ceiStatus === "moderate"
        ? "Moderate"
        : "Poor";

  const statusPill =
    station.ceiStatus === "stable"
      ? "bg-green-500"
      : station.ceiStatus === "moderate"
        ? "bg-yellow-500"
        : "bg-red-600";

  const scoreBubble =
    station.ceiStatus === "stable"
      ? "bg-green-600"
      : station.ceiStatus === "moderate"
        ? "bg-yellow-500"
        : "bg-red-700";

  return (
    <div className="rounded-xl bg-white border shadow-sm p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {station.name}
          </h3>
          <p className={`text-sm font-medium ${lineColor}`}>
            {station.line} Line
          </p>
        </div>

        <div
          className={`h-10 w-10 rounded-full ${scoreBubble} text-white flex items-center justify-center font-bold text-sm`}>
          {station.cei ?? "—"}
        </div>
      </div>

      {/* REAL CHART */}
      <div className="mt-4 h-28">
        {station.trend?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={station.trend}>
              <Tooltip
                formatter={(value) => [`${value}`, "CEI"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="cei"
                stroke={
                  station.ceiStatus === "stable"
                    ? "#16A34A"
                    : station.ceiStatus === "moderate"
                      ? "#EAB308"
                      : "#DC2626"
                }
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No trend data
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${statusPill}`}>
          {statusLabel}
        </span>

        <button className="h-9 px-4 rounded-lg border border-red-500 text-sm font-medium text-red-600 hover:bg-red-50">
          View Details
        </button>
      </div>
    </div>
  );
}
