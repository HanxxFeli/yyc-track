// components/admin/BottomStationsTable.jsx
import { Link, useNavigate } from "react-router-dom";
import StatusBadge from "../StatusBadge";

const getCeiStatus = (cei) => {
  if (cei == null) return { variant: "neutral" };
  if (cei <= 40) return { variant: "poor" };
  if (cei <= 70) return { variant: "moderate" };
  return { variant: "good" };
};

export default function BottomStationsTable({ bottom5, loading }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-900">
          Stations Needing Attention
        </h2>

        <Link
          to="/admin/stations"
          className="text-sm font-medium text-[#BC0B2A] hover:underline">
          View All
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-4">Loading...</p>
      ) : bottom5.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">No station data yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-3 pr-4">Station</th>
                <th className="py-3 pr-4">Line</th>
                <th className="py-3 pr-4">CEI Score</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Total Feedback</th>
              </tr>
            </thead>
            <tbody>
              {bottom5.map((row) => {
                const { variant } = getCeiStatus(row.cei);

                return (
                  <tr
                    key={row._id}
                    onClick={() => navigate(`/stations/${row._id}`)}
                    className="border-b last:border-b-0 cursor-pointer hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium">{row.name}</td>
                    <td className="py-3 pr-4">{row.line}</td>
                    <td className="py-3 pr-4">{row.cei ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge value={variant} />
                    </td>
                    <td className="py-3 pr-4">{row.totalFeedback}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
