import { useEffect, useState } from "react";
import { getAllUsers } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to sign page");
          navigate("/sign");
          return;
        }
        
        const response = await getAllUsers();
        setUsers(response.data || []);
        
      } catch (err) {
        console.error("Error loading users:", err);
        setError(err.message || "An error occurred");
        navigate("/sign");
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [navigate]);

  const handleUserClick = (userId) => {
    // Store targetUserId in localStorage
    localStorage.setItem("targetUserId", userId);
    
    const myId = localStorage.getItem("myUserId");
    navigate(`/chat?myId=${myId}&targetId=${userId}`);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading users...</p>
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-sm">
          {users.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {/* Profile Image or Initial */}
                  <div className="flex-shrink-0">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-14 h-14 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-semibold"
                      style={{ display: user.picture ? "none" : "flex" }}
                    >
                      {getInitials(user.name)}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    {user.semester && (
                      <p className="text-xs text-gray-400 mt-1">{user.semester}</p>
                    )}
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0 ml-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
