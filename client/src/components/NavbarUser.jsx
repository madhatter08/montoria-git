import { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext"; // Assuming you are using context for user data
import axios from "axios";
import { toast } from "react-toastify";
const NavbarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const location = useLocation();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);
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
  const isActive = (path) => {
    //return location.pathname === path ? "text-purple-600" : "text-gray-900";
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
              className={`p-3 text-3xl hover:text-purple-600 hover:text-4xl rounded-md transition-all cursor-pointer relative ${
                isActive(item.path) ||
                (item.submenu && item.submenu.some((sub) => isActive(sub.path)))
                  ? "text-purple-600"
                  : "text-gray-900"
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
                      className={`p-2 hover:bg-purple-100 rounded-md transition-all text-base text-xl ${
                        isActive(sub.path) ? "text-purple-600" : "text-gray-900"
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

        {/* User Profile and Logout */}
        <div className="w-8 h-8 hidden xl:flex justify-center items-center rounded-full bg-black text-white relative group hover:scale-110 hover:bg-[#9d16be] transition-all">
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
              className={`list-none w-full text-center text-2xl p-4 hover:bg-purple-500 hover:text-white transition-all cursor-pointer ${
                isActive(item.path) ||
                (item.submenu && item.submenu.some((sub) => isActive(sub.path)))
                  ? "text-purple-600"
                  : "text-gray-900"
              }`}
            >
              <a href={item.path}>{item.name}</a>
              {/* Workspace Dropdown for Mobile */}
              {item.submenu && (
                <ul className="mt-2">
                  {item.submenu.map((sub) => (
                    <li
                      key={sub.name}
                      className={`p-2 hover:bg-purple-100 hover:text-purple-500 rounded-md transition-all text-lg ${
                        isActive(sub.path) ? "outline-1" : "text-gray-700"
                      }`}
                    >
                      <a href={sub.path}>{sub.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li
            className="list-none w-full text-2xl text-center p-4 hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
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
