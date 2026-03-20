import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from '../../contexts/AuthContext';
import logo from "../../assets/AdminLogo.svg";
import profileIcon from "../../assets/profile-icon.png";

/**
 * AdminHeader Component
 * 
 * Admin-only navigation header:
 * - Logo (links to admin dashboard)
 * - Admin nav links: Home, Stations, Feedback, Analytics
 * - Profile icon + dropdown:
 *  - Logout will clear admin token and return to admin login
 */
export default function AdminHeader() {

  const {logout} = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdminLogout = () => {
    logout(); // use logout from AdminAuthContext and this will clear token and navigate to /admin/login
    setIsDropdownOpen(false);
    navigate("/admin/login");
  };

  return (
    <header className="w-full bg-[#9A0923] text-white px-10 py-3 flex items-center justify-between shadow-md">
      {/* Left: Logo */}
      <Link to="/admin/dashboard" className="flex items-center gap-3 hover:opacity-90 transition">
        <img src={logo} alt="YYCTrack Logo" className="h-14 object-contain" />
      </Link>

      {/* Right: Nav */}
      <nav className="flex items-center gap-10 text-[15px] font-medium">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `hover:opacity-80 transition ${isActive ? "underline underline-offset-4" : ""}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/admin/stations"
          className={({ isActive }) =>
            `hover:opacity-80 transition ${isActive ? "underline underline-offset-4" : ""}`
          }
        >
          Stations
        </NavLink>

        <NavLink
          to="/admin/feedback"
          className={({ isActive }) =>
            `hover:opacity-80 transition ${isActive ? "underline underline-offset-4" : ""}`
          }
        >
          Feedback
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            `hover:opacity-80 transition ${isActive ? "underline underline-offset-4" : ""}`
          }
        >
          Analytics
        </NavLink>

        {/* Profile icon + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={profileIcon}
              className="w-9 h-9 rounded-full hover:opacity-80 transition"
              alt="Admin Profile"
            />
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white text-black rounded-lg shadow-lg p-2 z-50 border border-gray-200">
              <Link
                to="/admin/settings"
                className="block px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                onClick={() => setIsDropdownOpen(false)}
              >
                Admin Settings
              </Link>

              <button
                type="button"
                onClick={handleAdminLogout}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}