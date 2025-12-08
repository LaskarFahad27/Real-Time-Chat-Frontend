import { useEffect, useState } from "react";
import { getGoogleUserProfile } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [picture, setPicture] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to sign page");
          navigate("/sign");
          return;
        }
        
        const profile = await getGoogleUserProfile();
        console.log("Profile response:", profile);
        
        if (profile && profile.user) {
          setUser(profile.user);
          setPicture(profile.user.picture);
          localStorage.setItem("myUserId", profile.user.id);
        } else {
          console.error("Invalid profile data:", profile);
          setError("Failed to load user profile");
          navigate("/sign");
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError(err.message || "An error occurred");
        navigate("/sign");
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading profile...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => navigate("/sign")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  if (!user) {
    navigate("/sign");
    return null;
  }

  const chat = () => {
    navigate("/users");
  }
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/sign");
  }


  return (
    <div className="flex flex-col items-center mt-10">
      <img src={picture} alt="profile" className="w-20 h-20 rounded-full" />
      <h2 className="text-2xl font-bold mt-4">Welcome, {user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
      <button onClick={chat}
       className=" px-4 py-2 mt-4 bg-gradient-to-l from-blue-600 to-blue-300 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-500 transition-colors">
        Go to Chat</button>
      <button onClick={logout}
           className=" px-4 py-2 mt-4 bg-gradient-to-r from-red-600 to-red-300 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-500 transition-colors">
      Sign Out
      </button>
    </div>
  );
}
