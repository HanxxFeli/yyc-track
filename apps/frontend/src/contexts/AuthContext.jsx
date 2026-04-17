/**
 * AuthContext 
 * 
 * Creates the context so that pages can be protected
 * uses a custom hook to use the auth context
 */


import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // API base URL that will help connect to the backend
    const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

    // Check if user is logged in on mount
    useEffect(() => {
    const checkAuth = async () => {
        const storedToken = localStorage.getItem('authToken');

        // check if a token is already stored
        if (storedToken) {
            try {
                // Verify token is still valid by fetching user data
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                    'Authorization': `Bearer ${storedToken}`
                    }
                })

                // if token is still valid, set the payload data to the user and the token to the token state
                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user);
                    setToken(storedToken);
                } else {
                    // Token invalid, clear it
                    localStorage.removeItem('authToken')
                }
            } 
            catch (error) {
                console.error(`Auth check failed: ${error.stack}`)
                localStorage.removeItem('authToken'); // if there is an error, make sure to remove the token
            }
        }
        
        setLoading(false);
    };

    checkAuth();
    }, []);

    // Register the user
    const register = async (userData) => {
        try {
            // fetch the api endpoint for user registration
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json(); // data will contain the json payload

            if (data.success) {
                // Save token but don't set user yet (email not verified)
                localStorage.setItem('authToken', data.token);
                setToken(data.token);
                setUser(data.user) // set the user data after getting registered to the user
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } 
        catch (error) {
            console.error(`Registration Error: ${error.stack}`);
            return { success: false, message: 'Registration failed. Please try again.' };
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            // fetch the api endpoint for user login
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json(); // data will contain the json payload


            if (data.success) {
                localStorage.setItem('authToken', data.token);
                setToken(data.token); 
                setUser(data.user); 
                return { success: true, user: data.user }; 
            } else {
                return { success: false, message: data.message };
            }
        } 
        catch (error) {
            console.error(`Login Error: ${error.stack}`);
            return { success: false, message: 'Login failed. Please try again.' };
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        navigate('/login'); // send the user to the login page after they have logged out (CAN BE SET TO HOMEPAGE AS WELL)
    };

    // Verify email - takes in the 
    const verifyEmail = async (code) => {
        try {
            // fetch the api endpoint for user email verification
            const response = await fetch(`${API_URL}/auth/verify-email`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json(); // data will contain the json payload

            if (data.success) {
                // Update user state to reflect verified email
                setUser({ ...user, isEmailVerified: true });
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } 
        catch (error) {
            console.error(`Email Verification Error: ${error.stack}`);
            return { success: false, message: 'Verification failed. Please try again.' };
        }
    };

    // Resend verification code
    const resendVerification = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/resend-verification`, {
                method: 'POST',
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            return data;
        } 
        catch (error) {
            console.error(`Resend Verification Error: ${error.stack}`);
            return { success: false, message: 'Failed to resend code.' };
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } 
        catch (error) {
            console.error(`Update Profile Error: ${error.stack}`);
            return { success: false, message: 'Update failed. Please try again.' };
        }
    };

    // Change password
    const changePassword = async (currentPassword, newPassword) => {
        try {
            const response = await fetch(`${API_URL}/users/password`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();
            return data;
        } 
        catch (error) {
            console.error(`Change Password Error: ${error.stack}`);
            return { success: false, message: 'Password change failed. Please try again.' };
        }
    };

    // Set Authentication from Token
    const setAuthFromToken = async (authToken) => { 
        try { 
            const response = await fetch(`${API_URL}/auth/me`, { 
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            if (response.ok) { 
                const data = await response.json();
                setUser(data.user) // get the authorization then add a layer to set user as the user from payload
                setToken(authToken) // ensure authtoken value is updated once user logs in
                return {success: true, user: data.user}
            } else { 
                localStorage.removeItem('authToken')
                return {success: false}
            }
        }
        catch (error) { 
            console.error(`Error in setAuthFromToken: ${error}`)
            localStorage.removeItem('authToken')
            return {success: false, error: error.message}
        }
    }

    const value = {
        user,
        token,
        loading,
        register,
        login,
        logout,
        verifyEmail,
        resendVerification,
        updateProfile,
        changePassword,
        setAuthFromToken,
    };

    return (
        <AuthContext.Provider value={value}> {/*value is the data and functions child components can use*/}
            {/* Create a authcontext provider to share data to other components*/}
            {!loading && children}
        </AuthContext.Provider>
    );
};