/**
 * 
 * Primary action button with loading state
 * Shows "Creating Account..." text when loading
 * Disables button during submission to prevent doubleclicks
 * 
 * - isLoading: Boolean indicating if form is being submitted
 * - children: Button text content
 * - onClick: Function to handle button clicks
 */

const SubmitButton = ({ isLoading, children, onClick }) => {
  return (
    <button
      type="submit" // important to add the submit type
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-[#BC0B2A] text-white py-3 rounded-lg font-medium hover:bg-[#9a0922] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Creating Account...' : children}
    </button>
  );
};

export default SubmitButton;