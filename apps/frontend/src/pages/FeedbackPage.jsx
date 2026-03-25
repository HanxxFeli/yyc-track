import { useState, useEffect } from "react";
import { FiSearch, FiFileText } from "react-icons/fi";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import ErrorMessage from "../components/common/ErrorMessage";
import SuccessMessage from "../components/common/SuccessMessage";
import ScoreInput from "../components/feedback/ScoreInput";
import HistoryRow from "../components/feedback/HistoryRow";
import { useStations } from "../contexts/StationContext";

// Four rating categories that users can score
const SCORE_FIELDS = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "safety", label: "Safety" },
  { key: "accessibility", label: "Accessibility" },
  { key: "crowding", label: "Crowding" },
];

// Added backend feedback integration

// Backend API URL - change this for production
const API_URI = 'http://localhost:5000';

// Maximum character limit for feedback comments
const MAX_COMMENT = 1000;

// Validate score is a whole number between 1-5 (changed from 0-100)
const isValidScore = (val) => {
  const n = Number(val);
  return val !== "" && !isNaN(n) && Number.isInteger(n) && n >= 1 && n <= 5;
};

// Calculate average of 4 scores, returns null if any field is empty
const computeOverall = (scores) => {
  const vals = Object.values(scores);
  if (vals.some((v) => v === "")) return null; // Can't calculate average if any score is missing
  return Math.round(vals.reduce((sum, v) => sum + Number(v), 0) / vals.length); // Average and round
};

const FeedbackPage = () => {
  // Get stations from context (comes from backend API via StationContext)
  const { stations, loading: stationsLoading } = useStations();

  // Form state
  const [selectedStation, setSelectedStation] = useState(null); // Currently selected station object
  const [scores, setScores] = useState({ // Four category scores (1-5)
    cleanliness: "",
    safety: "",
    accessibility: "",
    crowding: "",
  });
  const [comment, setComment] = useState(""); // User's written feedback
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state during submit
  const [errorMsg, setErrorMsg] = useState(""); // Error message to display
  const [successMsg, setSuccessMsg] = useState(""); // Success message to display

  // History state
  const [history, setHistory] = useState([]); // User's past feedback submissions
  const [historyLoading, setHistoryLoading] = useState(true); // Loading state for history
  const [searchQuery, setSearchQuery] = useState(""); // Search filter for history

  // Calculate overall score (average of 4 categories)
  const overall = computeOverall(scores);
  
  // Helper function to update a single score field
  const setScore = (key) => (val) => setScores((prev) => ({ ...prev, [key]: val }));

  // Set default selected station once stations load from context
  useEffect(() => {
    if (stations.length > 0 && !selectedStation) {
      setSelectedStation(stations[0]); // Select first station by default
    }
  }, [stations]); // Run when stations array changes

  // Fetch user's feedback history from backend
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URI}/api/feedback/mine`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Send JWT token for auth
        },
      });
      if (!res.ok) throw new Error("Failed to fetch feedback history");
      const data = await res.json();
      setHistory(data.feedback); // Update history state with user's feedback
    } catch (err) {
      console.error("fetchHistory error:", err);
    } finally {
      setHistoryLoading(false); // Stop loading spinner
    }
  };

  // Fetch history on component mount
  useEffect(() => {
    fetchHistory();
  }, []); // Empty dependency array = run once on mount

  // Handle form submission
  const handleSubmit = async () => {
    setErrorMsg(""); // Clear previous errors
    setSuccessMsg(""); // Clear previous success messages

    // Validation: ensure station is selected
    if (!selectedStation) {
      setErrorMsg("Please select a station.");
      return;
    }

    // Validation: ensure all scores are valid (1-5 whole numbers)
    const invalidScores = SCORE_FIELDS.filter(({ key }) => !isValidScore(scores[key]));
    if (invalidScores.length) {
      setErrorMsg("Please ensure all category scores are whole numbers between 1 and 5.");
      return;
    }

    // Validation: check comment length
    if (comment.length > MAX_COMMENT) {
      setErrorMsg(`Your comment exceeds the ${MAX_COMMENT}-character limit.`);
      return;
    }

    setIsSubmitting(true); // Show loading state on button

    try {
      // POST request to backend API
      const res = await fetch(`${API_URI}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // JWT token
        },
        body: JSON.stringify({
          stationId: selectedStation._id, // MongoDB station ID
          ratings: { // Send all ratings
            safety: Number(scores.safety),
            cleanliness: Number(scores.cleanliness),
            accessibility: Number(scores.accessibility),
            crowding: Number(scores.crowding),
            overall: overall ?? 1, // Use calculated overall or default to 1
          },
          comment, // User's text feedback
        }),
      });

      const data = await res.json();

      // Handle error response from backend
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit feedback.");
        return;
      }

      // Refresh history to show newly submitted feedback
      await fetchHistory();
      
      // Check if Azure Content Safety flagged the content
      if (data.notice) {
        setErrorMsg(data.notice); // Show moderation notice
      } else {
        setSuccessMsg("Your feedback has been submitted successfully!");
        setTimeout(() => setSuccessMsg(""), 4000); // Clear success message after 4 seconds
      }
      
      // Reset form after successful submission
      setScores({ cleanliness: "", safety: "", accessibility: "", crowding: "" });
      setComment("");
      
    } catch (err) {
      console.error("handleSubmit error:", err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false); // Stop loading state
    }
  };

  // Clear all form fields
  const handleClear = () => {
    setScores({ cleanliness: "", safety: "", accessibility: "", crowding: "" });
    setComment("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  // Delete a feedback entry from history
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URI}/api/feedback/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // JWT token
        },
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Delete failed:", data.error);
        return;
      }

      // Remove deleted entry from local state (optimistic update)
      setHistory((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("handleDelete error:", err);
    }
  };

  // Filter history based on search query (searches station name)
  const filteredHistory = history.filter((f) =>
    f.stationId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50"> {/* Full page container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10"> {/* Responsive container */}

        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Station Feedback</h1>
          <p className="text-sm sm:text-base text-gray-600">Share your experience and help improve Calgary Transit</p>
        </div>

        <div className="space-y-6 sm:space-y-8"> {/* Vertical spacing between sections */}

          {/* FEEDBACK FORM SECTION */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 lg:p-8"> {/* Responsive padding */}

              {/* Form title */}
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Share Your Feedback</h2>
                <p className="text-sm text-gray-500">Rate and review a CTrain station</p>
              </div>

              {/* Grid layout: 2 columns on xl screens, stacks on smaller screens */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

                {/* Left side: Form inputs (takes 2 cols on xl) */}
                <div className="xl:col-span-2 space-y-6">

                  {/* Station dropdown - populated from StationContext */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Station
                    </label>
                    {stationsLoading ? ( // Show loading text while stations are being fetched
                      <div className="text-sm text-gray-400">Loading stations...</div>
                    ) : (
                      <select
                        value={selectedStation?._id || ""} // Controlled select with station ID
                        onChange={(e) => {
                          const station = stations.find((s) => s._id === e.target.value); // Find station object by ID
                          setSelectedStation(station); // Update selected station
                        }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#BC0B2A] focus:border-transparent transition"
                      >
                        {stations.map((s) => ( // Map through all stations from context
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Score inputs - 4 categories (1-5 scale) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Rate Each Category (1-5)
                    </label>
                    {/* Grid: 2 cols on mobile, 4 cols on desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {SCORE_FIELDS.map(({ key, label }) => (
                        <ScoreInput
                          key={key}
                          label={label}
                          value={scores[key]} // Current score value
                          onChange={setScore(key)} // Update specific score
                          invalid={scores[key] !== "" && !isValidScore(scores[key])} // Show error if invalid
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
                    {/* Character counter - turns red if over limit */}
                    <div className={`text-right text-xs mt-1.5 ${comment.length > MAX_COMMENT ? "text-red-500 font-medium" : "text-gray-500"}`}>
                      {comment.length} / {MAX_COMMENT}
                    </div>
                  </div>

                  {/* Action buttons - Submit and Clear */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="flex-1 sm:flex-initial sm:w-44">
                      <PrimaryButton
                        onClick={handleSubmit}
                        isLoading={isSubmitting} // Shows spinner during submit
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

                {/* Right side: Overall score display (takes 1 col on xl) */}
                <div className="xl:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
                    {/* Overall CFI Score - calculated average */}
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600 mb-2">Overall CFI Score</p>
                      <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-1">
                        {overall !== null ? overall : "—"} {/* Show dash if no scores entered */}
                      </div>
                      <p className="text-xs text-gray-500">out of 5</p>
                    </div>
                    {/* Divider if there are messages */}
                    {(errorMsg || successMsg) && <div className="border-t border-gray-300" />}
                    {/* Error and success messages */}
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

              {/* Header with search */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Feedback History</h2>
                  <p className="text-sm text-gray-500">View and manage your submissions</p>
                </div>
                {/* Search input with icon */}
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

              {/* Desktop table headers (hidden on mobile) */}
              <div className="hidden lg:grid lg:grid-cols-[2fr_3fr_1fr_100px] gap-4 px-4 pb-3 mb-4 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Station</span>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Feedback</span>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</span>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</span>
              </div>

              {/* History rows */}
              <div className="space-y-3 lg:space-y-2">
                {historyLoading ? ( // Show loading state
                  <div className="text-center py-12 text-sm text-gray-400">Loading history...</div>
                ) : filteredHistory.length === 0 ? ( // Show empty state if no results
                  <div className="text-center py-12">
                    <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 mb-1">No feedback found</p>
                    <p className="text-xs text-gray-400">Try adjusting your search or submit new feedback</p>
                  </div>
                ) : ( // Map through filtered history and display rows
                  filteredHistory.map((entry) => (
                    <HistoryRow
                      key={entry._id} // Unique key for each row
                      entry={{
                        id: entry._id,
                        station: entry.stationId?.name, // Station name from populated field
                        comment: entry.comment,
                        cleanliness: entry.ratings?.cleanliness,
                        safety: entry.ratings?.safety,
                        accessibility: entry.ratings?.accessibility,
                        crowding: entry.ratings?.crowding,
                        overall: entry.ratings?.overall,
                        date: new Date(entry.createdAt).toLocaleDateString(), // Format timestamp
                      }}
                      onDelete={handleDelete} // Pass delete handler
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