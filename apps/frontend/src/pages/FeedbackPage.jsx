import { useState, useEffect } from "react";
import { FiSearch, FiFileText } from "react-icons/fi";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import ErrorMessage from "../components/common/ErrorMessage";
import SuccessMessage from "../components/common/SuccessMessage";
import ScoreInput from "../components/feedback/ScoreInput";
import HistoryRow from "../components/feedback/HistoryRow";
import { useStations } from "../contexts/StationContext";

const SCORE_FIELDS = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "safety", label: "Safety" },
  { key: "accessibility", label: "Accessibility" },
  { key: "crowding", label: "Crowding" },
];

const API_URI='http://localhost:5000'

const MAX_COMMENT = 1000;

// Valid scores are integers 1-5 only
const isValidScore = (val) => {
  const n = Number(val);
  return val !== "" && !isNaN(n) && Number.isInteger(n) && n >= 1 && n <= 5;
};

// Average of 4 scores rounded to 1 decimal, null if any field is empty
const computeOverall = (scores) => {
  const vals = Object.values(scores);
  if (vals.some((v) => v === "")) return null;
  return Math.round(vals.reduce((sum, v) => sum + Number(v), 0) / vals.length);
};

const FeedbackPage = () => {
  const { stations, loading: stationsLoading } = useStations();

  const [selectedStation, setSelectedStation] = useState(null);
  const [scores, setScores] = useState({
    cleanliness: "",
    safety: "",
    accessibility: "",
    crowding: "",
  });
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const overall = computeOverall(scores);
  const setScore = (key) => (val) => setScores((prev) => ({ ...prev, [key]: val }));

  // Set default selected station once stations load
  useEffect(() => {
    if (stations.length > 0 && !selectedStation) {
      setSelectedStation(stations[0]);
    }
  }, [stations]);

  const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URI}/api/feedback/mine`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch feedback history");
        const data = await res.json();
        setHistory(data.feedback);
      } catch (err) {
        console.error("fetchHistory error:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

  // Fetch user's own feedback history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedStation) {
      setErrorMsg("Please select a station.");
      return;
    }

    const invalidScores = SCORE_FIELDS.filter(({ key }) => !isValidScore(scores[key]));
    if (invalidScores.length) {
      setErrorMsg("Please ensure all category scores are whole numbers between 1 and 5.");
      return;
    }

    if (comment.length > MAX_COMMENT) {
      setErrorMsg(`Your comment exceeds the ${MAX_COMMENT}-character limit.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URI}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          stationId: selectedStation._id,
          ratings: {
            safety:        Number(scores.safety),
            cleanliness:   Number(scores.cleanliness),
            accessibility: Number(scores.accessibility),
            crowding:      Number(scores.crowding),
            overall:       overall ?? 1,
          },
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit feedback.");
        return;
      }

      await fetchHistory()
      
      // Check if azure content safety allowed it to pass
      if (data.notice) {
        setErrorMsg(data.notice);
      } else {
        setSuccessMsg("Your feedback has been submitted successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
      setScores({ cleanliness: "", safety: "", accessibility: "", crowding: "" });
      setComment("");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("handleSubmit error:", err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setScores({ cleanliness: "", safety: "", accessibility: "", crowding: "" });
    setComment("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URI}/api/feedback/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Delete failed:", data.error);
        return;
      }

      setHistory((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("handleDelete error:", err);
    }
  };

  const filteredHistory = history.filter((f) =>
    f.stationId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Station Feedback</h1>
          <p className="text-sm sm:text-base text-gray-600">Share your experience and help improve Calgary Transit</p>
        </div>

        <div className="space-y-6 sm:space-y-8">

          {/* FEEDBACK FORM SECTION */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 lg:p-8">

              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Share Your Feedback</h2>
                <p className="text-sm text-gray-500">Rate and review a CTrain station</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

                <div className="xl:col-span-2 space-y-6">

                  {/* Station dropdown from context */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Station
                    </label>
                    {stationsLoading ? (
                      <div className="text-sm text-gray-400">Loading stations...</div>
                    ) : (
                      <select
                        value={selectedStation?._id || ""}
                        onChange={(e) => {
                          const station = stations.find((s) => s._id === e.target.value);
                          setSelectedStation(station);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#BC0B2A] focus:border-transparent transition"
                      >
                        {stations.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Score inputs — 1 to 5 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Rate Each Category (1-5)
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {SCORE_FIELDS.map(({ key, label }) => (
                        <ScoreInput
                          key={key}
                          label={label}
                          value={scores[key]}
                          onChange={setScore(key)}
                          invalid={scores[key] !== "" && !isValidScore(scores[key])}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment textarea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comments
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={5}
                      placeholder="Describe your experience at this station..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#BC0B2A] focus:border-transparent transition"
                    />
                    <div className={`text-right text-xs mt-1.5 ${comment.length > MAX_COMMENT ? "text-red-500 font-medium" : "text-gray-500"}`}>
                      {comment.length} / {MAX_COMMENT}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="flex-1 sm:flex-initial sm:w-44">
                      <PrimaryButton
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        loadingText="Submitting..."
                      >
                        Submit Feedback
                      </PrimaryButton>
                    </div>
                    <div className="flex-1 sm:flex-initial sm:w-32">
                      <SecondaryButton onClick={handleClear} disabled={isSubmitting}>
                        Clear
                      </SecondaryButton>
                    </div>
                  </div>

                </div>

                {/* Overall score + messages */}
                <div className="xl:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600 mb-2">Overall CFI Score</p>
                      <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-1">
                        {overall !== null ? overall : "—"}
                      </div>
                      <p className="text-xs text-gray-500">out of 5</p>
                    </div>
                    {(errorMsg || successMsg) && <div className="border-t border-gray-300" />}
                    <div className="space-y-3">
                      <ErrorMessage message={errorMsg} />
                      <SuccessMessage message={successMsg} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* FEEDBACK HISTORY SECTION */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 lg:p-8">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Feedback History</h2>
                  <p className="text-sm text-gray-500">View and manage your submissions</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search stations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#BC0B2A] focus:border-transparent transition"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div className="hidden lg:grid lg:grid-cols-[2fr_3fr_1fr_100px] gap-4 px-4 pb-3 mb-4 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Station</span>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Feedback</span>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</span>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</span>
              </div>

              <div className="space-y-3 lg:space-y-2">
                {historyLoading ? (
                  <div className="text-center py-12 text-sm text-gray-400">Loading history...</div>
                ) : filteredHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 mb-1">No feedback found</p>
                    <p className="text-xs text-gray-400">Try adjusting your search or submit new feedback</p>
                  </div>
                ) : (
                  filteredHistory.map((entry) => (
                    <HistoryRow
                      key={entry._id}
                      entry={{
                        id: entry._id,
                        station: entry.stationId?.name,
                        comment: entry.comment,
                        cleanliness:   entry.ratings?.cleanliness,
                        safety:        entry.ratings?.safety,
                        accessibility: entry.ratings?.accessibility,
                        crowding:      entry.ratings?.crowding,
                        overall:       entry.ratings?.overall,
                        date: new Date(entry.createdAt).toLocaleDateString(),
                      }}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;