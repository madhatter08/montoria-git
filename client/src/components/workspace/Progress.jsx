import { useState } from "react";
import { assets } from "../../assets/assets";

// Mock RemarksForm component (replace with your actual form component)
const RemarksForm = ({ onClose, onSave, initialRemarks }) => {
  const [remarks, setRemarks] = useState(initialRemarks || "");

  const handleSave = () => {
    onSave(remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-5xl border w-96">
        <h2 className="text-xl font-bold mb-4">Edit Remarks</h2>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full h-24 p-2 border rounded-lg"
          placeholder="Enter remarks..."
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#9d16be] text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Progress = () => {
  const [progress, setProgress] = useState(
    Array(15).fill({ presented: false, practiced: false, mastered: false, remarks: "" })
  );
  const [selectedStudent, setSelectedStudent] = useState("STUDENT NAME");
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null); // Track which row's remarks form is open
  const [feedback, setFeedback] = useState(Array(4).fill(Array(3).fill(""))); // Feedback for each week in each quarter
  const [selectedWeek, setSelectedWeek] = useState(Array(4).fill(null)); // Track selected week for each quarter

  // Calculate counts for Presented, Practiced, Mastered, and Total
  const countPresented = progress.filter((row) => row.presented).length;
  const countPracticed = progress.filter((row) => row.practiced).length;
  const countMastered = progress.filter((row) => row.mastered).length;
  const totalWorks = progress.length; // Total number of works

  const handleCheckboxChange = (index, field) => {
    setProgress((prev) => {
      const newProgress = [...prev];
      const row = { ...newProgress[index] };

      if (field === "presented") {
        row.presented = !row.presented;
        if (!row.presented) {
          row.practiced = false;
          row.mastered = false;
        }
      } else if (field === "practiced" && row.presented) {
        row.practiced = !row.practiced;
        if (!row.practiced) {
          row.mastered = false;
        }
      } else if (field === "mastered" && row.presented && row.practiced) {
        row.mastered = !row.mastered;
      }

      newProgress[index] = row;
      return newProgress;
    });
  };

  const handleEditRemarks = (index) => {
    setEditIndex(index); // Open the remarks form for the specific row
  };

  const handleSaveRemarks = (index, remarks) => {
    setProgress((prev) => {
      const newProgress = [...prev];
      newProgress[index].remarks = remarks;
      return newProgress;
    });
    setEditIndex(null); // Close the remarks form
  };

  const handleFeedbackChange = (quarterIndex, weekIndex, value) => {
    setFeedback((prev) => {
      const newFeedback = [...prev];
      newFeedback[quarterIndex] = [...newFeedback[quarterIndex]];
      newFeedback[quarterIndex][weekIndex] = value;
      return newFeedback;
    });
  };

  const handleSaveFeedback = (quarterIndex, weekIndex) => {
    alert(`Feedback for Quarter ${quarterIndex + 1}, Week ${weekIndex + 1} saved: ${feedback[quarterIndex][weekIndex]}`);
  };

  const handleWeekSelection = (quarterIndex, weekIndex) => {
    setSelectedWeek((prev) => {
      const newSelectedWeek = [...prev];
      newSelectedWeek[quarterIndex] = weekIndex;
      return newSelectedWeek;
    });
  };

  return (
    <div className="mt-30 flex-grow bg-cover bg-center p-4 overflow-auto">
      {/* Header Section */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-8">
          <div className="text-black font-bold text-2xl lg:text-4xl whitespace-nowrap">
            {selectedStudent}
          </div>
          <select className="w-full lg:w-48 h-12 bg-[#d9d9d9] rounded-[15px] px-4">
            <option>CLASS</option>
          </select>
          <select
            className="w-full lg:w-48 h-12 bg-[#d9d9d9] rounded-[15px] px-4"
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="STUDENT NAME">STUDENTS</option>
            <option value="Aenjelle Cabrales">Aenjelle Cabrales</option>
            <option value="Leah Manalo">Leah Manalo</option>
            <option value="Ashley Avecilla">Ashley Avecilla</option>
          </select>
          <select className="w-full lg:w-48 h-12 bg-[#d9d9d9] rounded-[15px] px-4">
            <option>LEARNING AREA</option>
          </select>
          <div className="relative w-full lg:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-12 bg-[#d9d9d9] rounded-[15px] px-4 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img
              src={assets.search}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
          </div>
        </div>
      </div>

      {/* Count Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#3cd416] p-4 rounded-lg shadow text-center">
          <p className="text-lg font-bold">{countPresented}</p>
          <p className="text-sm text-black">Presented</p>
        </div>
        <div className="bg-[#e5a91b] p-4 rounded-lg shadow text-center">
          <p className="text-lg font-bold">{countPracticed}</p>
          <p className="text-sm text-black">Practiced</p>
        </div>
        <div className="bg-purple-400 p-4 rounded-lg shadow text-center">
          <p className="text-lg font-bold">{countMastered}</p>
          <p className="text-sm text-black">Mastered</p>
        </div>
        <div className="bg-[#aeadad] p-4 rounded-lg shadow text-center">
          <p className="text-lg font-bold">{totalWorks}</p>
          <p className="text-sm text-black ">Total</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-[#9d16be] text-white">
            <tr>
              <th className="p-3 text-center w-1/6">WORK</th>
              <th className="p-3 text-center w-1/12">PRESENTED</th>
              <th className="p-3 text-center w-1/12">PRACTICED</th>
              <th className="p-3 text-center w-1/12">MASTERED</th>
              <th className="p-3 text-center w-1/6">REMARKS</th>
              <th className="p-3 text-center w-1/8">DATE PRESENTED</th>
              <th className="p-3 text-center w-1/8">DATE MASTERED</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((row, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">Work {index + 1}</td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#3cd416] checked:border-gray"
                    checked={row.presented}
                    onChange={() => handleCheckboxChange(index, "presented")}
                  />
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#e5a91b] checked:border-gray"
                    checked={row.practiced}
                    onChange={() => handleCheckboxChange(index, "practiced")}
                    disabled={!row.presented}
                  />
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#c32cdd] checked:border-black"
                    checked={row.mastered}
                    onChange={() => handleCheckboxChange(index, "mastered")}
                    disabled={!row.presented || !row.practiced}
                  />
                </td>
                <td className="p-3 relative">
                  {row.remarks || "-"}
                  <button
                    onClick={() => handleEditRemarks(index)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <img src={assets.edit} alt="Edit" className="w-5 h-5" />
                  </button>
                </td>
                <td className="p-3">-</td>
                <td className="p-3">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quarters Section */}
      <div className="mt-8">
        <div className="bg-[#9d16be] text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">Feedback</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {Array.from({ length: 4 }).map((_, quarterIndex) => (
            <div key={quarterIndex} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-bold mb-4">Quarter {quarterIndex + 1}</h3>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                onChange={(e) => handleWeekSelection(quarterIndex, parseInt(e.target.value))}
              >
                <option value="">Select Week</option>
                {Array.from({ length: 3 }).map((_, weekIndex) => (
                  <option key={weekIndex} value={weekIndex}>
                    Week {weekIndex + 1}
                  </option>
                ))}
              </select>
              {selectedWeek[quarterIndex] !== null && (
                <div className="border border-gray-300 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Week {selectedWeek[quarterIndex] + 1}</h4>
                  <textarea
                    value={feedback[quarterIndex][selectedWeek[quarterIndex]]}
                    onChange={(e) =>
                      handleFeedbackChange(quarterIndex, selectedWeek[quarterIndex], e.target.value)
                    }
                    className="w-full h-24 p-2 border rounded-lg"
                    placeholder="Enter feedback..."
                  />
                  <button
                    onClick={() => handleSaveFeedback(quarterIndex, selectedWeek[quarterIndex])}
                    className="mt-2 bg-[#9d16be] text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Remarks Form Modal */}
      {editIndex !== null && (
        <RemarksForm
          onClose={() => setEditIndex(null)}
          onSave={(remarks) => handleSaveRemarks(editIndex, remarks)}
          initialRemarks={progress[editIndex].remarks}
        />
      )}
    </div>
  );
};

export default Progress;