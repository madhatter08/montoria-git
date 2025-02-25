import { assets } from "../assets/assets";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const menuItems = [
  { label: "CLASS", icon: assets.classes, path: "/workspace/class" },
  { label: "PROGRESS", icon: assets.progress, path: "/workspace/progress" },
  {
    label: "LESSON PLAN",
    icon: assets.lesson_plan,
    path: "/workspace/lesson-plan",
  },
  {
    label: "CURRICULUM",
    icon: assets.curriculum,
    path: "/workspace/curriculum",
  },
];

const SidebarWs = ({ isOpen, setIsOpen, currentRoute }) => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const displayName =
    userData?.role === "admin"
      ? userData.roleData?.name || "Admin"
      : userData.roleData?.firstName || "Guide";

  const displayRole = userData?.role ? userData.role.toUpperCase() : "UNKNOWN";

  return (
    <div className="relative">
      {/* Sidebar positioned below the navigation bar */}
      <div
        className={`fixed top-28 left-0 z-30 h-[calc(100vh-4rem)] transition-all duration-300 flex flex-col items-center ${
          isOpen ? "w-60 bg-[#9d16be] p-5" : "w-16 bg-purple-200 p-3"
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
              HELLO, <br /> {displayName}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 w-47 flex flex-col gap-3">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)} // Navigate to the corresponding route
                  className={`w-full flex items-center ${
                    currentRoute === item.path
                      ? "bg-purple-200 text-purple-900" // Active button style
                      : "bg-white hover:bg-gray-300 text-gray-900" // Default button style
                  } rounded-lg px-3 py-2 text-left text-base font-semibold shadow-md transition-all`}
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
                  alt="User image"
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-gray-900 font-bold pl-2 text-sm">
                  {displayRole} <br /> 2021-30028
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
                onClick={() => navigate(item.path)} // Navigate to the corresponding route
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

SidebarWs.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Ensure isOpen is a boolean and is required
  setIsOpen: PropTypes.func.isRequired, // Ensure setIsOpen is a function and is required
  currentRoute: PropTypes.string.isRequired, // Ensure currentRoute is a string and is required
};

export default SidebarWs;
