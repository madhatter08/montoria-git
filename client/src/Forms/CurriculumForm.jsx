import React, { useState } from "react";
import { assets } from "../assets/assets"; // Ensure you import the assets

const CurriculumForm = ({ onAdd, onClose }) => {
  const [level, setLevel] = useState("");
  const [area, setArea] = useState("");
  const [materials, setMaterials] = useState("");
  const [work, setWork] = useState("");
  const [lesson, setLesson] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ level, area, materials, work, lesson });
    onClose();
  };

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-transparent bg-opacity-50 flex items-start justify-center mt-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Curriculum</h2>
        <form onSubmit={handleSubmit}>
          {/* Level Field */}
          <div className="relative mb-4">
            <label className="relative block">
              <select
                required
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
              >
                <option value="">Select Level</option>
                <option value="Toddler">Toddler</option>
                <option value="Preschool">Preschool</option>
                <option value="Lower Elementary">Lower Elementary</option>
              </select>
              <img
                src={assets.person_icon} // Replace with appropriate icon if needed
                alt="person icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
              />
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                
              </span>
            </label>
          </div>

          {/* Learning Area Field */}
          <div className="relative mb-4">
            <label className="relative block">
              <select
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
              >
                <option value="">Select Learning Area</option>
                <option value="Language">Language</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="Literature">Literature</option>
              </select>
              <img
                src={assets.person_icon} // Replace with appropriate icon if needed
                alt="person icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
              />
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                
              </span>
            </label>
          </div>

          {/* Materials Field */}
          <div className="relative mb-4">
            <label className="relative block">
              <input
                required
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
                
              />
              <img
                src={assets.person_icon} // Replace with appropriate icon if needed
                alt="person icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
              />
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                Materials
              </span>
            </label>
          </div>

          {/* Work Field */}
          <div className="relative mb-4">
            <label className="relative block">
              <input
                required
                type="text"
                value={work}
                onChange={(e) => setWork(e.target.value)}
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
                
              />
              <img
                src={assets.person_icon} // Replace with appropriate icon if needed
                alt="person icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
              />
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                Work
              </span>
            </label>
          </div>

          {/* Lesson Field */}
          <div className="relative mb-4">
            <label className="relative block">
              <input
                required
                type="text"
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
               
              />
              <img
                src={assets.person_icon} // Replace with appropriate icon if needed
                alt="person icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
              />
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                Lesson
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#9d16be] text-white rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurriculumForm;