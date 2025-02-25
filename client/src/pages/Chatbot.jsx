import { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import NavbarUser from "../components/NavbarUser";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [savedChats, setSavedChats] = useState([]); // State for saved chats
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility
  const [chatTopic, setChatTopic] = useState(""); // State for chat topic
  const [selectedChat, setSelectedChat] = useState(null); // State for selected chat
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

  const handleSaveChat = () => {
    if (messages.length > 0) {
      const topic = chatTopic || `Chat ${new Date().toLocaleTimeString()}`;
      const chat = { id: Date.now(), topic, messages: [...messages] }; // Save the entire chat with a topic
      setSavedChats((prev) => [...prev, chat]);
      setChatTopic(""); // Reset topic input
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat); // Set the selected chat to display its messages
  };

  const handleCloseSavedChat = () => {
    setSelectedChat(null); // Close the saved chat view
  };

  return (
    <div className="w-full h-screen flex bg-cover bg-center overflow-hidden" style={{ background: "radial-gradient(circle at top center, #A78BFA 10%, #ffb3dd 70%, #fff 95%)" }}>
      {/* Sidebar for Saved Chats */}
      {isSidebarOpen && (
        <div className="w-1/8 bg-white p-4 border-r border-gray-200 overflow-y-auto" style={{ marginTop: "64px" }}> {/* Adjusted margin to account for Navbar */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Saved Chats</h2>
            <button onClick={toggleSidebar} className="p-1 hover:bg-gray-200 rounded-full">
              <img src={assets.close} alt="Close" className="w-5 h-5" />
            </button>
          </div>
          {savedChats.length === 0 ? (
            <p className="text-gray-500">No saved chats yet.</p>
          ) : (
            savedChats.map((chat) => (
              <div
                key={chat.id}
                className="p-3 mb-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                onClick={() => handleChatClick(chat)}
              >
                <p className="text-sm font-semibold">{chat.topic}</p> {/* Display topic title */}
                <p className="text-xs text-gray-500">
                  {chat.messages.length} messages
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? "ml-1/8" : "ml-0"}`}>
        <div className="sticky top-0 left-0 w-full z-50 bg-white shadow-md">
          <NavbarUser />
        </div>

        <div className="flex-1 px-4 py-6 mt-25 flex flex-col items-center justify-start pb-20 overflow-y-auto relative">
          {/* Display Selected Saved Chat */}
          {selectedChat ? (
            <div className="w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedChat.topic}</h2>
                <button onClick={handleCloseSavedChat} className="p-1 hover:bg-gray-200 rounded-full">
                  <img src={assets.close} alt="Close" className="w-5 h-5" />
                </button>
              </div>
              {selectedChat.messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {msg.sender === "user" && (
                    <img src={assets.user_profile} alt="User" className="w-10 h-10 rounded-full" />
                  )}
                  {msg.sender === "bot" && (
                    <img src={assets.chatbot_logo} alt="Chatbot" className="w-16 h-16 rounded-full self-start" />
                  )}
                  <div
                    className={`p-3 mb-5 rounded-3xl max-w-[75%] break-words ${msg.sender === "user" ? "bg-[#9d16be] text-white self-end text-left ml-auto" : "bg-white text-gray-900 self-start text-left mr-auto"}`}
                    style={{ wordWrap: "break-word", overflowWrap: "break-word", whiteSpace: "pre-wrap" }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 flex items-center shadow-lg">
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

          <button
            onClick={handleSaveChat}
            className="ml-3 p-2 bg-gray-200 rounded-2xl shadow-lg hover:bg-gray-300 transition"
          >
            <img src={assets.bookmark} alt="Save" className="w-6 h-6" />
          </button>

          <button className="ml-3 px-4 py-2 bg-[#9d16be] text-white rounded-lg" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-30 left-6 p-2 bg-purple-300 rounded-r-lg shadow-lg hover:bg-gray-100 transition"
      >
        <img src={isSidebarOpen ? assets.sidebar_close : assets.sidebar_open} alt="Menu" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Chatbot;