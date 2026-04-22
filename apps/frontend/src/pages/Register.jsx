import { useState } from "react";
import InputField from "../components/common/InputField";
import PasswordField from "../components/common/PasswordField";
import PasswordRequirements from "../components/password/PasswordRequirements";
import CheckboxField from "../components/common/CheckboxField";
import SubmitButton from "../components/buttons/SubmitButton";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import SuccessMessage from "../components/common/SuccessMessage";
import { useAuth } from "../contexts/AuthContext"; // Authentication context for register function
import { useNavigate } from "react-router-dom"; // For redirecting after registration

/**
 * Register Page Component
 *
 * Main registration page that handles:
 * - Form state management
 * - Input validation (client-side)
 * - Form submission to backend
 * - Success/error states
 * - Redirect to email verification
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
  // Main form data state - stores all input values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    postalCode: "",
    agreeToTerms: false, // Checkbox state
  });

  const [errors, setErrors] = useState({}); // Object to store error messages for each field
  const [isLoading, setIsLoading] = useState(false); // Loading state during API call
  const [success, setSuccess] = useState(false); // Success state to show success message

  // Get register function from AuthContext
  const { register, user } = useAuth(); // register function handles API call to backend
  const navigate = useNavigate(); // React Router navigation

  if (user){
    navigate('/home') // If user is already logged in, redirect to home page
  }

  // Handle all input changes (both text inputs and checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Use checked for checkbox, value for text
    }));

    // Clear error for this field when user starts typing (instant feedback)
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate all form fields before submission
  const validate = () => {
    const newErrors = {}; // Object to collect all validation errors

    // Validate first name - cannot be empty or only whitespace
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Validate last name - cannot be empty or only whitespace
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Validate email - required and must match email format
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) { // Basic email regex
      newErrors.email = "Email is invalid";
    }

    // Validate password - check all requirements
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      // Check minimum length (7 characters)
      if (formData.password.length < 7) {
        newErrors.password = "Password must be at least 7 characters";
      } 
      // Check for lowercase letter
      else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain a lowercase letter";
      } 
      // Check for uppercase letter
      else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain an uppercase letter";
      } 
      // Check for special character (anything that's not alphanumeric)
      else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain a special character";
      }
    }

    // Validate confirm password - must match password field
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate postal code - cannot be empty
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    // Validate terms agreement - must be checked
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    return newErrors; // Return object with all errors (empty if no errors)
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    
    // Run validation and check if there are any errors
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set errors to display them
      return; // Stop submission if validation fails
    }

    setIsLoading(true); // Show loading state on submit button
    
    // Prepare data to send to backend (don't send confirmPassword or agreeToTerms)
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      postalCode: formData.postalCode
    };

    // Call register function from AuthContext (makes API call to backend)
    const result = await register(registrationData);

    if (result.success) {
      // Registration successful
      setSuccess(true); // Show success message
      
      // Redirect to email verification page after 1.5 seconds
      setTimeout(() => {
        navigate('/verify-email', { 
          state: { email: formData.email } // Pass email to verification page
        });
      }, 1500);
    } else {
      // Registration failed - show error from backend
      setErrors({ submit: result.message || 'Registration failed. Please try again.' });
      setIsLoading(false); // Stop loading state
    }
  };

  // Handle Google OAuth sign-in
  const handleGoogleSignIn = (e) => {
    e.preventDefault(); // Prevent default button behavior
    console.log('Google sign-in clicked');
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 py-6 sm:py-10"> {/* Full screen centered layout */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm sm:max-w-md p-5 sm:p-6 lg:p-8"> {/* Registration card */}
        
        {/* Page header - responsive text sizes */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            Create an account
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Sign up to access real-time station feedback and alerts.
          </p>
        </div>

        {/* Success message - only shown after successful registration */}
        {success && <SuccessMessage message="Account created successfully!" />}

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          
          {/* First and Last Name row - stack on very small screens, side-by-side on larger */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-4">
            {/* First Name input */}
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
                  errors.firstName ? "border-red-500" : "border-gray-300" // Red border if error
                }`}
              />
              {/* Show error message if exists */}
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            {/* Last Name input */}
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
                  errors.lastName ? "border-red-500" : "border-gray-300" // Red border if error
                }`}
              />
              {/* Show error message if exists */}
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email input - using reusable InputField component */}
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder=""
          />

          {/* Password input - using reusable PasswordField component (has show/hide toggle) */}
          <PasswordField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder=""
          />

          {/* Password requirements checklist - shows which requirements are met */}
          <PasswordRequirements
            password={formData.password}
            hasError={!!errors.password} // Pass true if there's a password error
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

          {/* Submit button - shows loading state during API call */}
          <SubmitButton isLoading={isLoading}>
            Create Account
          </SubmitButton>

          {/* Divider between form and OAuth */}
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