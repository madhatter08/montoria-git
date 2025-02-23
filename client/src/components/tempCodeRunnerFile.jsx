import { useState } from "react";
import { assets } from "../assets/assets";

const menuItems = [
  { label: "CLASS", icon: assets.classes },
  { label: "PROGRESS", icon: assets.progress },
  { label: "LESSON PLAN", icon: assets.lesson_plan },
  { label: "CURRICULUM", icon: assets.curriculum },
];

const SidebarWs = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative">
      {/* Sidebar positioned below the navigation bar */}
      <div
        className={`fixed top-28 left-0 z-30 h-[calc(100vh-4rem)] transition-all duration-300 flex flex-col items-center ${
          isOpen ? "w-55 bg-[#9d16be] p-5" : "w-16 bg-purple-200 p-3"
        }`}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 -right-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition-all"
        >
          <img
            src={isOpen ? assets.sidebar_close : assets.sidebar_open}
            alt="Toggle Sidebar"
            className="w-6 h-6"
          />
        </button>

        {/* Sidebar Content */}
        {isOpen ? (
          <div className="flex flex-col items-center w-full">
            {/* Profile Image */}
            <div className="w-20 h-20 bg-white rounded-full mt-4" />

            {/* Greeting */}
            <div className="text-white text-2xl font-extrabold text-center mt-4">
              HELLO, <br /> GUIDE
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 w-46 flex flex-col gap-3">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center bg-white hover:bg-gray-300 rounded-lg px-3 py-2 text-left text-base font-semibold text-gray-900 shadow-md transition-all"
                >
                  <img
                    className="w-5 h-5 mr-3"
                    src={item.icon}
                    alt={`${item.label} Icon`}
                  />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Admin Info */}
            <div className="absolute bottom-18 w-51 px-2">
              <div className="w-full bg-purple-100 rounded-lg p-2 flex items-center shadow-lg">
                <img
                  src="https://placehold.co/40x40"
                  alt="Admin"
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-gray-900 font-bold pl-2 text-sm">
                  ADMIN <br /> 2021-30028
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Minimized Sidebar (Only Icons)
          <div className="flex flex-col items-center gap-8 mt-53">
            {menuItems.map((item, index) => (
              <img
                key={index}
                className="w-6 h-6 cursor-pointer"
                src={item.icon}
                alt={item.label}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarWs;
