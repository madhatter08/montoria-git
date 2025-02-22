import { useState } from "react";
import { assets } from "../assets/assets";
import backgroundImage from "../assets/background.png"; // ✅ Import background image
import AdminNavbar from '../components/AdminNavbar'

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };

  return (
    <div
      className="w-full h-screen flex flex-col bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }} // ✅ Set background image
      
    >
      <AdminNavbar />
      {/* Help Button (Upper Right) */}
      <button className="absolute top-4 right-4 p-2">
        <img src={assets.help} alt="Help" className="w-12 h-12" />
      </button>

      {/* Chatbot Messages Container */}
      <div className="flex-1 px-4 py-6 flex flex-col items-center justify-start">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-2xl">
          {/* Image beside greeting */}
          <img className="w-20 h-20 md:w-32 md:h-32" src={assets.chatbot_logo} alt="Chatbot" />

          {/* Greeting Text */}
          <div className="text-center md:text-left flex flex-col">
            <h2 className="text-[#1e1e1e] text-2xl md:text-4xl font-bold font-['League Spartan']">
              Hello, User!
            </h2>
            <p className="text-[#1e1e1e] text-lg md:text-2xl font-semibold mt-2">
              How may I help you today?
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="mt-6 w-full max-w-2xl flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div key={index} className={`p-3 rounded-3xl ${msg.sender === "user" ? "bg-green-600 self-end" : "bg-gray-200 self-start"}`}>
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Input Section */}
      <div className="w-full p-4 bg-gray-100 flex items-center relative">
        {/* New Chat Icon (Outside Text Field) */}
        <button className="p-2 bg-gray-200 rounded-2xl shadow-lg hover:bg-gray-300 transition mr-3">
          <img src={assets.new_chat} alt="New Chat" className="w-10 h-10" />
        </button>

        {/* Input Field */}
        <input
          type="text"
          className="flex-1 p-3 rounded-lg border border-gray-300 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        {/* Send Button */}
        <button
          className="ml-3 px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
