import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PasswordField from '../components/common/PasswordField';

/**
 * Reset Password Page Component
 * 
 * Handles password reset functionality when user clicks the link from their email
 * URL format: /reset-password/:token
 * 
 * Flow:
 * 1. User receives email with reset link containing token
 * 2. User clicks link and lands on this page
 * 3. User enters new password (must match requirements)
 * 4. Backend validates token and updates password
 * 5. User redirected to login page
 * 
 * Token validation:
 * - Token must exist in URL params
 * - Token must be valid (checked by backend)
 * - Token must not be expired (10 minutes from email send)
 */
const ResetPassword = () => {
  // Form state
  const [newPassword, setNewPassword] = useState(''); // New password input
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password input
  const [error, setError] = useState(''); // Error message to display
  const [success, setSuccess] = useState(false); // Success state after password reset
  const [isLoading, setIsLoading] = useState(false); // Loading state during API call
  const [tokenValid, setTokenValid] = useState(true); // Track if token is valid

  const { token } = useParams(); // Get reset token from URL (/reset-password/:token)
  const navigate = useNavigate(); // For redirecting to login after success

  // Validate token exists on component mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false); // No token in URL = invalid link
      setError('Invalid reset link');
    }
  }, [token]); // Run when token changes (only on mount in this case)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError(''); // Clear previous errors

    // Client-side validation: Check if both fields are filled
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Client-side validation: Passwords must match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Client-side validation: Minimum length check
    if (newPassword.length < 7) {
      setError('Password must be at least 7 characters');
      return;
    }

    setIsLoading(true); // Show loading state on button

    try {
      // API call to reset password endpoint
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'PUT', // PUT method to update password
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword }) // Send new password to backend
      });

      const data = await response.json();

      if (data.success) {
        // Password reset successful
        setSuccess(true); // Show success message
        
        // Redirect to login page after 1 second
        setTimeout(() => {
          navigate('/login'); // Navigate to login page
        }, 1000);
      } else {
        // Backend returned error (invalid token, expired, etc.)
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      // Network error or other unexpected error
      console.error('Reset password error:', err);
      setError('Failed to reset password. Please try again.');
    }

    setIsLoading(false); // Stop loading state
  };

  // Invalid token screen - shown if no token in URL
  if (!tokenValid) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          {/* Error heading */}
          <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
            Invalid Reset Link
          </h1>
          {/* Error explanation */}
          <p className="text-gray-600 text-center mb-6">
            This password reset link is invalid or has expired.
          </p>
          {/* Button to request new reset link */}
          <Link 
            to="/forgot-password"
            className="block w-full text-center bg-[#BC0B2A] text-white py-3 rounded-lg hover:bg-[#A30A26]"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  // Main reset password form
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">
        
        {/* Page title */}
        <h1 className="text-2xl font-bold mb-2 text-center">
          Reset Your Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>

        {success ? (
          // Success message - shown after password is reset successfully
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-green-700 text-center mb-2 font-semibold">
              Password reset successful!
            </p>
            <p className="text-green-600 text-center text-sm">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          // Password reset form
          <form onSubmit={handleSubmit}>
            
            {/* New Password field - reusable PasswordField component with show/hide toggle */}
            <PasswordField
              label="New Password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              error="" 
            />

            {/* Confirm Password field */}
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              error="" // Error handling done at form level
            />

            {/* Password requirements list - shown to user */}
            <div className="mb-4 text-xs text-gray-600">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside mt-1">
                <li>At least 7 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One special character</li>
              </ul>
            </div>

            {/* Error Message - shown if validation fails or API returns error */}
            {error && (
              <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button - disabled during loading */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#BC0B2A] text-white py-3 rounded-lg hover:bg-[#A30A26] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'} {/* Show loading text during API call */}
            </button>
          </form>
        )}

        {/* Back to Login link */}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-[#BC0B2A] text-sm font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;