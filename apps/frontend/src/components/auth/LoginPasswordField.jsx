import { useState } from 'react';

/**
 * 
 * Password input with a Show/Hide toggle button
 * Allows users to see their password while typing
 * 
 * - label: The label text displayed above the input
 * - name: Input name attribute for form handling
 * - value: Current password value
 * - onChange: Function to handle input changes
 * - error: Error message to display (if any)
 */

const PasswordField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  placeholder 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BC0B2A] ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#BC0B2A] transition text-sm font-medium"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordField;