// Error message box with warning icon

const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`w-full max-w-md p-4 bg-red-50 border-2 border-[#BC0B2A] rounded-lg flex items-start gap-3 ${className}`}>
      <div className="flex-shrink-0 mt-0.5">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#BC0B2A]">
          <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
        </svg>
      </div>
      <p className="text-sm text-gray-700 flex-1">
        {message}
      </p>
    </div>
  );
};

export default ErrorMessage;