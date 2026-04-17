import { useState } from "react";
import LoginInputField from "../components/auth/LoginInputField";
import LoginPasswordField from "../components/auth/LoginPasswordField";
import LoginSubmitButton from "../components/auth/LoginSubmitButton";
import { AiOutlineWarning } from "react-icons/ai";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // login related states
  const { login } = useAuth(); // use login from authcontext
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Call login from context
    const result = await login(email, password); // login uses email and password params

    if (result.success) {
      navigate('/home') // always go to dashboard after successful login
    } else {
      setError(result.message || 'Incorrect email or password.');
    } 

    setIsLoading(false);
  };

  // Handle Google sign-in 
  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    console.log('Google sign-in clicked');
    // Add Google OAuth logic here
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-6 sm:py-10 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md border">
        
        {/* Title - responsive text size */}
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">
          Login to your account
        </h1>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
          Access real-time station feedback and alerts.
        </p>

        <form onSubmit={handleLogin}>
          
          {/* Email */}
          <LoginInputField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            error={error ? " " : null} 
          />

          {/* Password */}
          <LoginPasswordField
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            error={error ? " " : null}
          />

          {/* Error Box - responsive text */}
          {error && (
            <div className="flex items-start gap-2 bg-red-100 text-red-700 border border-red-300 p-3 rounded mb-4">
              <AiOutlineWarning size={20} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* Remember / Forgot - stack on very small screens */}
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-gray-700 text-sm">Remember me</span>
            </label>

            <a href="/forgot-password" className="text-[#BC0B2A] text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <LoginSubmitButton isLoading={isLoading}>
            Login
          </LoginSubmitButton>

          {/* Divider */}
          <div className="my-4 text-center text-sm text-gray-500">or</div>

          {/* Google Login - responsive padding and text */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 border py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
            onClick={(e) => {
              e.preventDefault(); // prevent google button from submitting
              handleGoogleSignIn(e)
            }}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>

          {/* Register - responsive text */}
          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-[#BC0B2A] font-medium hover:underline">
              Register here
            </a>
          </p>

          {/*Admin*/}
          <p className="text-center mt-2 text-sm text-gray-600">
            Admin?{" "}
            <a href="/admin/login" className="text-[#BC0B2A] font-medium hover:underline">
              Log in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}