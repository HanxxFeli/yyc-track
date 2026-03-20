import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


/**
 * @desc Protects a route by only rendering children if the user is logged in.
 * @param children - The component(s) to render if authenticated.
 * @returns Loading screen, redirect to /login, or the children.
 * @access Private
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
            <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />; // replace - user cont go back to the protected page
    }

    return children;
};

export default ProtectedRoute;