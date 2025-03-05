import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

const CurriculumForm = ({ onClose, refreshData, editData }) => {
  // Initialize state with editData if provided
  const [program, setProgram] = useState(editData?.Program || "");
  const [level, setLevel] = useState(editData?.Level || "");
  const [area, setArea] = useState(editData?.Areas || "");
  const [materials, setMaterials] = useState(editData?.Material || "");
  const [work, setWork] = useState(editData?.Work || "");
  const [lesson, setLesson] = useState(editData?.Lesson || "");

  // Update state when editData changes
  useEffect(() => {
    if (editData) {
      setProgram(editData.Program);
      setLevel(editData.Level);
      setArea(editData.Areas);
      setMaterials(editData.Material);
      setWork(editData.Work);
      setLesson(editData.Lesson);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const curriculumData = {
      Program: program,
      Level: level,
      Areas: area,
      Material: materials,
      Work: work,
      Lesson: lesson,
    };

    try {
      let response;
      if (editData) {
        // Edit existing curriculum
        response = await axios.put(
          `http://localhost:4000/api/school/edit-curriculum/${editData._id}`,
          curriculumData
        );
      } else {
        // Add new curriculum
        response = await axios.post(
          "http://localhost:4000/api/school/add-curriculum",
          curriculumData
        );
      }

      if (response.data.success) {
        toast.success(
          editData
            ? "Curriculum updated successfully!"
            : "Curriculum added successfully!"
        );
        refreshData();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to save curriculum.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const programLevels = {
    Toddler: ["Toddler"],
    Preschool: ["Junior Casa", "Junior Advanced Casa", "Advanced Casa"],
    "Lower Elementary": ["Grade 1", "Grade 2", "Grade 3"],
  };

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-transparent bg-opacity-50 flex items-start justify-center mt-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Curriculum" : "Add New Curriculum"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Program Field */}
          <div className="relative mb-4">
            <label className="relative block">
              <select
                required
                value={program}
                onChange={(e) => {
                  setProgram(e.target.value);
                  setLevel("");
                }}
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
              >
                <option value="">Select Program</option>
                <option value="Toddler">Toddler</option>
                <option value="Preschool">Preschool</option>
                <option value="Lower Elementary">Lower Elementary</option>
              </select>
              <img
                src={assets.person_icon}
                alt="person icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
              />
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8"></span>
            </label>
          </div>

          {/* Level Field */}
          <div className="relative mb-4">
            <label className="relative block">
              <select
                required
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
                disabled={!program}
              >
                <option value="">Select Level</option>
                {programLevels[program]?.map((levelOption) => (
                  <option key={levelOption} value={levelOption}>
                    {levelOption}
                  </option>
                ))}
              </select>
              <img
                src={assets.person_icon}
                alt="person icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
              />
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8"></span>
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
                <option value="Language Arts">Language Arts</option>
                <option value="Math">Math</option>
                <option value="Geometry">Geometry</option>
                <option value="Science">Science</option>
                <option value="Literature">Literature</option>
                <option value="The Great Lesson">The Great Lesson</option>
                <option value="Makabansa">Makabansa</option>
                <option value="Filipino">Filipino</option>
              </select>
              <img
                src={assets.person_icon}
                alt="person icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
              />
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8"></span>
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
                src={assets.person_icon}
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
                src={assets.person_icon}
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
                src={assets.person_icon}
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
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CurriculumForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  editData: PropTypes.object,
};

export default CurriculumForm;
