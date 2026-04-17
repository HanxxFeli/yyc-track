import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";

/**
 * Error Page Component - 404 Not Found
 * 
 * Displays when user navigates to a non-existent route (e.g., /random-page-that-doesnt-exist)
 * Provides two options:
 * 1. Go back to home page
 * 2. Try refreshing the current page
 * 
 * This is the catch-all route in App.jsx (path="*")
 */
const ErrorPage = () => {
  // Navigate back to home page (hard reload, clears all state)
  const handleBackToHome = () => {
    window.location.href = "/"; // Full page navigation to root
  };

  // Refresh the current page (attempt to reload in case of temporary error)
  const handleTryAgain = () => {
    window.location.reload(); // Full page reload
  };

  return (
    <div className="flex items-center justify-center py-20"> {/* Centered container with vertical padding */}
      <div className="text-center max-w-md w-full"> {/* Content container with max width */}
        
        {/* Error heading - large and bold */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        {/* Error description - explains what happened */}
        <p className="text-gray-600 mb-8 text-base">
          The page you're looking for does not exist or has been removed.
        </p>

        {/* Action buttons - two options for user */}
        <div className="flex gap-3 justify-center"> {/* Horizontal flex layout with gap */}
          {/* Back to Home button - primary action */}
          <div className="w-40"> {/* Fixed width for consistent button sizing */}
            <PrimaryButton onClick={handleBackToHome}>
              Back to Home
            </PrimaryButton>
          </div>
          {/* Try Again button - secondary action (reload page) */}
          <div className="w-40"> {/* Fixed width for consistent button sizing */}
            <SecondaryButton onClick={handleTryAgain}>
              Try Again
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;