/**
 * FeedbackSubmitForm Component
 *
 * Shows the feedback submission form if the user is logged in.
 * Shows a red CTA banner prompting signup/login if not.
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useStations } from "../../contexts/StationContext";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import ErrorMessage from "../common/ErrorMessage";
import SuccessMessage from "../common/SuccessMessage";
import ScoreInput from "../feedback/ScoreInput";

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

export default function FeedbackSubmitForm({
  stationId,
  stationName,
  scores,
  comment,
  isSubmitting,
  errorMsg,
  successMsg,
  onScoreChange,
  onCommentChange,
  onSubmit,
  onClear,
}) {
  const { user } = useAuth();
  const { refreshStations } = useStations();
  const navigate = useNavigate();
  const overall = computeOverall(scores);

  // Not logged in — show CTA
  if (!user) {
    return (
      <div className="rounded-xl bg-[#BC0B2A] px-8 py-10 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">
          Want to share your experience?
        </h2>
        <p className="text-sm text-red-100">
          Join the community and help improve Calgary Transit by submitting
          feedback for {stationName}.
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
    );
  }

  // Logged in — show form
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            Submit Your Feedback
          </h2>
          <p className="text-sm text-gray-500">
            Rate your experience at {stationName}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2 space-y-6">
            {/* Score inputs */}
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
                    onChange={onScoreChange(key)}
                    invalid={scores[key] !== "" && !isValidScore(scores[key])}
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => onCommentChange(e.target.value)}
                rows={5}
                placeholder="Describe your experience at this station..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#BC0B2A] focus:border-transparent transition"
              />
              <div
                className={`text-right text-xs mt-1.5 ${comment.length > MAX_COMMENT ? "text-red-500 font-medium" : "text-gray-500"}`}>
                {comment.length} / {MAX_COMMENT}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex-1 sm:flex-initial sm:w-44">
                <PrimaryButton
                  onClick={onSubmit}
                  isLoading={isSubmitting}
                  loadingText="Submitting...">
                  Submit Feedback
                </PrimaryButton>
              </div>
              <div className="flex-1 sm:flex-initial sm:w-32">
                <SecondaryButton onClick={onClear} disabled={isSubmitting}>
                  Clear
                </SecondaryButton>
              </div>
            </div>
          </div>

          {/* Overall score + messages */}
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
  );
}
