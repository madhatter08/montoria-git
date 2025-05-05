import { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const NavbarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn, loading, remarks = [] } = useContext(AppContext);

  // Handle loading state
  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full z-50 bg-white drop-shadow-md py-4 px-4 md:px-16">
        <span>Loading...</span>
      </div>
    );
  }

  // Handle no userData (not logged in)
  if (!userData) {
    return (
      <div className="fixed top-0 left-0 w-full z-50 bg-white drop-shadow-md py-4 px-4 md:px-16">
        <a href="/">
          <img
            className="h-20 hover:scale-105 transition-all"
            src={assets.montoria_home}
            alt="Logo"
          />
        </a>
      </div>
    );
  }

  // Safe to access userData now
  const role = userData.role || "admin";
  const displayName =
    role === "admin"
      ? userData.roleData?.name?.[0]?.toUpperCase() || "?"
      : userData.roleData?.firstName?.[0]?.toUpperCase() || "?";

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to check if the current path is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // Define menu items for different roles
  const adminMenu = [
    { name: "Home", path: "/dashboard-admin" },
    { name: "Admission", path: "/admission" },
    {
      name: "Workspace",
      path: "/workspace/class",
      submenu: [
        { name: "Class", path: "/workspace/class" },
        { name: "Progress", path: "/workspace/progress" },
        { name: "Lesson Plan", path: "/workspace/lesson-plan" },
        { name: "Curriculum", path: "/workspace/curriculum" },
      ],
    },
    { name: "Montoria AI", path: "/montoria-ai" },
  ];

  const guideMenu = [
    { name: "Home", path: "/dashboard-guide" },
    { name: "Attendance", path: "/attendance" },
    {
      name: "Workspace",
      path: "/workspace/class",
      submenu: [
        { name: "Class", path: "/workspace/class" },
        { name: "Progress", path: "/workspace/progress" },
        { name: "Lesson Plan", path: "/workspace/lesson-plan" },
        { name: "Curriculum", path: "/workspace/curriculum" },
      ],
    },
    { name: "Montoria AI", path: "/montoria-ai" },
  ];

  const studentMenu = [
    { name: "Home", path: "/dashboard-student" },
    { name: "Progress", path: "/progress" },
    { name: "Schedule", path: "/schedule" },
    { name: "Profile", path: "/profile" },
  ];

  // Choose the menu based on role
  const menuItems =
    role === "admin" ? adminMenu : role === "guide" ? guideMenu : studentMenu;

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white drop-shadow-md">
      <header className="flex justify-between items-center text-black py-4 px-4 md:px-16 bg-white drop-shadow-md">
        <a href="#">
          <img
            className="h-20 hover:scale-105 transition-all"
            src={assets.montoria_home}
            alt="Logo"
          />
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden xl:flex items-center gap-8 font-semibold">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`p-3 text-3xl hover:text-[#4A154B] hover:text-4xl rounded-md transition-all cursor-pointer relative ${
                isActive(item.path) ||
                (item.submenu && item.submenu.some((sub) => isActive(sub.path)))
                  ? "text-[#4A154B]"
                  : "text-gray-600"
              }`}
              onMouseEnter={() => item.submenu && setIsWorkspaceOpen(true)}
              onMouseLeave={() => item.submenu && setIsWorkspaceOpen(false)}
            >
              <a href={item.path}>{item.name}</a>
              {/* Workspace Dropdown */}
              {item.submenu && isWorkspaceOpen && (
                <ul className="absolute top-12 left-0 bg-white shadow-lg rounded-lg p-2 w-48">
                  {item.submenu.map((sub) => (
                    <li
                      key={sub.name}
                      className={`p-2 hover:bg-[#4A154B] hover:text-white rounded-md transition-all text-xl ${
                        isActive(sub.path)
                          ? "outline-1 text-[#4A154B]"
                          : "text-gray-600"
                      }`}
                    >
                      <a href={sub.path}>{sub.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* User Profile, Notifications, and Logout */}
        <div className="flex items-center gap-4">
          {/* Notification Icon (Admin Only) */}
          {role === "admin" && (
            <div className="relative">
              <div
                className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 text-black cursor-pointer hover:bg-[#4A154B] hover:text-white transition-all"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {remarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {remarks.length}
                  </span>
                )}
              </div>
              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-4 w-80 max-h-96 overflow-y-auto z-10">
                  {remarks.length === 0 ? (
                    <p className="text-gray-600 text-sm">No new remarks</p>
                  ) : (
                    remarks.map((remark, index) => (
                      <div
                        key={index}
                        className="p-3 mb-2 bg-gray-100 rounded-md text-sm"
                      >
                        <p>
                          <strong>{remark.addedBy}</strong> added a remark for{" "}
                          <strong>{remark.targetUser}</strong> on lesson{" "}
                          <strong>{remark.lesson}</strong>:
                        </p>
                        <p className="text-gray-600 mt-1">{remark.content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Profile and Logout */}
          <div className="w-8 h-8 hidden xl:flex justify-center items-center rounded-full bg-black text-white relative group hover:scale-110 hover:bg-[#4A154B] transition-all">
            {displayName}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black pt-10">
              <ul className="list-none m-0 p-2 bg-gray-100 text-base rounded-md">
                <li
                  onClick={logout}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10 rounded-md"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hamburger Menu Icon */}
        <img
          className={`block h-7 w-7 xl:hidden cursor-pointer hover:scale-110 transition-all ${
            isMenuOpen ? "hidden" : "block"
          }`}
          src={assets.mobile_menu}
          alt="Open Menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />

        {/* Close Menu Icon */}
        <img
          className={`block h-7 w-7 xl:hidden cursor-pointer hover:scale-110 transition-all ${
            isMenuOpen ? "block" : "hidden"
          }`}
          src={assets.close}
          alt="Close Menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />

        {/* Mobile Navigation */}
        <div
          className={`fixed xl:hidden top-24 left-0 w-full bg-white flex flex-col items-center font-semibold transform transition-transform ${
            isMenuOpen ? "z-80 opacity-100" : "z-10 hidden"
          }`}
          style={{
            transition: "transform 0.3s ease, opacity 0.3s ease",
            zIndex: 60,
          }}
        >
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`list-none w-full text-center text-2xl p-4 hover:bg-[#4A154B] hover:text-white transition-all cursor-pointer ${
                isActive(item.path) ||
                (item.submenu && item.submenu.some((sub) => isActive(sub.path)))
                  ? "text-[#4A154B]"
                  : "text-gray-600"
              }`}
            >
              <a href={item.path}>{item.name}</a>
              {/* Workspace Dropdown for Mobile */}
              {item.submenu && (
                <ul className="mt-2">
                  {item.submenu.map((sub) => (
                    <li
                      key={sub.name}
                      className={`p-2 hover:bg-[#4A154B] hover:text-white rounded-md transition-all text-lg ${
                        isActive(sub.path) ? "outline-1" : "text-gray-600"
                      }`}
                    >
                      <a href={sub.path}>{sub.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          {role === "admin" && (
            <li
              className="list-none w-full text-2xl text-center p-4 hover:bg-[#4A154B] hover:text-white transition-all cursor-pointer"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              Notifications {remarks.length > 0 && `(${remarks.length})`}
            </li>
          )}
          <li
            className="list-none w-full text-2xl text-center p-4 hover:bg-[#4A154B] hover:text-white transition-all cursor-pointer"
            onClick={logout}
          >
            Logout
          </li>
        </div>
      </header>
    </div>
  );
};

export default NavbarUser;