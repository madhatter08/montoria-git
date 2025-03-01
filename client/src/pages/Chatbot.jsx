import { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import NavbarUser from "../components/NavbarUser";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import styled from "styled-components";
import HelpForm from "../Forms/HelpForm"; 
import { toast } from "react-toastify";

// Loader Component
const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader-container">
        <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px" viewBox="0 0 200 200" className="pencil">
          <defs>
            <clipPath id="pencil-eraser">
              <rect height={30} width={30} ry={5} rx={5} />
            </clipPath>
          </defs>
          <circle transform="rotate(-113,100,100)" strokeLinecap="round" strokeDashoffset="439.82" strokeDasharray="439.82 439.82" strokeWidth={2} stroke="currentColor" fill="none" r={70} className="pencil__stroke" />
          <g transform="translate(100,100)" className="pencil__rotate">
            <g fill="none">
              <circle transform="rotate(-90)" strokeDashoffset={402} strokeDasharray="402.12 402.12" strokeWidth={30} stroke="hsl(223,90%,50%)" r={64} className="pencil__body1" />
              <circle transform="rotate(-90)" strokeDashoffset={465} strokeDasharray="464.96 464.96" strokeWidth={10} stroke="hsl(223,90%,60%)" r={74} className="pencil__body2" />
              <circle transform="rotate(-90)" strokeDashoffset={339} strokeDasharray="339.29 339.29" strokeWidth={10} stroke="hsl(223,90%,40%)" r={54} className="pencil__body3" />
            </g>
            <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
              <g className="pencil__eraser-skew">
                <rect height={30} width={30} ry={5} rx={5} fill="hsl(223,90%,70%)" />
                <rect clipPath="url(#pencil-eraser)" height={30} width={5} fill="hsl(223,90%,60%)" />
                <rect height={20} width={30} fill="hsl(223,10%,90%)" />
                <rect height={20} width={15} fill="hsl(223,10%,70%)" />
                <rect height={20} width={5} fill="hsl(223,10%,80%)" />
                <rect height={2} width={30} y={6} fill="hsla(223,10%,10%,0.2)" />
                <rect height={2} width={30} y={13} fill="hsla(223,10%,10%,0.2)" />
              </g>
            </g>
            <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
              <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)" />
              <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)" />
              <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)" />
            </g>
          </g>
        </svg>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader-container {
    position: fixed; /* Keep it in the center of the screen */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999; /* Make sure it's on top */
    background: 
    padding: 20px;
    border-radius: 10px;
  }

  .pencil {
    display: block;
    width: 10em;
    height: 10em;
  }

  .pencil__body1,
  .pencil__body2,
  .pencil__body3,
  .pencil__eraser,
  .pencil__eraser-skew,
  .pencil__point,
  .pencil__rotate,
  .pencil__stroke {
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .pencil__body1,
  .pencil__body2,
  .pencil__body3 {
    transform: rotate(-90deg);
  }

  .pencil__body1 {
    animation-name: pencilBody1;
  }

  .pencil__body2 {
    animation-name: pencilBody2;
  }

  .pencil__body3 {
    animation-name: pencilBody3;
  }

  .pencil__eraser {
    animation-name: pencilEraser;
    transform: rotate(-90deg) translate(49px, 0);
  }

  .pencil__eraser-skew {
    animation-name: pencilEraserSkew;
    animation-timing-function: ease-in-out;
  }

  .pencil__point {
    animation-name: pencilPoint;
    transform: rotate(-90deg) translate(49px, -30px);
  }

  .pencil__rotate {
    animation-name: pencilRotate;
  }

  .pencil__stroke {
    animation-name: pencilStroke;
    transform: translate(100px, 100px) rotate(-113deg);
  }

  /* Animations */
  @keyframes pencilBody1 {
    from,
    to {
      stroke-dashoffset: 351.86;
      transform: rotate(-90deg);
    }

    50% {
      stroke-dashoffset: 150.8;
      transform: rotate(-225deg);
    }
  }

  @keyframes pencilBody2 {
    from,
    to {
      stroke-dashoffset: 406.84;
      transform: rotate(-90deg);
    }

    50% {
      stroke-dashoffset: 174.36;
      transform: rotate(-225deg);
    }
  }

  @keyframes pencilBody3 {
    from,
    to {
      stroke-dashoffset: 296.88;
      transform: rotate(-90deg);
    }

    50% {
      stroke-dashoffset: 127.23;
      transform: rotate(-225deg);
    }
  }

  @keyframes pencilEraser {
    from,
    to {
      transform: rotate(-45deg) translate(49px, 0);
    }

    50% {
      transform: rotate(0deg) translate(49px, 0);
    }
  }

  @keyframes pencilEraserSkew {
    from,
    32.5%,
    67.5%,
    to {
      transform: skewX(0);
    }

    35%,
    65% {
      transform: skewX(-4deg);
    }

    37.5%,
    62.5% {
      transform: skewX(8deg);
    }

    40%,
    45%,
    50%,
    55%,
    60% {
      transform: skewX(-15deg);
    }

    42.5%,
    47.5%,
    52.5%,
    57.5% {
      transform: skewX(15deg);
    }
  }

  @keyframes pencilPoint {
    from,
    to {
      transform: rotate(-90deg) translate(49px, -30px);
    }

    50% {
      transform: rotate(-225deg) translate(49px, -30px);
    }
  }

  @keyframes pencilRotate {
    from {
      transform: translate(100px, 100px) rotate(0);
    }

    to {
      transform: translate(100px, 100px) rotate(720deg);
    }
  }

  @keyframes pencilStroke {
    from {
      stroke-dashoffset: 439.82;
      transform: translate(100px, 100px) rotate(-113deg);
    }

    50% {
      stroke-dashoffset: 164.93;
      transform: translate(100px, 100px) rotate(-113deg);
    }

    75%,
    to {
      stroke-dashoffset: 439.82;
      transform: translate(100px, 100px) rotate(112deg);
    }
  }
`;


// Checkbox Component
const Checkbox = ({ onClick }) => {
  return (
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
};

const StyledCheckboxWrapper = styled.div`
  position: fixed;
  bottom: 33px; /* Adjust this value to avoid overlap with send button */
  right: 40px; /* Place it in the bottom-right corner */
  z-index: 1000; /* Ensure it's above other elements */

  .container {
    --color: #9d16be;
    --size: 45px;
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
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Add some shadow for better visibility */
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


// SendButton Component
const SendButton = ({ onClick }) => {
  return (
    <StyledSendButtonWrapper>
      <button onClick={onClick}>
        <div className="svg-wrapper-1">
          <div className="svg-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
              <path fill="none" d="M0 0h24v24H0z" />
              <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" />
            </svg>
          </div>
        </div>
        <span>Send</span>
      </button>
    </StyledSendButtonWrapper>
  );
};

const StyledSendButtonWrapper = styled.div`
  position: absolute;
  right: 5.5rem;
  bottom: 1rem;
  
 button {
    font-family: inherit;
    font-size: 16px; /* Reduced font size */
    background: #9d16be;
    color: white;
    padding: 0.9em 0.9em; /* Smaller padding */
    display: flex;
    align-items: center;
    border: none;
    border-radius: 12px; /* Slightly smaller rounded corners */
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
  }
  button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
  }

  button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
  }

  button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }

  button:hover svg {
    transform: translateX(1.2em) rotate(45deg) scale(1.1);
  }

  button:hover span {
    transform: translateX(5em);
  }

  button:active {
    transform: scale(0.95);
  }

  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }

    to {
      transform: translateY(-0.1em);
    }
  }
`;

// Chatbot Component
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [savedChats, setSavedChats] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatTopic, setChatTopic] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  

  const { userData } = useContext(AppContext);
  const displayName =
    userData.role === "admin"
      ? userData.roleData?.name
      : userData.roleData?.firstName;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
  
    const userMessage = { text: input, sender: "user" };
    setInput("");
    setIsLoading(true);
  
    // Add the user message and loader immediately
    if (selectedChat) {
      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, userMessage, { text: "Montoria is typing...", sender: "bot", isLoading: true }],
      }));
    } else {
      setMessages((prevMessages) => [...prevMessages, userMessage, { text: "Montoria is typing...", sender: "bot", isLoading: true }]);
    }
  
    try {
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await response.json();
      if (data?.response) {
        const botMessage = { text: data.response, sender: "bot" };
  
        if (selectedChat) {
          setSelectedChat((prevChat) => ({
            ...prevChat,
            messages: prevChat.messages.filter(msg => !msg.isLoading).concat(botMessage), // Remove loader
          }));
  
          setSavedChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === selectedChat.id ? { ...chat, messages: [...chat.messages, userMessage, botMessage] } : chat
            )
          );
        } else {
          setMessages((prevMessages) =>
            prevMessages.filter(msg => !msg.isLoading).concat(botMessage) // Remove loader
          );
        }
      }
    } catch (error) {
      console.error("Error fetching API response:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const summarizeChatTopic = (messages) => {
    if (messages.length === 0) return "Untitled Chat";

    const maxLength = 5; // Limit topic length
    const userMessages = messages
      .filter(msg => msg.sender === "user")
      .map(msg => msg.text)
      .join(" ")
      .split(" ")
      .slice(0, maxLength)
      .join(" ");

    return userMessages.length > 0 ? userMessages : "Chat Summary";
  };

  const handleSaveChat = () => {
    if (messages.length === 0) return;
  
    // Generate a topic based on the first few messages OR use user input topic
    const topic = chatTopic || messages.slice(0, 3).map(m => m.text).join(" ").substring(0, 50) || `Chat ${new Date().toLocaleTimeString()}`;
  
    setSavedChats((prevChats) => {
      const existingChatIndex = prevChats.findIndex(chat => chat.topic === topic);
  
      if (existingChatIndex !== -1) {
        // If chat exists, update the messages by appending only new ones
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
      } else {
        // If it's a new conversation, save it as a new card
        const newChat = { id: Date.now(), topic, messages: [...messages] };
  
        if (!toast.isActive("chat-saved-toast")) {
          toast.success("Chat saved!", { toastId: "chat-saved-toast", autoClose: 2000 });
        }
  
        return [...prevChats, newChat];
      }
    });
  
    setChatTopic(""); // Reset topic input
  };
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleChatClick = (chat) => {
    setMessages([]); // Clear existing messages
    setSelectedChat(chat);
    setMessages(chat.messages); // Set messages to the selected chat's messages
  };

  const handleCloseSavedChat = () => {
    setSelectedChat(null);
    setMessages([]); // Clear messages when closing the saved chat
  };

  const toggleHelpForm = () => {
    setShowHelpForm((prev) => !prev);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedChat(null);
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
                className="p-3 mb-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                onClick={() => handleChatClick(chat)}
              >
                <p className="text-sm font-semibold">{chat.topic}</p>
                <p className="text-xs text-gray-500">{chat.messages.length} messages</p>
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
                  {msg.sender === "user" && <img src={assets.user_profile} alt="User" className="w-10 h-10 rounded-full" />}
                  {msg.sender === "bot" && <img src={assets.chatbot_logo} alt="Chatbot" className="w-16 h-16 rounded-full self-start" />}
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
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <img src={assets.chatbot_logo} alt="Chatbot" className="w-16 h-16 rounded-full self-start" />
                    <div className="p-3 rounded-3xl max-w-[75%] break-words bg-transparent text-gray-900 self-start text-left mr-auto">
                      <Loader />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="bottom-0 left-0 right-0 p-4 bg-gray-100 flex items-center shadow-lg relative">
          {/* Help Button and HelpForm */}
          <div className="relative">
            <button
              onClick={toggleHelpForm}
              className="p-2 bg-gray-200 rounded-2xl shadow-lg hover:bg-gray-300 transition mr-3"
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
          <button
            onClick={handleNewChat}
            className="p-2 bg-gray-200 rounded-2xl shadow-lg hover:bg-gray-300 transition mr-3"
          >
            <img src={assets.new_chat} alt="New Chat" className="w-10 h-10" />
          </button>

          <input
            type="text"
            className="w-[83%] sm:w-40% p-2 rounded-lg border border-gray-300 outline-none flex-shrink"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />

          {/* Use the Checkbox component */}
          <Checkbox onClick={handleSaveChat} />

          <SendButton onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;