/**
 * StationDetails Page
 *
 * Route: /stations/:stationId
 *
 * Assembles:
 * - StationHeader   (name, line, back button, overall score circle)
 * - FeedbackList    (scrollable, with sort filter bar)
 * - FeedbackSubmitForm (form if logged in, CTA if not)
 *
 * All heavy UI and logic lives in the child components.
 * This page only owns:
 * - data fetching
 * - form state
 * - sort state
 */

import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useStations } from "../contexts/StationContext";
import StationHeader from "../components/station/StationHeader";
import FeedbackList from "../components/station/FeedbackList";
import FeedbackSubmitForm from "../components/station/FeedbackSubmitForm";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

const isValidScore = (val) => {
  const n = Number(val);
  return val !== "" && !isNaN(n) && Number.isInteger(n) && n >= 1 && n <= 5;
};

const computeOverall = (scores) => {
  const vals = Object.values(scores);
  if (vals.some((v) => v === "")) return null;
  const avg = vals.reduce((sum, v) => sum + Number(v), 0) / vals.length;

  return Number(avg.toFixed(2));
};

export default function StationDetails() {
  const { stationId } = useParams();
  const { refreshStations } = useStations();

  // Station
  const [station, setStation] = useState(null);
  const [stationLoading, setStationLoading] = useState(true);
  const [stationError, setStationError] = useState(null);

  // Feedback
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [sort, setSort] = useState("newest");

  // Form
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

  const fetchStation = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stations/${stationId}`);
      if (!res.ok) throw new Error("Station not found.");
      setStation(await res.json());
    } catch (err) {
      setStationError(err.message);
    } finally {
      setStationLoading(false);
    }
  };

  // Fetch station
  useEffect(() => {
    fetchStation();
  }, [stationId]);

  // Fetch feedback
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

  // Sort feedback client-side — no refetch needed
  const sortedFeedback = useMemo(() => {
    const copy = [...feedback];
    switch (sort) {
      case "oldest":
        return copy.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
      case "highest":
        return copy.sort(
          (a, b) => (b.ratings?.overall ?? 0) - (a.ratings?.overall ?? 0),
        );
      case "lowest":
        return copy.sort(
          (a, b) => (a.ratings?.overall ?? 0) - (b.ratings?.overall ?? 0),
        );
      case "newest":
      default:
        return copy.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }
  }, [feedback, sort]);

  const handleScoreChange = (key) => (val) =>
    setScores((prev) => ({ ...prev, [key]: val }));

  const handleClear = () => {
    setScores({ cleanliness: "", safety: "", accessibility: "", crowding: "" });
    setComment("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const invalid = [
      "cleanliness",
      "safety",
      "accessibility",
      "crowding",
    ].filter((k) => !isValidScore(scores[k]));
    if (invalid.length) {
      setErrorMsg(
        "Please ensure all category scores are whole numbers between 1 and 5.",
      );
      return;
    }
    if (comment.length > 1000) {
      setErrorMsg("Your comment exceeds the 1000-character limit.");
      return;
    }

    setIsSubmitting(true);
    try {
      const overall = computeOverall(scores);
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
        await fetchStation();
        refreshStations();
        setSuccessMsg("Your feedback has been submitted successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.notice);
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

  if (stationLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-400">Loading station...</p>
      </div>
    );
  }

  if (stationError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-red-500">{stationError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Station name, line, back button, overall circle */}
      <StationHeader station={station} />

      {/* Scrollable feedback list with sort filters */}
      <FeedbackList
        feedback={sortedFeedback}
        loading={feedbackLoading}
        sort={sort}
        onSort={setSort}
        stationName={station.name}
      />

      {/* Submit form or login CTA */}
      <FeedbackSubmitForm
        stationId={stationId}
        stationName={station.name}
        scores={scores}
        comment={comment}
        isSubmitting={isSubmitting}
        errorMsg={errorMsg}
        successMsg={successMsg}
        onScoreChange={handleScoreChange}
        onCommentChange={setComment}
        onSubmit={handleSubmit}
        onClear={handleClear}
      />
    </div>
  );
}
