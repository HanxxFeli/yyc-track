import { Link } from "react-router-dom";
// import PrivacyPolicy from "../../pages/PrivacyPolicy";
// import TermsOfService from "../../pages/TermsOfService";
/**
 * Footer Component
 * 
 * A reusable footer that shows:
 * - Copyright
 * - Quick links to: Privacy Policy, Terms of Service, Contact
 * - Simple static footer for Phase 3
 * - Responsive design: stacks on mobile, inline on desktop
 * - No routing yet - future pages will be Privacy Policy, Terms of Service, Contact
 *    - Will be added later
 */

const Footer = () => {
  return (
    // Main footer container with responsive padding
    <footer className="w-full bg-gray-100 text-gray-700 py-6 sm:py-4 mt-auto border-t">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Footer content: stacks on mobile, side-by-side on desktop */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 text-sm">

          {/* Left side: copyright */}
          <p className="text-center sm:text-left">© 2025 YYC Track. All rights reserved.</p>

          {/* Right side: navigation links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <Link to="/privacy" className="hover:underline hover:text-[#BC0B2A] transition">
              Privacy Policy
            </Link>

            <span className="text-gray-400 hidden sm:inline">|</span>

            <Link to="/terms" className="hover:underline hover:text-[#BC0B2A] transition">
              Terms of Service
            </Link>

            <span className="text-gray-400 hidden sm:inline">|</span>

            <Link to="/contact" className="hover:underline hover:text-[#BC0B2A] transition">
              Contact 
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;