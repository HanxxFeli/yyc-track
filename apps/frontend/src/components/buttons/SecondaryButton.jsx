const SecondaryButton = ({ onClick, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-white border border-gray-300 text-gray-600 py-3 rounded font-medium hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
    >
      {children}
    </button>
  );
};

export default SecondaryButton;