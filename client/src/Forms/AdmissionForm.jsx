import { useState } from "react";
import styled from "styled-components";

// Styled Delete Button Component
const DeleteButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 14" className="svgIcon bin-top">
          <g clipPath="url(#clip0_35_24)">
            <path fill="black" d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z" />
          </g>
          <defs>
            <clipPath id="clip0_35_24">
              <rect fill="white" height={14} width={69} />
            </clipPath>
          </defs>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 57" className="svgIcon bin-bottom">
          <g clipPath="url(#clip0_35_22)">
            <path fill="black" d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z" />
          </g>
          <defs>
            <clipPath id="clip0_35_22">
              <rect fill="white" height={57} width={69} />
            </clipPath>
          </defs>
        </svg>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgb(20, 20, 20);
    border: none;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;
    gap: 2px;
  }

  .svgIcon {
    width: 12px;
    transition-duration: 0.3s;
  }

  .svgIcon path {
    fill: white;
  }

  .button:hover {
    transition-duration: 0.3s;
    background-color: rgb(255, 69, 69);
    align-items: center;
    gap: 0;
  }

  .bin-top {
    transform-origin: bottom right;
  }
  .button:hover .bin-top {
    transition-duration: 0.5s;
    transform: rotate(160deg);
  }
`;

const AdmissionForm = ({ onClose }) => {
  const [program, setProgram] = useState("");
  const [level, setLevel] = useState("");
  const [learningAreas, setLearningAreas] = useState(Array(5).fill("")); // Minimum 5 learning areas
  const [selectedClass, setSelectedClass] = useState("");
  const [error, setError] = useState("");

  const handleLearningAreaChange = (index, value) => {
    const newLearningAreas = [...learningAreas];
    newLearningAreas[index] = value;
    setLearningAreas(newLearningAreas);
  };

  const addLearningArea = () => {
    if (learningAreas.length < 9) {
      setLearningAreas([...learningAreas, ""]);
    }
  };

  const removeLearningArea = (index) => {
    if (learningAreas.length > 5) {
      const newLearningAreas = learningAreas.filter((_, i) => i !== index);
      setLearningAreas(newLearningAreas);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!program || !level || !selectedClass) {
      setError("Please fill out all required fields.");
      return;
    }

    if (learningAreas.filter((area) => area.trim() !== "").length < 5) {
      setError("Please fill out at least 5 learning areas.");
      return;
    }

    // Submit logic (e.g., API call)
    const formData = {
      program,
      level,
      learningAreas: learningAreas.filter((area) => area.trim() !== ""),
      class: selectedClass,
    };
    console.log("Form Data:", formData);

    // Close the form
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Admission Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Program Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Program *</label>
            <input
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter Program"
              required
            />
          </div>

          {/* Level Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Level *</label>
            <input
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter Level"
              required
            />
          </div>

          {/* Learning Areas Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Learning Areas *</label>
            {learningAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={area}
                  onChange={(e) => handleLearningAreaChange(index, e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder={`Learning Area ${index + 1}`}
                  required={index < 5} // First 5 fields are required
                />
                {learningAreas.length > 5 && (
                  <DeleteButton onClick={() => removeLearningArea(index)} />
                )}
              </div>
            ))}
            {learningAreas.length < 9 && (
              <button
                type="button"
                onClick={addLearningArea}
                className="p-2 bg-purple-400 text-white rounded-lg hover:bg-purple-600"
              >
                Add Learning Area
              </button>
            )}
          </div>

          {/* Class Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Class *</label>
            <input
              type="text"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter Class"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Form Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#9d16be] text-white rounded-lg hover:bg-[#7a128f]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;