import React from "react";
import { assets } from "../assets/assets"; // Ensure you import the assets

const AdminForm = ({ onClose }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Admin Form</h2>
      <form className="grid grid-cols-2 gap-4">
        {/* School ID */}
        <div className="relative block">
          <label className="relative block">
            <input
              required
              type="text"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.person_icon} // Replace with appropriate icon if needed
              alt="person icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              School ID
            </span>
          </label>
        </div>

        {/* Name */}
        <div className="relative">
          <label className="relative block">
            <input
              required
              type="text"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.person_icon} // Replace with appropriate icon if needed
              alt="person icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Name
            </span>
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <label className="relative block">
            <input
              required
              type="email"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.email_icon} // Replace with appropriate icon if needed
              alt="email icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Email
            </span>
          </label>
        </div>

        {/* Phone Number */}
        <div className="relative">
          <label className="relative block">
            <input
              required
              type="tel"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.phone_icon} // Replace with appropriate icon if needed
              alt="phone icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Phone Number
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-[#9d16be] hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#9d16be] text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;