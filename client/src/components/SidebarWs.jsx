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
  const { userData, loading } = useContext(AppContext);

  // Handle loading state
  if (loading) {
    return (
      <div className="relative">
        <div
          className={`fixed top-28 left-0 z-30 h-[calc(100vh-4rem)] transition-all duration-300 flex flex-col shadow-5xl items-center ${
            isOpen ? "w-60 bg-white p-5" : "w-16 bg-purple-300 p-3"
          }`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-4 -right-6 bg-white p-2 rounded-full shadow-xl hover:bg-gray-200 transition-all"
          >
            <img
              src={isOpen ? assets.sidebar_close : assets.sidebar_open}
              alt="Toggle Sidebar"
              className="w-6 h-6"
            />
          </button>
          <p className="mt-20 text-gray-700">...</p>
        </div>
      </div>
    );
  }

  // Handle no userData (not logged in)
  if (!userData) {
    return (
      <div className="relative">
        <div
          className={`fixed top-28 left-0 z-30 h-[calc(100vh-4rem)] transition-all duration-300 flex flex-col shadow-5xl items-center ${
            isOpen ? "w-60 bg-white p-5" : "w-16 bg-purple-300 p-3"
          }`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-4 -right-6 bg-white p-2 rounded-full shadow-xl hover:bg-gray-200 transition-all"
          >
            <img
              src={isOpen ? assets.sidebar_close : assets.sidebar_open}
              alt="Toggle Sidebar"
              className="w-6 h-6"
            />
          </button>
          {isOpen && (
            <p className="mt-20 text-gray-700">
              Please log in to access the workspace.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Safe to access userData now
  const displayName =
    userData.role === "admin"
      ? userData.roleData?.name || "Admin"
      : userData.roleData?.firstName || "Guide";
  const displayRole = userData.role ? userData.role.toUpperCase() : "UNKNOWN";
  const displaySchoolId = userData.schoolid ? userData.schoolid : "???"; // Updated to schoolid

  return (
    <div className="relative">
      {/* Sidebar positioned below the navigation bar */}
      <div
        className={`fixed top-28 left-0 z-30 h-[calc(100vh-4rem)] transition-all duration-300 flex flex-col shadow-5xl items-center ${
          isOpen ? "w-60 bg-white p-5" : "w-16 bg-purple-300 p-3"
        }`}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 -right-6 bg-white p-2 rounded-full shadow-xl hover:bg-gray-200 transition-all"
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
            <div className="w-20 h-20 bg-[#bababa] rounded-full mt-4" />

            {/* Greeting */}
            <div className="text-black text-2xl font-bold text-center mt-4">
              HELLO, <br /> {displayName}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 w-47 flex flex-col gap-3">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center ${
                    currentRoute === item.path
                      ? "bg-purple-200 text-[#4A154B]" // Active button style
                      : "text-gray-700 hover:bg-purple-100" // Default button style
                  } rounded-lg px-3 py-2 text-left text-base font-semibold cursor-pointer transition-all`}
                >
                  <img
                    className={`w-5 h-5 mr-3 ${
                      currentRoute === item.path
                        ? "text-purple-900"
                        : "text-gray-700"
                    } hover:text-[#4A154B]`}
                    src={item.icon}
                    alt={`${item.label} Icon`}
                  />
                  <span className="hover:text-black">{item.label}</span>
                </div>
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
                  {displayRole} <br /> {displaySchoolId}
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
                className="w-6 h-6 cursor-pointer text-gray-700 hover:text-[#4A154B]"
                src={item.icon}
                alt={item.label}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

SidebarWs.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  currentRoute: PropTypes.string.isRequired,
};

export default SidebarWs;