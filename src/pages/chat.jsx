import { useState, useEffect, useRef } from "react";
import { storeMessage, getMessages } from "../utils/api";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function Chat() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [hoveredMsgIndex, setHoveredMsgIndex] = useState(null);

  const bottomRef = useRef(null);

   useEffect(() => {
      const loadMessages = async () => {
        try {
          // Check if token exists
          const token = localStorage.getItem("token");
          if (!token) {
            console.log("No token found, redirecting to sign page");
            navigate("/sign");
            return;
          }
          
          if (myId && targetId) {
            console.log("Fetching messages for:", myId, targetId);
            const response = await getMessages(myId, targetId);
            console.log("Messages response:", response);
            if (response && response.success) {
              const loadedMessages = response.data.map(msg => ({
                ...msg,
                senderId: msg.senderId || msg.sender_id,
                receiverId: msg.receiverId || msg.receiver_id
              }));
              setMessages(loadedMessages);
              console.log("Messages loaded:", loadedMessages.length);
              console.log("First message:", loadedMessages[0]);
            }
          }
          
        } catch (err) {
          console.error("Error loading messages:", err);
        }
      };
      
      loadMessages();
    }, [myId, targetId]);
  // Load IDs & register user
  useEffect(() => {
    // First check URL query parameters
    const queryMyId = searchParams.get("myId");
    const queryTargetId = searchParams.get("targetId");
    
    const savedMyId = queryMyId || localStorage.getItem("myUserId");
    const savedTargetId = queryTargetId || localStorage.getItem("targetUserId");

    if (!savedMyId) {
      console.error("Missing myUserId in localStorage!");
      alert("Missing user ID! Please login again.");
      return;
    }

    setMyId(savedMyId);
    if (savedTargetId) {
      setTargetId(savedTargetId);
    }

    socket.emit("register", savedMyId);
    console.log("Registered:", savedMyId);

    // Listen for target user changes via CustomEvent
    const handleTargetIdChange = (event) => {
      const newTargetId = event.detail;
      if (newTargetId) {
        setTargetId(newTargetId);
        localStorage.setItem("targetUserId", newTargetId);
        console.log("Target user updated:", newTargetId);
      }
    };

    window.addEventListener("sendTargetId", handleTargetIdChange);

    return () => {
      window.removeEventListener("sendTargetId", handleTargetIdChange);
    };
  }, []);

  // Receive messages
  useEffect(() => {
    socket.on("received_message", (data) => {
      setMessages((prev) => [...prev, { ...data, sender: "other" }]);
    });

    return () => socket.off("received_message");
  }, []);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;
    if (!targetId) {
      console.error("No targetId set");
      alert("Target user ID is missing!");
      return;
    }

    const newMsg = {
      message,
      time: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      senderId: myId,
      receiverId: targetId,
    };

    console.log("Sending message:", newMsg);

    // Add to UI
    setMessages((prev) => [...prev, { ...newMsg }]);

    // Send to backend via socket
    socket.emit("message", { newMessage: newMsg, targetId });

    // Store in database
    try {
      const response = await storeMessage(newMsg.message, newMsg.time, newMsg.senderId, newMsg.receiverId);
      console.log("Store message response:", response);
      if(response.success){
        console.log("Message stored successfully");
      } else {
        console.log("Storing failed:", response.message);
      }
    } catch (error) {
      console.error("Error storing message:", error);
    }

    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 mt-2">
        {messages.map((msg, i) => {
          const isMyMessage = String(msg.senderId) === String(myId);
          return (
          <div 
            key={i} 
            className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}
          >
            <div
              onMouseOver={() => setHoveredMsgIndex(i)}
            onMouseLeave={() => setHoveredMsgIndex(null)}
              className={`inline-flex flex-col max-w-xs p-3 rounded-xl shadow-md ${
                isMyMessage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <p>{msg.message}</p>
            </div>
            {hoveredMsgIndex === i && (
              <span className="text-xs opacity-70 mt-1 px-2">{msg.time}</span>
            )}
          </div>
        )})}

        <div ref={bottomRef}></div>
      </div>

      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md border"
      >
        <input
          type="text"
          className="flex-1 px-3 py-2 border rounded-lg bg-gray-50"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="bg-blue-600 px-4 py-2 text-white rounded-lg">Send</button>
      </form>
    </div>
  );
}

export default Chat;
