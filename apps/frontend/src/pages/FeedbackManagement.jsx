import { useMemo, useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import FeedbackToReviewTable from '../components/admin/FeedbackToReviewTable';
import FeedbackArchive from '../components/admin/FeedbackArchive';
import { useStations } from '../contexts/StationContext';

/**
 * Maps a raw API pending feedback item to the shape
 * FeedbackToReviewTable and FeedbackArchive expect.
 */
const mapFeedback = (item) => ({
  id: item._id,
  user: item.userId?.email ?? "Unknown User",
  station: item.stationId?.name ?? "Unknown Station",
  line: item.stationId?.line ?? "",
  feedback: item.comment ?? "",
  categoryRatings: {
    cleanliness:   item.ratings?.cleanliness   ?? "N/A",
    safety:        item.ratings?.safety         ?? "N/A",
    accessibility: item.ratings?.accessibility  ?? "N/A",
    crowding:      item.ratings?.crowding       ?? "N/A",
  },
  submitted: new Date(item.createdAt).toLocaleDateString(),
});

const API_URI='http://localhost:5000'

export default function FeedbackManagement() {
  const { stations } = useStations();

  const [toReview, setToReview] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    query: "",
    station: "all",
    status: "needs_review",
    sort: "newest",
  });

  // Build station options from context instead of mock data
  const feedbackFilters = [
    {
      type: "search",
      key: "query",
      placeholder: "Search by station name, user, or keyword...",
    },
    {
      type: "select",
      key: "station",
      label: "All Stations",
      options: stations.map((s) => ({ value: s.name, label: s.name })),
    },
    {
      type: "select",
      key: "status",
      label: "Status",
      options: [{ value: "needs_review", label: "Needs Review" }],
    },
    {
      type: "select",
      key: "sort",
      label: "Sort By",
      options: [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "station_asc", label: "Station Name (A-Z)" },
      ],
    },
  ];

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  };

  // Fetch pending and archived feedback on mount
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const [pendingRes, archivedRes, deletedRes] = await Promise.all([
          fetch(`${API_URI}/api/feedback/admin/pending`, { headers: authHeader }),
          fetch(`${API_URI}/api/feedback/admin/archived`, { headers: authHeader }),
          fetch(`${API_URI}/api/feedback/admin/deleted`, { headers: authHeader }),
        ]);

        if (!pendingRes.ok || !archivedRes.ok || !deletedRes.ok) {
          throw new Error("Failed to fetch feedback.");
        }

        const [pendingData, archivedData, deletedData] = await Promise.all([
          pendingRes.json(),
          archivedRes.json(),
          deletedRes.json(),
        ]);
        setToReview(pendingData.results.map(mapFeedback));
        setApproved(archivedData.results.map(mapFeedback));
        setRejected(deletedData.results.map(mapFeedback));
      } catch (err) {
        console.error("FeedbackManagement fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const filteredToReview = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    let data = [...toReview];

    if (q) {
      data = data.filter((item) => {
        const searchableText =
          `${item.station} ${item.user} ${item.feedback}`.toLowerCase();
        return searchableText.includes(q);
      });
    }

    if (filters.station !== "all") {
      data = data.filter((item) => item.station === filters.station);
    }

    if (filters.sort === "station_asc") {
      data.sort((a, b) => a.station.localeCompare(b.station));
    }

    if (filters.sort === "oldest") {
      data = [...data].reverse();
    }

    return data;
  }, [toReview, filters]);

  const onChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const onClear = () =>
    setFilters({ query: "", station: "all", status: "needs_review", sort: "newest" });

  /**
   * Approve — calls PATCH /api/feedback/admin/:id/approve
   * Moves item from toReview to approved locally on success
   */
  const onApprove = async (id) => {
    try {
      const res = await fetch(
        `${API_URI}/api/feedback/admin/${id}/approve`,
        { method: "PATCH", headers: authHeader }
      );

      if (!res.ok) throw new Error("Failed to approve feedback.");

      const selected = toReview.find((item) => item.id === id);
      if (!selected) return;

      setApproved((prev) => [selected, ...prev]);
      setToReview((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("onApprove error:", err);
    }
  };

  /**
   * Reject — calls DELETE /api/feedback/admin/:id (sets isDeleted: true)
   * Moves item from toReview to rejected locally on success
   */
  const onReject = async (id) => {
    try {
      const res = await fetch(
        `${API_URI}/api/feedback/admin/${id}`,
        { method: "DELETE", headers: authHeader }
      );

      if (!res.ok) throw new Error("Failed to reject feedback.");

      const selected = toReview.find((item) => item.id === id);
      if (!selected) return;

      setRejected((prev) => [selected, ...prev]);
      setToReview((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("onReject error:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
        <p className="text-sm text-gray-600">
          Review, moderate, and archive user-submitted feedback.
        </p>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading feedback...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* Filter Controls */}
          <FilterBar
            filters={feedbackFilters}
            values={filters}
            onChange={onChange}
            onClear={onClear}
          />

          {/* Pending feedback table */}
          <FeedbackToReviewTable
            rows={filteredToReview}
            onApprove={onApprove}
            onReject={onReject}
          />

          {/* Archive: approved and rejected */}
          <FeedbackArchive
            approved={approved}
            rejected={rejected}
          />
        </>
      )}
    </div>
  );
}