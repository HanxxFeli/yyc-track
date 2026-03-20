import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

/**
 * @desc Protects a route by only rendering children if the Admin is logged in.
 * @param children - The component(s) to render if authenticated.
 * @returns Loading screen, redirect to /login, or the children.
 * @access Private
 */
const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) return null;

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
