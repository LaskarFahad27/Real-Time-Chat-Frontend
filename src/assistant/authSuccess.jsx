import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        setStatus("Processing authentication...");
        
        // Get token from URL
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");
        
        console.log("Auth token received:", token ? "Yes (length: " + token.length + ")" : "No");
        
        if (token) {
          // Store token in localStorage
          setStatus("Token received, storing...");
          localStorage.setItem("token", token);
          
          setStatus("Authentication successful! Redirecting to dashboard...");
          
          // Use replace instead of navigate for a clean history
          setTimeout(() => {
            console.log("Navigating to dashboard...");
            navigate("/dashboard", { replace: true });
          }, 500);
        } else {
          console.warn("No token received in URL");
          setStatus("No authentication token found. Redirecting to sign page...");
          setTimeout(() => {
            navigate("/sign", { replace: true });
          }, 500);
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        setStatus("Authentication error. Redirecting to sign page...");
        setTimeout(() => {
          navigate("/sign", { replace: true });
        }, 500);
      }
    };
    
    handleAuth();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-sky-100 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Google Authentication</h2>
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center">{status}</p>
      </div>
    </div>
  );
}
