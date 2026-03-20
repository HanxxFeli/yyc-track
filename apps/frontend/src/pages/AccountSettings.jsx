import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import ManageAlerts from "../components/feedback/ManageAlerts";
import warningIcon from "../assets/warning-icon.png";
import PasswordField from "../components/common/PasswordField";

/**
 * Account Settings Page 
 * 
 * This page allows users to:
 * - View & update general account information (first name, last name, postal code)
 * - Change their password (UI + basic validation only, backend is to be added)
 * - Toggle general notifications preferences
 * - Delete their account (requires password confirmation)
 * 
 * NOTE:
 * - Email cannot be changed
 * - Manage Alerts side is UI-only for now (functionality will be added later)
 */

const AccountSettings = () => {
  const { user, updateProfile, changePassword, logout } = useAuth(); // add user, update profile, change password and logout from context

  console.log(`AccountSettings - User from context: ${user}`) // check the current user 

  // add handling for loading state to check 
  if (!user) { 
    return ( 
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  /**
   * user info state
   * stores editable user profile fields
   * backend will replace the default placeholder values
   */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [email, setEmail] = useState("");

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [deletePassword, setDeletePassword] = useState(""); 
  const [deletePasswordError, setDeletePasswordError] = useState(""); 

  // Load the initial user data and set to state. Change when user changes
  useEffect(() => {
    console.log(`useEffect - User ${user}`) // check if the user state is being passed properly
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPostalCode(user.postalCode || "");
      setEmail(user.email || "");
    }
  }, [user]);

  /**
   * password change state & logic
   * controls the expanded password UI + validation
   * will be connected to backend password logic later
   */
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [globalPasswordError, setGlobalPasswordError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const handlePasswordSave = async () => {
      // Reset errors
      setCurrentPasswordError("");
      setNewPasswordError("");
      setConfirmPasswordError("");
      setGlobalPasswordError("");

      let hasError = false;

      // Required checks
      if (!currentPassword.trim()) {
        setCurrentPasswordError("Current password is required.");
        hasError = true;
      }
      if (!newPassword.trim()) {
        setNewPasswordError("New password is required.");
        hasError = true;
      }
      if (!confirmPassword.trim()) {
        setConfirmPasswordError("Please confirm your password.");
        hasError = true;
      }

      if (hasError) return;

      // Matching check
      if (newPassword !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
        setNewPasswordError("Passwords do not match.");
        setGlobalPasswordError("Passwords do not match.");
        return;
      }

      // Call backend to change password
      const result = await changePassword(currentPassword, newPassword); // use changePassword from authcontext (gets the current and new password)

      if (result.success) {
        // Success - close fields and reset
        alert("Password changed successfully!");
        setShowPasswordFields(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Show error
        setGlobalPasswordError(result.message || "Failed to change password");
      }
  };

  /**
   * delete account modal state & logic
   * user must confirm by entering their password
   * final deletion will be handled via backend
   */
  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setDeletePasswordError("Password is required to delete your account.");
      return;
    }

    try {
      const token = localStorage.getItem('authToken'); // get current authtoken from storage
      
      // Call backend to delete account
      const response = await fetch('http://localhost:5000/api/users/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json(); // payload from backend call

      if (data.success) {
        // Logout and redirect
        logout();
        window.location.href = "/account-deleted"; // popup that was created
      } else {
        setDeletePasswordError(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error(`Delete account error:, ${error.stack}`);
      setDeletePasswordError("Failed to delete account. Please try again.");
    }
  };

  /**
   * save account info (first name, last name, postal code)
   * placeholder logic - backend integration will replace console.log
   */
  const handleSave = async () => {
    // determine profile data that will be updated
    const profileData = {
      firstName,
      lastName,
      postalCode
    };

    const result = await updateProfile(profileData);

    if (result.success) {
      alert("Profile updated successfully!");
    } else {
      alert(result.message || "Failed to update profile");
    }
  };

  // page layout with responsive design
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 bg-[#F5F6F7] min-h-screen">

      {/* page header - responsive text sizes */}
      <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Account Settings</h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
        Update your account information and manage your transit alerts.
      </p>

      {/* two-panel grid - stacks on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

        {/* left panel – account info */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">

          {/* first name */}
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BC0B2A]"
          />

          {/* last name */}
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BC0B2A]"
          />

          {/* email */}
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            value={email}
            disabled
            className="w-full border rounded-lg px-3 py-2 mb-5 bg-gray-100 text-gray-600 text-sm"
          />

          {/* password section */}
          <div className="flex items-center justify-between mt-4">
            <label className="text-sm font-medium">Password</label>

            {/* show "change" button only if fields are collapsed */}
            {!showPasswordFields && user && user?.authMethod === 'local' && (
              <button
                onClick={() => setShowPasswordFields(true)}
                className="text-[#BC0B2A] text-sm font-semibold hover:underline"
              >
                Change
              </button>
            )}
          </div>

          <input
            type="password"
            disabled
            value="**************"
            className="w-full border rounded px-3 py-2 my-1 bg-gray-100"
          />

          {/* extended password fields */}
          {showPasswordFields && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">

              {/* current password */}
              <PasswordField
                label="Current Password"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                error={currentPasswordError}
              />
              
              {/* new password */}
              <PasswordField
                label="New Password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                error={newPasswordError}
              />

              {/* confirm password */}
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                error={confirmPasswordError}
              />

              {/* validation error */}
              {globalPasswordError && (
                <p className="text-red-600 text-sm mt-2">{globalPasswordError}</p>
              )}

              {/* save/cancel buttons - stack on mobile */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowPasswordFields(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setCurrentPassword("");
                  }}
                  className="w-full sm:w-auto px-4 py-2 border rounded hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handlePasswordSave}
                  className="w-full sm:w-auto px-4 py-2 bg-[#BC0B2A] text-white rounded hover:bg-[#A30A26] transition"
                >
                  Save Password
                </button>
              </div>
            </div>
          )}

          {/* postal code */}
          <label className="block text-sm font-medium mb-1 mt-6">Postal Code</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#BC0B2A]"
          />

          {/* notification toggle */}
          <label className="block text-sm font-medium mb-2">Notifications Preferences</label>
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm">Email Alerts</span>

            {/* custom toggle switch */}
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <span className="
                w-10 h-5 bg-gray-300 rounded-full relative transition-all
                peer-checked:bg-[#BC0B2A]
                after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full
                after:absolute after:top-0.5 after:left-0.5 after:transition-all
                peer-checked:after:translate-x-5">
              </span>
            </label>
          </div>

          {/* delete account */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 hover:underline text-sm font-semibold mb-8"
          >
            Delete Account
          </button>

          {/* save changes button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2 bg-[#BC0B2A] text-white rounded-md text-sm hover:bg-[#A30A26] transition"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* right panel */}
        <ManageAlerts />
      </div>

      {/* delete account modal - responsive padding and sizing */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[100] p-4">
          <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl max-w-lg w-full text-center">

            {/* warning icon */}
            <img 
              src={warningIcon}
              alt="Warning"
              className="w-16 h-16 sm:w-20 sm:h-20 mb-4 mx-auto object-contain"
            />

            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Are you sure you want to delete your account?
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mb-6">
              This action cannot be undone.<br />
              All your feedback and data will be permanently removed.
            </p>

            <p className="text-sm mb-3 font-medium">
              Please enter your password to confirm.
            </p>

            {/* password input with toggle visibility */}
            <PasswordField
                name="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                error={deletePasswordError}
              />

            {deletePasswordError && (
              <p className="text-red-600 text-sm mb-3">{deletePasswordError}</p>
            )}

            {/* modal buttons - stack on mobile */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeletePasswordError("");
                }}
                className="w-full sm:w-auto px-4 py-2 border rounded-md text-[#BC0B2A] border-[#BC0B2A] hover:bg-red-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto px-5 py-2 bg-[#BC0B2A] text-white rounded-md hover:bg-[#A30A26] transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountSettings;