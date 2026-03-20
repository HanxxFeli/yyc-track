import { useState } from 'react';

/**
 * Password input with a Show/Hide toggle button
 * Allows users to see their password while typing
 */
const PasswordField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  placeholder 
}) => {
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      {/* Password label */}
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="relative">
        {/* Password input that switches between password/text type */}
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-12 border rounded focus:outline-none focus:ring-1 focus:ring-[#BC0B2A] text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        
        {/* Show/Hide toggle button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#BC0B2A] transition text-xs font-medium"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {/* Error message display */}
      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordField;
