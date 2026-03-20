import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";

/**
 * displays when user navigates to a non-existent route
 * provides options to go back home or try again
 */
const ErrorPage = () => {
  // Navigate back to home page
  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // Refresh the current page
  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md w-full">
        {/* Error heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        {/* Error description */}
        <p className="text-gray-600 mb-8 text-base">
          The page you're looking for does not exist or has been removed.
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          <div className="w-40">
            <PrimaryButton onClick={handleBackToHome}>
              Back to Home
            </PrimaryButton>
          </div>
          <div className="w-40">
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
