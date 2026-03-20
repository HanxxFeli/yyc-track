// Green success notification displayed after successful registration
// Error message box with warning icon

const SuccessMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`w-full max-w-md p-4 bg-green-50 border-2 border-green-600 rounded-lg flex items-start gap-3 ${className}`}>
      <div className="flex-shrink-0 mt-0.5">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green-600">
          <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z" fill="currentColor"/>
        </svg>
      </div>
      <p className="text-sm text-gray-700 flex-1">
        {message}
      </p>
    </div>
  );
};

export default SuccessMessage;