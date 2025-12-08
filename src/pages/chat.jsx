import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
//import './index.css'

const socket = io.connect("http://localhost:4000")

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const [chatId, setChatId] = useState("");
  const [myId, setMyId] = useState("");
  const [targetId, setTargetId] = useState("");

  useEffect(() => {
    const handleEvent = (event) => {
      console.log("Received userId in Chat:", event.detail);
      setTargetId(event.detail);

      const myUserId = localStorage.getItem("myUserId");
      setMyId(myUserId);
      socket.emit("register", myUserId);
      console.log("Registered ID", myUserId);
    };

    window.addEventListener("sendTargetId", handleEvent);

    return () => {
      window.removeEventListener("sendTargetId", handleEvent);
    };
  }, []);
  

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      message,
      time: new Date().toLocaleTimeString(),
      senderId: myId,
      receiverId: targetId,
      sender: "me"
    }

    setMessages(prev => [...prev, newMessage])
    socket.emit("message", { newMessage, targetId });

    setMessage("");
  }

  useEffect(() => {
    socket.on("received_message", (data) => {
  setMessages(prev => [...prev, { ...data, sender: "other" }]);
});

    return () => socket.off("received_message");
  }, []);

  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100 p-4">

        <div className="flex-1 overflow-y-auto space-y-2 mb-4 mt-2">

          {messages.map((msg, index) => (
            <div key={index}
              className={`flex ${msg.sender === "me" ? "justify-end" : ""}`}>

              <div className={`inline-flex flex-col max-w-xs p-3 rounded-xl shadow-md
                ${msg.sender === "me"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <p className="break-words">{msg.message}</p>
                <span className="text-xs opacity-70 mt-1">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>

        </div>
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200"
        >
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg 
                       text-white font-medium transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </>
  )
}

export default Chat
