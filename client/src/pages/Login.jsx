import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);
  const [schoolId, setSchoolId] = useState(""); // Changed to schoolId
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending login request:", { schoolId, password }); // Debug
      const { data } = await axios.post(
        `${backendUrl}/api/auth/login`,
        { schoolId, password }, // Changed to schoolId
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Ensure cookies are sent/received
        }
      );

      console.log("Login response:", data); // Debug log

      if (data.success) {
        setIsLoggedIn(true);
        await getUserData(); // Wait for user data fetch
        const role = data.role; // Match server response
        switch (role) {
          case "admin":
            navigate("/dashboard-admin");
            break;
          case "guide":
            navigate("/dashboard-guide");
            break;
          case "student":
            navigate("/dashboard-student");
            break;
          default:
            toast.error("Invalid user role");
            return;
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleEmailClick = () => {
    const recipient = "montoria.montessori@gmail.com";
    const subject = "Having Trouble Accessing My Account";
    const body = `Hello,\n\nI am experiencing issues accessing my account. Here are my details:\n\n- School ID: ${schoolId}\n- Issue Description: Unable to login despite correct credentials\n- Steps Taken: Entered school ID and password, cleared cache\n\nPlease assist me in resolving this matter.\n\nThank you,\n[Your Name]`;
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover px-6 sm:px-0"
      style={{ backgroundImage: `url(${assets.login_bg})`, backgroundPosition: "center 50%" }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
        <img
          onClick={() => navigate("/")}
          src={assets.montoria_home}
          alt="montoria logo"
          className="absolute left-5 sm:left-20 top-5 w-36 sm:w-48 hover:scale-110 cursor-pointer transition-all"
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="bg-white shadow-5xl p-10 rounded-lg shadow-lg w-full max-w-2xl flex">
          {/* Left Column - Logo */}
          <div className="hidden sm:flex items-center justify-center w-1/2 p-5">
            <img src={assets.montoria1} alt="Montoria Logo" className="max-w-full h-auto" />
          </div>

          {/* Right Column - Form */}
          <div className="w-full sm:w-1/2 text-black text-sm">
            <h2 className="text-3xl font-bold text-[#9d16be] text-center mb-2 mt-">LOGIN</h2>
            <p className="text-center text-sm mb-8">Login to your account</p>

            <form onSubmit={onSubmitHandler}>
              <label className="relative block">
                <input
                  required
                  onChange={(e) => setSchoolId(e.target.value)}
                  value={schoolId}
                  type="text"
                  className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
                />
                <img
                  src={assets.person_icon}
                  alt="person icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
                />
                <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 bg-white peer-focus:-translate-y-8 ml-2 transition-all">
                  School ID
                </span>
              </label>

              <label className="relative block mt-4">
                <input
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
                />
                <img
                  src={assets.lock_icon}
                  alt="lock icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
                />
                <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 bg-white peer-focus:-translate-y-8 ml-2 transition-all">
                  Password
                </span>
              </label>

              <p
                onClick={() => navigate("/reset-password")}
                className="mb-5 mt-2 pl-3 text-[#9d16be] cursor-pointer italic"
              >
                Forgot password?
              </p>
              <button className="w-full mt-2 py-2.5 rounded-full bg-gradient-to-r from-purple-400 to-[#9d16be] text-white font-medium">
                Login
              </button>
              <p className="text-gray-400 text-center text-xs mt-4">
                Can&apos;t access your account?{" "}
                <span onClick={handleEmailClick} className="text-[#9d16be] cursor-pointer underline">
                  Contact us
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;