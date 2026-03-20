import { Link } from "react-router-dom";

/**
 * Account Deleted Confirmation Page
 *
 * Shown after the user successfully deletes their account.
 * Contains:
 * - Confirmation message
 * - Button to return to homepage
 */

const AccountDeleted = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F6F7] px-4 sm:px-6 py-8">

      {/* Content card - centered and responsive */}
      <div className="max-w-md w-full text-center">
        
        {/* title - responsive text size */}
        <h1 className="text-xl sm:text-2xl font-semibold mb-3">
          Your account has been deleted
        </h1>

        {/* description - responsive text */}
        <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
          Your account and all related data have been permanently removed.
          We're sorry to see you go.
        </p>

        {/* back to home - full width on mobile, auto on desktop */}
        <Link
          to="/"
          className="
            inline-block
            w-full sm:w-auto
            px-6 py-2.5
            bg-[#BC0B2A] 
            text-white 
            rounded-md 
            text-sm 
            font-medium
            hover:bg-[#A30A26] 
            transition
          "
        >
          Return to Homepage
        </Link>
      </div>

    </div>
  );
};

export default AccountDeleted;