/**
 * StationDetails Page
 *
 * Accessed via: /stations/:stationId
 *
 * Shows:
 * - Station name + line + CEI score
 * - All public feedback for that station
 * - Feedback submission form (same flow as FeedbackPage)
 */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import ErrorMessage from "../components/common/ErrorMessage";
import SuccessMessage from "../components/common/SuccessMessage";
import ScoreInput from "../components/feedback/ScoreInput";
import FeedbackCard from "../components/feedback/FeedBackCard";

const API_URL = "http://localhost:5000";

const SCORE_FIELDS = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "safety", label: "Safety" },
  { key: "accessibility", label: "Accessibility" },
  { key: "crowding", label: "Crowding" },
];

const MAX_COMMENT = 1000;

const isValidScore = (val) => {
  const n = Number(val);
  return val !== "" && !isNaN(n) && Number.isInteger(n) && n >= 1 && n <= 5;
};

const computeOverall = (scores) => {
  const vals = Object.values(scores);
  if (vals.some((v) => v === "")) return null;
  return Math.round(vals.reduce((sum, v) => sum + Number(v), 0) / vals.length);
};

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function StationDetails() {
  const { stationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log(stationId);
  // Station data
  const [station, setStation] = useState(null);
  const [stationLoading, setStationLoading] = useState(true);
  const [stationError, setStationError] = useState(null);

  // Feedback list
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  // Submission form
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

  const overall = computeOverall(scores);
  const setScore = (key) => (val) =>
    setScores((prev) => ({ ...prev, [key]: val }));

  // Fetch station details
  useEffect(() => {
    const fetchStation = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stations/${stationId}`);
        if (!res.ok) throw new Error("Station not found.");
        const data = await res.json();
        setStation(data);
      } catch (err) {
        console.error("fetchStation error:", err);
        setStationError(err.message);
      } finally {
        setStationLoading(false);
      }
    };

    fetchStation();
  }, [stationId]);

  // Fetch feedback for this station
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_URL}/api/feedback/station/${stationId}`);
        if (!res.ok) throw new Error("Failed to load feedback.");
        const data = await res.json();
        setFeedback(data.results);
      } catch (err) {
        console.error("fetchFeedback error:", err);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchFeedback();
  }, [stationId]);

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const invalidScores = SCORE_FIELDS.filter(
      ({ key }) => !isValidScore(scores[key]),
    );
    if (invalidScores.length) {
      setErrorMsg(
        "Please ensure all category scores are whole numbers between 1 and 5.",
      );
      return;
    }

    if (comment.length > MAX_COMMENT) {
      setErrorMsg(`Your comment exceeds the ${MAX_COMMENT}-character limit.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          stationId,
          ratings: {
            safety: Number(scores.safety),
            cleanliness: Number(scores.cleanliness),
            accessibility: Number(scores.accessibility),
            crowding: Number(scores.crowding),
            overall: overall ?? 1,
          },
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit feedback.");
        return;
      }

      // Only add to visible list if it wasn't flagged by Azure
      if (!data.notice) {
        setFeedback((prev) => [
          {
            _id: data.feedbackId,
            userId: { username: "You" },
            ratings: {
              safety: Number(scores.safety),
              cleanliness: Number(scores.cleanliness),
              accessibility: Number(scores.accessibility),
              crowding: Number(scores.crowding),
              overall: overall ?? 1,
            },
            comment,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      if (data.notice) {
        setErrorMsg(data.notice);
      } else {
        setSuccessMsg("Your feedback has been submitted successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }

      setScores({
        cleanliness: "",
        safety: "",
        accessibility: "",
        crowding: "",
      });
      setComment("");
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

  if (stationLoading) {
    return (
      <div className="max-w-6xl mx-auto py-10">
        <p className="text-sm text-gray-400">Loading station...</p>
      </div>
    );
  }

  if (stationError) {
    return (
      <div className="max-w-6xl mx-auto py-10">
        <p className="text-sm text-red-500">{stationError}</p>
      </div>
    );
  }

  const lineColor =
    station.line === "Red"
      ? "text-red-600"
      : station.line === "Blue"
        ? "text-blue-600"
        : "text-purple-600";

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      {/* Station Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">{station.name}</h1>
        <p className={`text-sm font-semibold ${lineColor}`}>
          {station.line === "Both" ? "Both Lines" : `${station.line} Line`}
        </p>
        {station.cei !== null && (
          <p className="text-sm text-gray-600">
            CEI Score:{" "}
            <span className="font-semibold text-gray-900">{station.cei}</span>
            <span className="text-gray-400"> / 100</span>
          </p>
        )}
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Community Feedback
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            What commuters are saying about {station.name}
          </p>
        </div>

        {feedbackLoading ? (
          <p className="text-sm text-gray-400">Loading feedback...</p>
        ) : feedback.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm px-6 py-12 text-center">
            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-1">No feedback yet</p>
            <p className="text-xs text-gray-400">
              Be the first to rate this station below
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((entry) => (
              <FeedbackCard key={entry._id} entry={entry} />
            ))}
          </div>
        )}
      </div>

      {/* Submit Feedback Form */}
      {/* Submit Feedback — conditional on auth */}
      {user ? (
        // Logged in — show the form exactly as before
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                Submit Your Feedback
              </h2>
              <p className="text-sm text-gray-500">
                Rate your experience at {station.name}
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              <div className="xl:col-span-2 space-y-6">
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
                        invalid={
                          scores[key] !== "" && !isValidScore(scores[key])
                        }
                      />
                    ))}
                  </div>
                </div>

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
                  <div
                    className={`text-right text-xs mt-1.5 ${comment.length > MAX_COMMENT ? "text-red-500 font-medium" : "text-gray-500"}`}>
                    {comment.length} / {MAX_COMMENT}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="flex-1 sm:flex-initial sm:w-44">
                    <PrimaryButton
                      onClick={handleSubmit}
                      isLoading={isSubmitting}
                      loadingText="Submitting...">
                      Submit Feedback
                    </PrimaryButton>
                  </div>
                  <div className="flex-1 sm:flex-initial sm:w-32">
                    <SecondaryButton
                      onClick={handleClear}
                      disabled={isSubmitting}>
                      Clear
                    </SecondaryButton>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Overall CFI Score
                    </p>
                    <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-1">
                      {overall !== null ? overall : "—"}
                    </div>
                    <p className="text-xs text-gray-500">out of 5</p>
                  </div>
                  {(errorMsg || successMsg) && (
                    <div className="border-t border-gray-300" />
                  )}
                  <div className="space-y-3">
                    <ErrorMessage message={errorMsg} />
                    <SuccessMessage message={successMsg} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Not logged in — CTA banner
        <div className="rounded-xl bg-[#BC0B2A] px-8 py-10 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">
            Want to share your experience?
          </h2>
          <p className="text-sm text-red-100">
            Join the community and help improve Calgary Transit by submitting
            feedback for {station.name}.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate("/register")}
              className="h-10 px-6 rounded-lg bg-white text-sm font-semibold text-[#BC0B2A] hover:bg-red-50 transition">
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="h-10 px-6 rounded-lg border border-white text-sm font-semibold text-white hover:bg-red-700 transition">
              Log In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
