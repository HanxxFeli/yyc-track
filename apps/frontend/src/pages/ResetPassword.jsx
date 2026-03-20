import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PasswordField from '../components/common/PasswordField';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  // Validate token exists
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid reset link');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 7) {
      setError('Password must be at least 7 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Failed to reset password. Please try again.');
    }

    setIsLoading(false);
  };

  if (!tokenValid) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
            Invalid Reset Link
          </h1>
          <p className="text-gray-600 text-center mb-6">
            This password reset link is invalid or has expired.
          </p>
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">
        
        {/* Title */}
        <h1 className="text-2xl font-bold mb-2 text-center">
          Reset Your Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>

        {success ? (
          // Success message
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-green-700 text-center mb-2 font-semibold">
              Password reset successful!
            </p>
            <p className="text-green-600 text-center text-sm">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          // Form
          <form onSubmit={handleSubmit}>
            
            {/* New Password */}
            <PasswordField
              label="New Password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              error=""
            />

            {/* Confirm Password */}
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              error=""
            />

            {/* Password Requirements */}
            <div className="mb-4 text-xs text-gray-600">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside mt-1">
                <li>At least 7 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One special character</li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#BC0B2A] text-white py-3 rounded-lg hover:bg-[#A30A26] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Back to Login */}
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