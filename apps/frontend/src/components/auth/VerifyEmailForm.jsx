import { useState, useRef } from "react";
import CodeInput from "../common/CodeInput";
import PrimaryButton from "../buttons/PrimaryButton"
import SecondaryButton from "../buttons/SecondaryButton"
import ErrorMessage from "../common/ErrorMessage";
import SuccessMessage from "../common/SuccessMessage";
import LinkButton from "../buttons/LinkButton";

/**
 * Complete email verification form with 6-digit code input
 * Handles code entry, verification, and resend functionality
 */
const VerifyEmailForm = ({
  onVerify,
  onResend,
  isLoading = false,
  isResending = false,
  error = "",
  success = false,
  onErrorChange,
}) => {
  // State for 6-digit code (array of digits)
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  // Refs for each input to manage focus
  const inputRefs = useRef([]);

  // Initialize refs array
  if (inputRefs.current.length !== 6) {
    inputRefs.current = Array(6)
      .fill()
      .map((_, i) => inputRefs.current[i] || null);
  }

  // Handle digit input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    // Update code array
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Clear error when typing
    if (onErrorChange) {
      onErrorChange("");
    }

    // Auto-focus next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace/delete key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      if (!code[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle verify button click
  const handleVerify = () => {
    const fullCode = code.join("");

    // Check if all digits entered
    if (fullCode.length !== 6) {
      if (onErrorChange) {
        onErrorChange("Please enter all 6 digits");
      }
      return;
    }

    // Call parent verify function
    onVerify(fullCode);
  };

  // Handle resend button click
  const handleResendClick = () => {
    // Clear code inputs
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    // Call parent resend function
    onResend();
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-600">
            Enter the six digit code we sent to your email address to verify
            your account.
          </p>
        </div>

        {/* Success message */}
        {success && (
          <SuccessMessage
            message="Email verified successfully! Redirecting..."
            className="mb-4"
          />
        )}

        {/* Code inputs */}
        <div className="flex justify-between gap-2 mb-6">
          {code.map((digit, index) => (
            <CodeInput
              key={index}
              value={digit}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              index={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>

        {/* Verify button */}
        <div className="mb-3">
          <PrimaryButton
            isLoading={isLoading}
            onClick={handleVerify}
            disabled={code.join("").length !== 6}
            loadingText="Verifying..."
          >
            Verify Code
          </PrimaryButton>
        </div>

        {/* Resend button */}
        <div className="mb-6">
          <SecondaryButton onClick={handleResendClick} disabled={isResending}>
            Resend Code
          </SecondaryButton>
        </div>

        {/* Back to Login link */}
        <div className="text-center">
          <LinkButton href="/login">Back to Login</LinkButton>
        </div>
      </div>

      {/* Error message - displayed outside card below */}
      <ErrorMessage message={error} className="mt-6" />
    </div>
  );
};

export default VerifyEmailForm;
