import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VerifyEmailForm from '../components/auth/VerifyEmailForm';

/**
 * VerifyEmail Page Component
 *
 * Page wrapper for email verification
 * Handles API calls and state management
 */
const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // email verification from authcontext
  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state
  const email = location.state?.email;

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  // Handle verification
  const handleVerify = async (code) => {
    setError('');
    setIsLoading(true);

    const result = await verifyEmail(code);

    if (result.success) {
      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError(result.message || 'Invalid or expired verification code');
    }

    setIsLoading(false);
  };

  // Handle resend
  const handleResend = async () => {
    setError('');
    setIsResending(true);

    const result = await resendVerification();

    if (result.success) {
      setError(''); // Clear any previous errors
      alert('Verification code sent! Check your email.');
    } else {
      setError(result.message || 'Failed to resend code');
    }

    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <VerifyEmailForm
        onVerify={handleVerify}
        onResend={handleResend}
        isLoading={isLoading}
        isResending={isResending}
        error={error}
        success={success}
        onErrorChange={setError}
      />
    </div>
  );
};

export default VerifyEmail;
