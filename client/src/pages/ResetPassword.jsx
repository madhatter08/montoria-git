import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSet] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  // Cursor goes to next box when typing OTP
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handles backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handles paste
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSet(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover px-6 sm:px-0" style={{ backgroundImage: `url(${assets.login_bg})`, backgroundPosition: "center 50%" }}>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
        <img
          onClick={() => navigate("/login")}
          src={assets.montoria_home}
          alt="montoria logo"
          className="absolute left-5 sm:left-20 top-5 w-36 sm:w-48 hover:scale-110 cursor-pointer transition-all"
        />
      </div>

      <div className="relative bg-white shadow-5xl p-10 rounded-lg shadow-lg w-full max-w-md">
  {/* Back Button - Positioned inside the modal */}
  <div className="absolute top-4 left-4">
    <img
      onClick={() => navigate("/login")}
      src={assets.back_icon} // Replace with your back icon asset
      alt="back icon"
      className="w-6 h-6 hover:scale-110 cursor-pointer transition-all"
    />
  </div>

        {/* Enter Email Form */}
        {!isEmailSent && (
          <form
            onSubmit={onSubmitEmail}
            className="bg-white p-8 rounded-lg w-96 text-sm relative"
          >
            <h1 className="text-[#9d16be] text-2xl font-bold text-center mb-4">
             RESET PASSWORD
            </h1>
            <p className="text-center mb-6 text-[#9d16be]">
              Enter your registered email address.
            </p>
            <label className="relative block">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
                required
              />
              <img src={assets.mail_icon} alt="mail icon" className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1" />
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                Email
              </span>
            </label>
            <button className="w-full py-2.5 bg-gradient-to-r from-purple-400 to-[#9d16be] text-white rounded-full mt-6">
              Submit
            </button>
          </form>
        )}

        {/* Enter OTP Form */}
        {!isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitOtp}
            className="bg-white p-8 rounded-lg shadow-lg w-96 text-sm relative"
          >
            <h1 className="text-[#9d16be] text-2xl font-semibold text-center mb-4">
              Reset Password OTP
            </h1>
            <p className="text-center mb-6 text-[#9d16be]">
              Enter the 6-digit code sent to your email.
            </p>
            <div className="flex justify-between mb-8" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    required
                    className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-purple-400 to-[#9d16be] text-white rounded-full">
              Reset Password
            </button>
          </form>
        )}

        {/* Enter New Password Form */}
        {isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitNewPassword}
            className="bg-white p-8 rounded-lg shadow-lg w-96 text-sm relative"
          >
            <h1 className="text-[#9d16be] text-2xl font-semibold text-center mb-4">
              New Password
            </h1>
            <p className="text-center mb-6 text-[#9d16be]">
              Enter your new password below.
            </p>
            <label className="relative block">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
                required
              />
              <img src={assets.lock_icon} alt="lock icon" className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1" />
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                New Password
              </span>
            </label>
            <button className="w-full py-2.5 bg-gradient-to-r from-purple-400 to-[#9d16be] text-white rounded-full mt-6">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;