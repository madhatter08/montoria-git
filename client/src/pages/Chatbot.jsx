import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import NavbarUser from "../components/NavbarUser";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      if (data?.response) {
        const botMessage = { text: data.response, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error("Error fetching API response:", error);
    }

    setInput("");
  };

  return (
    <div className="w-full h-screen flex flex-col bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${assets.background})` }}>
  
      <div className="sticky top-0 left-0 w-full z-50 bg-white shadow-md">
      <NavbarUser />
      </div>

      <div className="flex-1 px-4 py-6 mt-25 flex flex-col items-center justify-start pb-20 overflow-y-auto relative">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-2xl">
          <img className="w-25h-25 md:w-35 md:h-35" src={assets.chatbot_logo} alt="Chatbot" />
          <div className="text-center md:text-left flex flex-col">
            <h2 className="text-[#000000] text-2xl md:text-4xl font-bold font-['League Spartan']">Hello, User!</h2>
            <p className="text-[#000000] text-lg md:text-2xl font-semibold mt-2">How may I help you today?</p>
          </div>
        </div>

        <div className="mt-6 w-full max-w-2xl flex flex-col gap-4 pb-20">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.sender === "user" && (
                <img src={assets.user_profile} alt="User" className="w-10 h-10 rounded-full" />
              )}
              {msg.sender === "bot" && (
                <img src={assets.chatbot_logo} alt="Chatbot" className="w-16 h-16 rounded-full self-start" />
              )}
              <div
                className={`p-3 rounded-3xl max-w-[75%] break-words ${msg.sender === "user" ? "bg-[#9d16be] text-white self-end text-left ml-auto" : "bg-white text-gray-900 self-start text-left mr-auto"}`}
                style={{ wordWrap: "break-word", overflowWrap: "break-word", whiteSpace: "pre-wrap" }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-gray-100 flex items-center shadow-lg">
        <button className="p-2 bg-gray-200 rounded-2xl shadow-lg hover:bg-gray-300 transition mr-3">
          <img src={assets.help} alt="Help" className="w-10 h-10" />
        </button>

        <button className="p-2 bg-gray-200 rounded-2xl shadow-lg hover:bg-gray-300 transition mr-3">
          <img src={assets.new_chat} alt="New Chat" className="w-10 h-10" />
        </button>

        <input
          type="text"
          className="flex-1 p-3 rounded-lg border border-gray-300 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        <button className="ml-3 px-4 py-2 bg-[#9d16be] text-white rounded-lg" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;