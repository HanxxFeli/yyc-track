/**
 * AdminAuthContext 
 * 
 * Creates the context so that pages can be protected
 * uses a custom hook to use the admin auth context
 */
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminAuthContext = createContext();//Creation of the context

// Custom hook to use admin auth context
export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error("useAdminAuth must be used within AdminAuthProvider");
    }
    return context;
};

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // API base URL that will help connect to the backend
    const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

    // Check if admin already logged in
    useEffect(() => {
        const checkAdminAuth = async () => {
            const storedToken = localStorage.getItem("adminToken");// Check if token exists in local storage

            if (storedToken) {// If token exists, validate it by making a request to the backend
                try {
                const response = await fetch(`${API_URL}/auth/admin/me`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });

                if (response.ok) {// If token is valid, set admin and token in state
                    const data = await response.json();
                    setAdmin(data.user);
                    setToken(storedToken);
                } else {
                    localStorage.removeItem("adminToken");
                }
                } catch (error) {// If error occurs (e.g., network issue), remove token from local storage
                    console.error("Admin auth check failed:", error);
                    localStorage.removeItem("adminToken");
                }
            }

            setLoading(false);
        };

        checkAdminAuth();
    }, []);

    //Admin Login
    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/admin/login`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("adminToken", data.token);
                setToken(data.token);
                setAdmin(data.user);
                return { success: true };
            }

            return { success: false, message: data.message };
            } catch (error) {
            console.error("Admin login error:", error);
            return { success: false, message: "Admin login failed" };
        }
    };

    //Admin Logout
    const logout = () => {
        localStorage.removeItem("adminToken");
        setToken(null);
        setAdmin(null);
        navigate("/admin/login");
    };

    const value = {
        admin,
        token,
        loading,
        login,
        logout,
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {!loading && children}
        </AdminAuthContext.Provider>
    );
};
