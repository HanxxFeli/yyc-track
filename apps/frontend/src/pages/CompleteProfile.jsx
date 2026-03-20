// PAGE WHERE THE USER WILL BE ASKED THE POSTAL CODE AFTER OAUTH LOGIN
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const CompleteProfile = () => { 
    const [postalCode, setPostalCode] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => { 
        e.preventDefault()
        setError('')

        // postal code regex
        const postalPattern = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;

        if (!postalPattern.test(postalCode.trim())) {
            setError("Please enter a valid postal code (e.g., T2P 1J9).");
            return
        }

        setLoading(true)

        try { 
            // acquire token from local storage 
            const token = localStorage.getItem('authToken') 

            // ask user to login again if the token is not acquired
            if (!token) { 
                setError('Authentication token not found. Please sign in again')
                navigate('/login')
                return;
            }

            // call the backend to complete and update the user profile
            const response = await fetch('http://localhost:5000/api/auth/complete-profile', { 
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ postalCode: postalCode.trim()})
            });

            // get and convert the data from response
            const data = await response.json(); // convert response into an object
            console.log(`Complete profile response: ${data}`); // additional logging for checking

            // payload will contain a success and message field so get the value from those 
            if (data.success) { 
                navigate('/dashboard')
            } else { 
                setError(data.message || 'Failed to update profile. Please try again')
            }

        }
        catch (error) { 
            console.error(`Error completing profile ${error}`);
            setError('Failed to update profile')
        }
        finally { 
            setLoading(false)
        }
    }

    return ( 
        <div className="bg-[#F5F6F7] min-h-screen flex items-start justify-center pt-24">
            <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-2">
                    Complete Your Profile
                </h2>

                <p className="text-gray-600 mb-6">
                    One more step! Please enter your postal code to finish setting up your account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Postal Code</label>
                        <input
                            type="text"
                            placeholder="e.g., T2P 1J9"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#BC0B2A] ${
                                error ? "border-red-500" : "border-gray-300"
                            }`}
                        />

                        {error && (
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white text-sm font-medium transition ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#BC0B2A] hover:bg-[#A30A26]"
                        }`}
                    >
                        {loading ? "Saving..." : "Complete Profile"}
                    </button>
                </form>
            </div>                        
        </div>
    );
};

export default CompleteProfile;