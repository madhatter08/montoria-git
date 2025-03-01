import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white drop-shadow-md">
      <div className="flex justify-between items-center py-4 px-6 md:px-16 bg-white rounded-md">
        {/* Logo at the Left */}
        <a href="/">
          <img
            className="h-16 hover:scale-105 transition-all"
            src={assets.montoria_home}
            alt="Montoria Logo"
          />
        </a>

        {/* Login Button at the Right */}
        <button
          className="text-white bg-[#9d16be] px-6 py-2 rounded-full hover:bg-[#b074c2] transition"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
