import { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import NavbarUser from "../components/NavbarUser";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import styled from "styled-components";
import HelpForm from "../Forms/HelpForm";
import { toast } from "react-toastify";

// Checkbox Component for Saving Chats
const Checkbox = ({ onClick }) => (
  <StyledCheckboxWrapper>
    <label className="container" onClick={onClick}>
      <input type="checkbox" defaultChecked="checked" />
      <svg className="save-regular" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
        <path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z" />
      </svg>
      <svg className="save-solid" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
        <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
      </svg>
    </label>
  </StyledCheckboxWrapper>
);

// Styled Components
const StyledCheckboxWrapper = styled.div`
  .container {
    --color: #9d16be;
    --size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    font-size: var(--size);
    user-select: none;
    fill: var(--color);
    background: white;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .container .save-regular {
    position: absolute;
    animation: keyframes-fill 0.5s;
    transform-origin: top;
  }

  .container .save-solid {
    position: absolute;
    animation: keyframes-fill 0.5s;
    display: none;
    transform-origin: top;
  }

  .container input:checked ~ .save-regular {
    display: none;
  }

  .container input:checked ~ .save-solid {
    display: block;
  }

  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  @keyframes keyframes-fill {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scaleY(1.2);
    }
  }
`;

// Loader Component
const Loader = () => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
  </div>
);

// Chatbot Component
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [savedChats, setSavedChats] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveChatForm, setShowSaveChatForm] = useState(false);
  const [chatTopic, setChatTopic] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const messagesEndRef = useRef(null);

  const { userData } = useContext(AppContext);
  const displayName = userData.role === "admin" ? userData.roleData?.name : userData.roleData?.firstName;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (input.trim() === "") {
      toast.error("Please enter a message.");
      return;
    }

    const userMessage = { text: input, sender: "user" };
    setInput("");
    setIsLoading(true);

    // Add the user message and loader immediately
    if (selectedChat) {
      const updatedMessages = [...selectedChat.messages, userMessage, { sender: "bot", isLoading: true }];
      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: updatedMessages,
      }));
      // Update the savedChats state with the new messages
      setSavedChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChat.id ? { ...chat, messages: updatedMessages } : chat
        )
      );
    } else {
      setMessages((prevMessages) => [...prevMessages, userMessage, { sender: "bot", isLoading: true }]);
    }

    try {
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.response) {
        const botMessage = { text: data.response, sender: "bot" };

        if (selectedChat) {
          const updatedMessages = [...selectedChat.messages.filter((msg) => !msg.isLoading), botMessage];
          setSelectedChat((prevChat) => ({
            ...prevChat,
            messages: updatedMessages,
          }));
          // Update the savedChats state with the new messages
          setSavedChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === selectedChat.id ? { ...chat, messages: updatedMessages } : chat
            )
          );
        } else {
          setMessages((prevMessages) => [
            ...prevMessages.filter((msg) => !msg.isLoading),
            botMessage,
          ]);
        }
      } else {
        throw new Error("Invalid response from the server.");
      }
    } catch (error) {
      console.error("Error fetching API response:", error);
      const errorMessage = { text: "Failed to fetch response. Please try again.", sender: "bot" };

      if (selectedChat) {
        const updatedMessages = [...selectedChat.messages.filter((msg) => !msg.isLoading), errorMessage];
        setSelectedChat((prevChat) => ({
          ...prevChat,
          messages: updatedMessages,
        }));
        // Update the savedChats state with the error message
        setSavedChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === selectedChat.id ? { ...chat, messages: updatedMessages } : chat
          )
        );
      } else {
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => !msg.isLoading),
          errorMessage,
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving a chat
  const handleSaveChat = () => {
    if (messages.length === 0) {
      toast.error("No messages to save.");
      return;
    }
    setShowSaveChatForm(true);
  };

  // Handle saving the chat after form submission
  const handleSaveChatSubmit = (e) => {
    e.preventDefault();

    if (!chatTopic.trim()) {
      toast.error("Please enter a name for the chat.");
      return;
    }

    // Check if a chat with the same topic already exists
    const existingChatIndex = savedChats.findIndex((chat) => chat.topic === chatTopic);

    if (existingChatIndex !== -1) {
      // If chat exists, update the messages by appending only new ones
      setSavedChats((prevChats) => {
        const updatedChats = [...prevChats];
        const existingMessages = updatedChats[existingChatIndex].messages;
        const newMessages = messages.filter(
          (msg) => !existingMessages.some((existingMsg) => existingMsg.text === msg.text)
        );

        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          messages: [...existingMessages, ...newMessages],
        };

        // Show toast notification (avoiding duplicate)
        if (!toast.isActive("chat-updated-toast")) {
          toast.success("Chat updated!", { toastId: "chat-updated-toast", autoClose: 2000 });
        }

        return updatedChats;
      });
    } else {
      // If it's a new conversation, save it as a new card
      const newChat = { id: Date.now(), topic: chatTopic, messages: [...messages] };
      setSavedChats((prevChats) => [...prevChats, newChat]);
      toast.success("Chat saved!", { autoClose: 2000 });
    }

    // Reset form and close modal
    setChatTopic("");
    setShowSaveChatForm(false);
  };

  // Handle loading a saved chat
  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
  };

  // Handle closing a saved chat
  const handleCloseSavedChat = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  // Handle starting a new chat
  const handleNewChat = () => {
    setMessages([]);
    setSelectedChat(null);
  };

  // Handle deleting a saved chat
  const handleDeleteChat = (chatId) => {
    setChatToDelete(chatId);
    setShowDeleteConfirmation(true);
  };

  // Confirm deletion of a saved chat
  const confirmDeleteChat = () => {
    setSavedChats((prevChats) => prevChats.filter((chat) => chat.id !== chatToDelete));
    toast.success("Chat deleted!", { autoClose: 2000 });
    setShowDeleteConfirmation(false);
    setChatToDelete(null);
  };

  return (
    <div className="w-full h-screen flex bg-cover bg-center overflow-hidden" style={{ background: "radial-gradient(circle at top center, #A78BFA 10%, #ffb3dd 70%, #fff 95%)" }}>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-[125px] z-50 ${isSidebarOpen ? "xl:left-[16.5%] lg:left-[24.5%] md:left-[24.5%] sm:left-[33%] left-[35%] rounded-r-lg" : "left-6 rounded-lg"} p-2 bg-white hover:bg-gray-100 transition-all`}
      >
        <img src={isSidebarOpen ? assets.sidebar_open : assets.sidebar_close} alt="Menu" className="w-6 h-6" />
      </button>

      {/* Sidebar for Saved Chats */}
      {isSidebarOpen && (
        <div className="xl:w-1/6 lg:w-1/4 md:w-1/4 w-1/3 mt-26 bg-white p-4 border-r shadow-lg border-gray-200 overflow-y-auto transition-all">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold mt-4">Saved Chats</h2>
          </div>
          {savedChats.length === 0 ? (
            <p className="text-gray-500 text-base">No saved chats yet.</p>
          ) : (
            savedChats.map((chat) => (
              <div
                key={chat.id}
                className="p-3 mb-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 relative"
                onClick={() => handleChatClick(chat)}
              >
                {/* Chat Topic and Message Count */}
                <p className="text-sm font-semibold">{chat.topic}</p>
                

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the chat from being opened when deleting
                    handleDeleteChat(chat.id);
                  }}
                  className="absolute top-2 right-2 p-1 bg-transparent text-white rounded-full hover:bg-gray-200 transition"
                >
                  <img src={assets.delete_icon} alt="Delete" className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? "ml-1/8" : "ml-0"}`}>
        <NavbarUser />
        <div className="flex-1 px-4 py-6 mt-25 flex flex-col items-center justify-start pb-20 overflow-y-auto relative">
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
                  {msg.sender === "user" && <img src={assets.user_profile} alt="User" className="w-10 h-10 rounded-full" />}
                  {msg.sender === "bot" && <img src={assets.chatbot_logo} alt="Chatbot" className="w-16 h-16 rounded-full self-start" />}
                  <div
                    className={`p-3 mb-5 rounded-3xl max-w-[75%] break-words ${msg.sender === "user" ? "bg-[#9d16be] text-white self-end text-left ml-auto" : "bg-white text-gray-900 self-start text-left mr-auto"}`}
                    style={{ wordWrap: "break-word", overflowWrap: "break-word", whiteSpace: "pre-wrap" }}
                  >
                    {msg.isLoading ? <Loader /> : msg.text}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-2xl">
                <img className="w-25 h-25 md:w-35 md:h-35" src={assets.chatbot_logo} alt="Chatbot" />
                <div className="text-center md:text-left flex flex-col">
                  <h2 className="text-[#000000] text-2xl md:text-4xl font-bold font-['League Spartan']">Hello, {displayName}!</h2>
                  <p className="text-[#000000] text-lg md:text-2xl font-semibold mt-2">How may I help you today?</p>
                </div>
              </div>

              <div className="mt-6 w-full max-w-2xl flex flex-col gap-4 pb-20">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {msg.sender === "user" && <img src={assets.user_profile} alt="User" className="w-10 h-10 rounded-full" />}
                    {msg.sender === "bot" && <img src={assets.chatbot_logo} alt="Chatbot" className="w-16 h-16 rounded-full self-start" />}
                    <div
                      className={`p-3 rounded-3xl max-w-[75%] break-words ${msg.sender === "user" ? "bg-[#9d16be] text-white self-end text-left ml-auto" : "bg-white text-gray-900 self-start text-left mr-auto"}`}
                      style={{ wordWrap: "break-word", overflowWrap: "break-word", whiteSpace: "pre-wrap" }}
                    >
                      {msg.isLoading ? <Loader /> : msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2">
                   
                    <div className="p-3 rounded-3xl max-w-[75%] break-words bg-transparent text-gray-900 self-start text-left mr-auto">
                  
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="bottom-0 left-0 right-0 p-4 bg-gray-100 flex items-center gap-2 shadow-lg relative">
          {/* Help Button with Hover */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowHelpForm(true)}
              onMouseLeave={() => setShowHelpForm(false)}
              className="p-2 bg-gray-200 rounded-2xl shadow-lg hover:bg-gray-300 transition"
            >
              <img src={assets.help} alt="Help" className="w-10 h-10" />
            </button>
            {showHelpForm && (
              <div className="absolute bottom-14 left-0 z-50">
                <HelpForm />
              </div>
            )}
          </div>

          {/* New Chat Button */}
          <button onClick={handleNewChat} className="p-2 bg-gray-200 rounded-2xl shadow-lg hover:bg-gray-300 transition">
            <img src={assets.new_chat} alt="New Chat" className="w-10 h-10" />
          </button>

          {/* Input Field */}
          <input
            type="text"
            className="flex-1 p-2 rounded-lg border border-gray-300 outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />

          {/* Checkbox and Send Button */}
          <Checkbox onClick={handleSaveChat} />
          <button onClick={handleSendMessage} className="p-2 bg-[#9d16be] text-white rounded-lg hover:bg-[#7c0f8e] transition" disabled={isLoading}>
            Send
          </button>
        </div>
      </div>

      {/* Save Chat Form Modal */}
      {showSaveChatForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Save Chat</h2>
            <form onSubmit={handleSaveChatSubmit}>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-gray-300 outline-none mb-4"
                placeholder="Enter a name for this chat"
                value={chatTopic}
                onChange={(e) => setChatTopic(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaveChatForm(false)}
                  className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-[#9d16be] text-white rounded-lg hover:bg-[#7c0f8e] transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Chat</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this chat?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteChat}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;