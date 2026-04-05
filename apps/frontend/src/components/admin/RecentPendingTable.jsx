// components/admin/RecentPendingTable.jsx
import { Link } from "react-router-dom";

export default function RecentPendingTable({ data, loading }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-900">Pending Review</h2>
        <Link
          to="/admin/feedback"
          className="text-sm font-medium text-[#BC0B2A] hover:underline">
          View All
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-4">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">
          No pending feedback. All clear!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-3 pr-4">User</th>
                <th className="py-3 pr-4">Station</th>
                <th className="py-3 pr-4">Comment</th>
                <th className="py-3 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0 align-top">
                  <td className="py-3 pr-4 font-medium text-gray-900">
                    {row.userId?.email ?? "Unknown"}
                  </td>
                  <td className="py-3 pr-4 text-gray-700">
                    {row.stationId?.name ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-gray-700 max-w-md">
                    {row.comment || (
                      <span className="text-gray-400 italic">No comment</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
