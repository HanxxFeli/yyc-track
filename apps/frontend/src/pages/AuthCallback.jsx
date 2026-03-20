import { useEffect, useState } from "react";
import { replace, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthCallback = () => { 
    const [searchParams] = useSearchParams(); // allows reading the URL query parameters
    const navigate = useNavigate();
    const { setAuthFromToken } = useAuth();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => { 
        const handleCallback = async () => { 
                try {
                // extract data from url using searchParams
                const token = searchParams.get('token');
                const needsPostalCode = searchParams.get('needsPostalCode') === 'true'; // compare the needsPostalCode and turn it into a boolean

                if (!token) { 
                    // If there is no token, something went wrong with the backend handling
                    navigate('/login?error=oauth_failed')
                    return ;
                }

                // save token to local storage for access (save as authtoken instead of just token)
                localStorage.setItem('authToken', token)

                // update authcontext with the token
                const result = await setAuthFromToken(token)

                if (!result.success) { 
                    console.error(`Failed to set auth from token: ${result}`); // track where the auth token setting is failing
                    navigate('/login?error=auth_failed')
                    return;
                }

                // check if user data indicates missing postal code
                // This is a fallback in case the backend did not set needsPostalCode correctly
                const userNeedsPostalCode = needsPostalCode || !result.user?.postalCode;

                // redirect the user depending on if they need the postalCode or not
                if (userNeedsPostalCode) { 
                    console.log('Redirecting to complete-profile');
                    navigate('/complete-profile', {replace: true})
                } else { 
                    console.log('Redirecting to dashboard');
                    navigate('/dashboard') // navigate to the authenticated landing page
                }

                setIsProcessing(false);
            } 
            catch (error) { 
                console.error(`Error in auth callback: ${error.stack}` );
                setError('An unexpected error occurred during sign in');
                setTimeout(() => navigate('/login?error=callback_error'), 2000);
            } 
            finally { 
                setIsProcessing(false)
            }

        }
        
        handleCallback(); // call the async callback handler
    }, []) // whenever parama ers change or is navigated to a different page, call useEffect; searchParams, navigate, setAuthFromToken

    if (error) { 
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 mb-2">{error}</p>
                    <p className="text-gray-600 text-sm">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-700">Completing sign in...</p>
            </div>
        </div>
    );

} 

export default AuthCallback;