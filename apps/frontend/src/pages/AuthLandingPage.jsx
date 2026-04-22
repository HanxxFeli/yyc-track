import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthLandingPage = () => { 
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('/map');
    }, []);

    return <h1 className="text-2xl p-6">You are logged in! Welcome to YYCTrack</h1>;
}

export default AuthLandingPage;