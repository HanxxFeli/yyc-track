// page imports (these are placeholder components for now)
// NOTE FOR ENO: Make sure your page component names match exactly
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import AccountSettings from "./pages/AccountSettings";
import ErrorPage from "./pages/ErrorPage";
import AccountDeleted from "./pages/AccountDeleted";
import AuthLandingPage from "./pages/AuthLandingPage";
import AuthCallback from "./pages/AuthCallback";
import CompleteProfile from "./pages/CompleteProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Stations from "./pages/Stations";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHeader from "./components/admin/AdminHeader";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import FeedbackPage from "./pages/FeedbackPage";
import { CTrainProvider } from "./contexts/CtrainContext";
import { StationProvider } from "./contexts/StationContext";
import StationMonitoring from "./pages/StationMonitoring";
import FeedbackManagement from "./pages/FeedbackManagement";
import LandingPage from "./pages/LandingPage";
// import PrivacyPolicy from "./pages/PrivacyPolicy";
// import TermsOfService from "./pages/TermsOfService";
import DataAnalytics from "./pages/DataAnalytics";
import StationDetails from "./pages/StationDetails";
import StationAnalytics from "./pages/StationAnalytics";

/**
 * App Component
 *
 * Root component that:
 * - Initializes the React Router system
 * - Renders the global header on all page
 * - Defines all client-side routes
 * - Handles temporary login detection (localStorage) before backend integration
 * - `isLoggedIn` will be replaced with real authentication
 */

// Main App - simplified so that it is easier to manage router and auth provider
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StationProvider>
          <CTrainProvider>
            <AppContent /> {/* app content that contains all the routes */}
          </CTrainProvider>
        </StationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// App Content will contain the app structure
const AppContent = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLogin = location.pathname === "/admin/login";
  return (
    // Outer container: full height, flex column to push footer down
    <div >
      {/* Show AdminHeader ONLY for /admin routes */}
      {isAdminRoute && !isAdminLogin ? <AdminHeader /> : <Header />}

      {/* main content area where the page is displayed */}
      <main>
        <Routes>
          {/* public pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<Home />} />
          <Route path="/stations" element={<Stations />} />
          {/* <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} /> */}
          {/* <Route path="/analytics" element={<DataAnalytics />} /> */}
          <Route path="/stations/:stationId" element={<StationDetails />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminAuthProvider>
                <Routes>
                  <Route path="login" element={<AdminLogin />} />
                  {/* All admin routes should be protected */}
                  <Route
                    path="dashboard"
                    element={
                      <AdminProtectedRoute>
                        <AdminDashboard />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="stations"
                    element={
                      <AdminProtectedRoute>
                        <StationMonitoring />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="feedback"
                    element={
                      <AdminProtectedRoute>
                        <FeedbackManagement />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="analytics"
                    element={
                      <AdminProtectedRoute>
                        <DataAnalytics />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="stations/:stationId"
                    element={
                      <AdminProtectedRoute>
                        <StationAnalytics />
                      </AdminProtectedRoute>
                    }
                  />
                </Routes>
              </AdminAuthProvider>
            }
          />

          {/* User Login and Registration pages */}
          <Route
            path="/login"
            element={
              <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                <Login />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                <Register />
              </div>
            }
          />
          <Route
            path="/verify-email"
            element={
              <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                <VerifyEmail />
              </div>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                <ForgotPassword />
              </div>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                <ResetPassword />
              </div>
            }
          />

          {/* OAuth routes */}
          <Route
            path="/auth/callback"
            element={
              <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                <AuthCallback />
              </div>
            }
          />
          <Route
            path="/complete-profile"
            element={
              <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                <CompleteProfile />
              </div>
            }
          />

          {/* Protected routes - wrap with ProtectedRoute */}
          <Route
            path="/account-settings"
            element={
              <ProtectedRoute>
                <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                  <AccountSettings />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                  <AuthLandingPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                  <FeedbackPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-deleted"
            element={
              <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                <AccountDeleted />
              </div>
            }
          />

          {/* 404 catch-all route - must be last */}
          <Route
            path="*"
            element={
              <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                <ErrorPage />
              </div>
            }
          />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;
