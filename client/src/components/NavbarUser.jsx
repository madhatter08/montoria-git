import { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext"; // Assuming you are using context for user data
import axios from "axios";
import { toast } from "react-toastify";
const NavbarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Assuming AppContext contains the user data with role info
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContext);
  const role = userData ? userData.role : "admin";
  const displayName =
    userData.role === "admin"
      ? userData.roleData?.name?.[0]?.toUpperCase() || "?"
      : userData.roleData?.firstName?.[0]?.toUpperCase() || "?";
  const navigate = useNavigate();

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to check if the current path is active
  const isActive = (path) =>
    location.pathname === path ? "text-purple-600" : "text-gray-900";

  // Define menu items for different roles
  const adminMenu = [
    { name: "Home", path: "/dashboard-admin" },
    { name: "Admission", path: "/admission" },
    { name: "Workspace", path: "/workspace" },
    { name: "Montoria AI", path: "/montoria-ai" },
  ];

  const guideMenu = [
    { name: "Home", path: "/dashboard-guide" },
    { name: "Attendance", path: "/attendance" },
    { name: "Workspace", path: "/workspace" },
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
    <div className="w-full h-full absolute">
      <header className="flex justify-between items-center text-black text-xl py-4 px-4 md:px-16 bg-white drop-shadow-md">
        <a href="/dashboard-admin">
          <img
            className="h-20 hover:scale-105 transition-all"
            src={assets.montoria_home}
            alt="Logo"
          />
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden xl:flex items-center gap-12 font-semibold">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`p-3 hover:text-purple-600 hover:text-2xl rounded-md transition-all cursor-pointer ${isActive(
                item.path
              )}`}
            >
              <a href={item.path}>{item.name}</a>
            </li>
          ))}
        </ul>

        {/* Search Bar */}
        <div className="relative hidden md:flex items-center justify-center gap-3 group hover:scale-103 transition-all">
          <input
            type="text"
            placeholder="Search..."
            className="py-2 pl-5 rounded-full border-2 border-gray-500 group hover:outline-purple-500 focus:outline-purple-500"
          />
          <img
            className="w-5 md:w-5 h-5 md:h-5 absolute right-4 cursor-pointer"
            src={assets.search}
            alt="Search"
          />
        </div>

        {/* User Profile and Logout */}
        <div className="w-8 h-8 hidden lg:flex justify-center items-center rounded-full bg-black text-white relative group hover:scale-110 transition-all">
          {displayName}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm rounded-md">
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10 rounded-md"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>

        {/* Hamburger Menu Icon */}
        <img
          className={`block h-7 w-7 lg:hidden cursor-pointer hover:scale-110 transition-all ${
            isMenuOpen ? "hidden" : "block"
          }`}
          src={assets.mobile_menu}
          alt="Open Menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />

        {/* Close Menu Icon */}
        <img
          className={`block h-7 w-7 lg:hidden cursor-pointer hover:scale-110 transition-all ${
            isMenuOpen ? "block" : "hidden"
          }`}
          src={assets.close}
          alt="Close Menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />

        {/* Mobile Navigation */}
        <div
          className={`absolute xl:hidden top-24 left-0 w-full text-xl bg-white flex flex-col items-center gap-6 font-semibold transform transition-transform ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ transition: "transform 0.3s ease, opacity 0.3s ease" }}
        >
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`list-none w-full text-center p-4 hover:bg-purple-500 hover:text-white transition-all cursor-pointer ${isActive(
                item.path
              )}`}
            >
              <a href={item.path}>{item.name}</a>
            </li>
          ))}
          <li
            className="list-none w-full text-center p-4 hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
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
