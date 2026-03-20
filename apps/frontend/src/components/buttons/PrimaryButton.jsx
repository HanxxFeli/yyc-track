/**
 * Primary action button with loading state
 */

const PrimaryButton = ({ isLoading, onClick, disabled, children, loadingText }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full bg-[#BC0B2A] text-white py-3 rounded font-medium hover:bg-[#9a0922] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
    >
      {isLoading ? (loadingText || 'Loading...') : children}
    </button>
  );
};

export default PrimaryButton;