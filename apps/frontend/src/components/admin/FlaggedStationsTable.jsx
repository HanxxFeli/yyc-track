/**
 * FlaggedStationsTable Component
 * 
 * displays list of flagged or alerted stations that require admin attention
 * 
 * props:
 * - rows: array of objects
 *    {
 *      station,
 *      line,
 *      avgCei,
 *      issue,
 *      lastUpdated,
 *      action
 *    }
*/

export default function FlaggedStationsTable({ rows }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
      
      {/* Section Title */}
      <h2 className="text-xl font-bold text-gray-900">Flagged / Alerted Stations</h2>

      {/* Table Wrapper */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">

          {/* Table Header */}
          <thead>
            <tr className="text-sm font-semibold text-gray-700 border-b">
              <th className="py-3 pr-4">Station</th>
              <th className="py-3 pr-4">Line</th>
              <th className="py-3 pr-4">Avg CEI</th>
              <th className="py-3 pr-4">Issue</th>
              <th className="py-3 pr-4">Last Updated</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} 
                className="border-b last:border-b-0 text-sm text-gray-800"
              >
                <td className="py-4 pr-4">{r.station}</td>
                <td className="py-4 pr-4">{r.line}</td>
                <td className="py-4 pr-4">{r.avgCei}</td>
                <td className="py-4 pr-4">{r.issue}</td>
                <td className="py-4 pr-4">{r.lastUpdated}</td>

                {/* Action Button */}
                <td className="py-4 text-right">
                  <button className="h-9 px-4 rounded-lg border border-red-500 text-sm font-medium text-red-600 hover:bg-red-50 transition">
                    {r.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}