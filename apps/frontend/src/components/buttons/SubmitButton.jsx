/**
 * SubmitButton Component
 * 
 * Primary action button with loading state
 * Shows "Creating Account..." text when loading
 * Disables button during submission to prevent double-clicks
 * 
 */
const SubmitButton = ({ isLoading, children, onClick }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-[#BC0B2A] text-white py-2.5 rounded font-medium hover:bg-[#9a0922] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
    >
      {/* Show different text based on loading state */}
      {isLoading ? 'Creating Account...' : children}
    </button>
  );
};

export default SubmitButton;
