import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo-white.png";
import profileIcon from "../../assets/profile-icon.png";
import { useAuth } from '../../contexts/AuthContext'; 

/**
 * Header Component
 * 
 * A reusable navigation header that displays:
 * - Logo 
 * - Navigation links
 * - Feedback links (only visible when logged in)
 * - Login button when logged out, OR profile icon with dropdown menu when logged in.
 * - Dropdown includes Account Settings + Logout (for now)
 * - Dropdown auto-closes when clicking outside
 * - Animated arrow indicator rotates when menu is open
 * - Mobile hamburger menu for responsive navigation
 * 
 * Props:
 * - isLoggedIn (boolean): determines which UI to display.
 * 
 * Notes:
 * - Logout currently clears localStorage token and refreshes the page
 * - Authentication logic will be replaced once backend is integrated
 */

const Header = () => {
  const { user, logout } = useAuth(); // Get user and logout from context
  const isLoggedIn = !!user; // Derive isLoggedIn from user, double boolean

  // State to track if the dropdown is open
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // State to track if mobile menu is open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ref to detect clicks outside the dropdown container
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('.mobile-menu-button')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [window.location.pathname]);

  // Handle logout 
  const handleLogout = () => {
    logout(); // Use logout from authcontext and this will clear token and navigate to /login 
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    // Main header container with responsive padding
    <header className="w-full bg-[#BC0B2A] text-white px-4 sm:px-6 lg:px-10 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">

        {/* Left side of Header (logo) */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition">
          <img
            src={logo}
            alt="YYCTrack Logo"
            className="h-10 sm:h-12 lg:h-14 object-contain"
          />
        </Link>

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-10 text-[15px] font-medium">

          <NavLink
            to="/"
            className={({ isActive }) => 
            `hover:opacity-80 transition ${
              isActive ? "underline underline-offset-4" : ""
            }`
          }
          >
            Home
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) => 
            `hover:opacity-80 transition ${
              isActive ? "underline underline-offset-4" : ""
            }`
          }
          >
            Map
          </NavLink>

          <NavLink
            to="/stations"
            className={({ isActive }) => 
            `hover:opacity-80 transition ${
              isActive ? "underline underline-offset-4" : ""
            }`
          }
          >
            Stations
          </NavLink>

          {/* Feedback link - only visible when logged in */}
          {isLoggedIn && (
            <NavLink
              to="/feedback"
              className={({ isActive }) => 
                `hover:opacity-80 transition ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              Feedback
            </NavLink>
          )}

          {/* Desktop: Login or Profile */}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="px-4 py-2 rounded-md border border-white/70 hover:bg-white hover:text-[#BC0B2A] transition"
            >
              Login
            </Link>
          ) : (
            // Logged in: profile icon + dropdown
            <div className="relative" ref={dropdownRef}>
              {/* Profile icon button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {/* Profile Picture if exists else Profile Icon */}
                <img
                  src={user.profilePicture || profileIcon}
                  className="w-9 h-9 rounded-full hover:opacity-80 transition"
                  referrerPolicy="no-referrer"
                  alt="Profile"
                />

                {/* Dropdown Arrow */}
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

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-lg shadow-lg p-2 z-50 border border-gray-200">
                  
                  {/* User name */}
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  {/* Account Settings Link */}
                  <Link
                    to="/account-settings"
                    className="block px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                  >
                    Account Settings
                  </Link>

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout} 
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}  
            </div>
          )}
        </nav>

        {/* Mobile Menu Button - visible only on mobile/tablet */}
        <div className="flex items-center gap-3 lg:hidden">
          
          {/* Profile icon on mobile when logged in */}
          {isLoggedIn && (
            <img
              src={user.profilePicture || profileIcon}
              className="w-8 h-8 rounded-full"
              referrerPolicy="no-referrer"
              alt="Profile"
            />
          )}

          {/* Hamburger button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="mobile-menu-button p-2 hover:bg-white/10 rounded-md transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              // X icon when menu is open
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="absolute top-full left-0 right-0 bg-[#BC0B2A] border-t border-white/20 shadow-lg lg:hidden"
          >
            <nav className="flex flex-col p-4 space-y-1">
              
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `px-4 py-3 rounded-md hover:bg-white/10 transition ${
                    isActive ? "bg-white/20 font-semibold" : ""
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/map"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `px-4 py-3 rounded-md hover:bg-white/10 transition ${
                    isActive ? "bg-white/20 font-semibold" : ""
                  }`
                }
              >
                Map
              </NavLink>

              <NavLink
                to="/stations"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `px-4 py-3 rounded-md hover:bg-white/10 transition ${
                    isActive ? "bg-white/20 font-semibold" : ""
                  }`
                }
              >
                Stations
              </NavLink>

              {/* Feedback link - only when logged in */}
              {isLoggedIn && (
                <NavLink
                  to="/feedback"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `px-4 py-3 rounded-md hover:bg-white/10 transition ${
                      isActive ? "bg-white/20 font-semibold" : ""
                    }`
                  }
                >
                  Feedback
                </NavLink>
              )}

              {/* Divider when logged in */}
              {isLoggedIn && <div className="border-t border-white/20 my-2" />}

              {/* Mobile: Login or Account options */}
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-md border border-white/70 hover:bg-white hover:text-[#BC0B2A] transition text-center font-medium"
                >
                  Login
                </Link>
              ) : (
                <>
                  {/* User info section */}
                  <div className="px-4 py-2 text-sm">
                    <p className="font-semibold">{user.firstName} {user.lastName}</p>
                    <p className="text-white/70 text-xs truncate">{user.email}</p>
                  </div>

                  {/* Account Settings */}
                  <Link
                    to="/account-settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-md hover:bg-white/10 transition"
                  >
                    Account Settings
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-md hover:bg-white/10 transition text-red-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;