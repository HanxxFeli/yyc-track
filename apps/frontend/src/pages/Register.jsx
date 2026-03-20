import { useState } from "react";
import InputField from "../components/common/InputField";
import PasswordField from "../components/common/PasswordField";
import PasswordRequirements from "../components/password/PasswordRequirements";
import CheckboxField from "../components/common/CheckboxField";
import SubmitButton from "../components/buttons/SubmitButton";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import SuccessMessage from "../components/common/SuccessMessage";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Register Page Component
 *
 * Main registration page that handles:
 * - Form state management
 * - Input validation (client-side)
 * - Form submission
 * - Success/error states
 *
 * Form fields:
 * - First Name
 * - Last Name
 * - Email
 * - Password
 * - Confirm Password
 * - Postal Code
 * - Terms & Conditions checkbox
 */
const Register = () => {
  // Main form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    postalCode: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({}); // Error messages for each field
  const [isLoading, setIsLoading] = useState(false); // Loading state for submit button
  const [success, setSuccess] = useState(false); // Success state to show success message

  // registration related states
  const { register } = useAuth(); // use login from authcontext
  const navigate = useNavigate();

  // Handle all input changes (text inputs and checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate all form fields before submission
  const validate = () => {
    const newErrors = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Validate password (based on requirements)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 7) {
        newErrors.password = "Password must be at least 7 characters";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain a lowercase letter";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain an uppercase letter";
      } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain a special character";
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate postal code
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run validation for the fields
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // get data from the fields and create registration data payload for backend
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      postalCode: formData.postalCode
    };

    // Call register from context
    const result = await register(registrationData);

    if (result.success) {
      // Show success message briefly
      setSuccess(true);
      
      // Redirect to verify email after 1.5 seconds
      setTimeout(() => {
        navigate('/verify-email', { 
          state: { email: formData.email } 
        });
      }, 1500);
    } else {
      // Show error
      setErrors({ submit: result.message || 'Registration failed. Please try again.' });
      setIsLoading(false);
    }
  };

  // Handle Google sign-in 
  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    console.log('Google sign-in clicked');
    // Add Google OAuth logic here
    window.location.href = 'http://localhost:5000/api/auth/google'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 py-6 sm:py-10">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm sm:max-w-md p-5 sm:p-6 lg:p-8">
        {/* Page header - responsive text sizes */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            Create an account
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Sign up to access real-time station feedback and alerts.
          </p>
        </div>

        {/* Success message (shown after registration) */}
        {success && <SuccessMessage message="Account created successfully!" />}

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          {/* First and Last Name - stack on very small screens, row on larger */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#BC0B2A] text-sm ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#BC0B2A] text-sm ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email input */}
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder=""
          />

          {/* Password input */}
          <PasswordField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder=""
          />

          {/* Password requirements */}
          <PasswordRequirements
            password={formData.password}
            hasError={!!errors.password}
          />
          
          {/* Confirm password input */}
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder=""
          />

          {/* Postal Code input */}
          <InputField
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            error={errors.postalCode}
            placeholder=""
          />

          {/* Terms and conditions checkbox */}
          <CheckboxField
            label={
              <span className="text-xs sm:text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-[#BC0B2A] underline">
                  Terms and Conditions
                </a>
              </span>
            }
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            error={errors.agreeToTerms}
          />

          {/* Submit button */}
          <SubmitButton isLoading={isLoading}>
            Create Account
          </SubmitButton>

          {/* Divider */}
          <div className="my-4 text-center text-xs text-gray-500">or</div>

          {/* Google sign-in button */}
          <GoogleSignInButton onClick={handleGoogleSignIn} />
        </form>

        {/* Login link for existing users */}
        <div className="mt-5 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#BC0B2A] font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;