import { useState, useEffect } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import CurriculumForm from "../../Forms/CurriculumForm";
import styled from "styled-components";
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal";

const Curriculum = () => {
  const [selectedLearningArea, setSelectedLearningArea] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Toddler");
  const [showForm, setShowForm] = useState(false);
  const [curriculumData, setCurriculumData] = useState({
    Toddler: [],
    Preschool: [],
    LowerElementary: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editData, setEditData] = useState(null);

  // Fetch curriculum data from the backend
  const fetchCurriculumData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/school/get-curriculum"
      );
      if (res.data.success) {
        const data = res.data.data;

        // Separate data by level
        const toddlerData = data.filter(
          (item) => item.Program.trim() === "Toddler"
        );
        const preschoolData = data.filter(
          (item) => item.Program.trim() === "Preschool"
        );
        const lowerElementaryData = data.filter(
          (item) => item.Program.trim() === "Lower Elementary"
        );

        setCurriculumData({
          Toddler: toddlerData,
          Preschool: preschoolData,
          LowerElementary: lowerElementaryData,
        });
        //toast.success("Curriculum data refreshed successfully!");
      } else {
        setError("Failed to fetch curriculum data.");
        toast.error("Failed to fetch curriculum data.");
      }
    } catch (err) {
      setError("Error fetching curriculum data.");
      toast.error("Error fetching curriculum data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCurriculumData();
  }, []);

  const refreshData = () => {
    fetchCurriculumData();
  };

  const handleLearningAreaChange = (e) => {
    setSelectedLearningArea(e.target.value);
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openDeleteModal = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const res = await axios.delete(
        `http://localhost:4000/api/school/delete-curriculum/${itemToDelete}`
      );
      if (res.data.success) {
        // Update local state
        const updatedCurriculum = {
          ...curriculumData,
          [activeTab]: curriculumData[activeTab].filter(
            (item) => item._id !== itemToDelete
          ),
        };
        setCurriculumData(updatedCurriculum);
        toast.success("Curriculum deleted successfully!"); // Success toast
      } else {
        toast.error("Failed to delete curriculum."); // Error toast
      }
    } catch (err) {
      console.error("Error deleting curriculum:", err);
      toast.error("An error occurred while deleting the curriculum."); // Error toast
    } finally {
      setDeleteModalOpen(false); // Close the modal
      setItemToDelete(null); // Reset the item to delete
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false); // Close the modal
    setItemToDelete(null); // Reset the item to delete
  };

  const handleEditCurriculum = (id) => {
    const itemToEdit = curriculumData[activeTab].find(
      (item) => item._id === id
    );
    setEditData(itemToEdit); // Set the item to edit
    setShowForm(true); // Open the form
  };

  // Extract unique Areas and Levels for the active tab
  const uniqueAreas = [
    ...new Set(curriculumData[activeTab].map((item) => item.Areas)),
  ];
  const uniqueLevels = [
    ...new Set(curriculumData[activeTab].map((item) => item.Level)),
  ];
  const filteredData = curriculumData[activeTab].filter((item) => {
    const matchesArea = selectedLearningArea
      ? item.Areas === selectedLearningArea
      : true;
    const matchesLevel = selectedLevel ? item.Level === selectedLevel : true;
    return matchesArea && matchesLevel;
  });
  const searchData = filteredData.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (item.Level?.toLowerCase() || "").includes(searchLower) ||
      (item.Areas?.toLowerCase() || "").includes(searchLower) ||
      (item.Material?.toLowerCase() || "").includes(searchLower) ||
      (item.Work?.toLowerCase() || "").includes(searchLower) ||
      (item.Lesson?.toLowerCase() || "").includes(searchLower)
    );
  });

  if (loading) return <p>Loading curriculum data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 bg-white min-h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Curriculum Page</h1>

      {/* Dropdowns, Search Bar, and Create Button */}
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Dropdowns on the Left */}
        <div className="flex space-x-4">
          {/* Learning Area Dropdown */}
          <div>
            <select
              value={selectedLearningArea}
              onChange={handleLearningAreaChange}
              className="w-64 h-12 mb-8 mt-12 bg-[#d9d9d9] rounded-[15px] px-4"
            >
              <option value="">Select Learning Area</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Level Dropdown */}
          <div>
            <select
              value={selectedLevel}
              onChange={handleLevelChange}
              className="w-64 h-12 mb-8 mt-12 bg-[#d9d9d9] rounded-[15px] px-4"
            >
              <option value="">Select Level</option>
              {uniqueLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar in the Middle */}
        <div className="flex-1 lg:flex-none lg:w-96 mb-8 mt-12 relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-12 bg-[#d9d9d9] rounded-[15px] pl-10 pr-4"
          />
          <img
            src={assets.search}
            alt="Search"
            className="absolute left-3 top-3.5 w-5 h-5"
          />
        </div>

        {/* Create Button on the Right */}
        <div className="mb-8 mt-12">
          <StyledWrapper>
            <button className="Btn" onClick={() => setShowForm(true)}>
              <div className="sign">+</div>
              <div className="text">Create</div>
            </button>
          </StyledWrapper>
        </div>
      </div>

      {/* Tab Panel */}
      <div className="flex space-x-4 mb-4">
        {["Toddler", "Preschool", "LowerElementary"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setSelectedLearningArea("");
              setSelectedLevel("");
            }}
            className={`py-2 px-6 font-medium transition-all relative ${
              activeTab === tab
                ? "border-b-4 border-[#9d16be] text-black"
                : "text-gray-500"
            }`}
          >
            {tab.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-[#9d16be] text-white">
            <tr>
              <th className="p-3 text-left w-1/5">LEVEL</th>
              <th className="p-3 text-left w-1/5">LEARNING AREA</th>
              <th className="p-3 text-left w-1/5">MATERIALS</th>
              <th className="p-3 text-left w-1/5">WORK</th>
              <th className="p-3 text-left w-1/5">LESSON</th>
              <th className="p-3 text-left w-1/5">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {searchData.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-3">{item.Level}</td>
                <td className="p-3">{item.Areas}</td>
                <td className="p-3">{item.Material}</td>
                <td className="p-3">{item.Work}</td>
                <td className="p-3">{item.Lesson}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEditCurriculum(item._id, item)}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
{showForm && (
  <CurriculumForm
    onClose={() => {
      setShowForm(false);
      setEditData(null);
    }}
    refreshData={refreshData}
    editData={editData} 
  />
)}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this curriculum?"
      />
    </div>
  );
};

// Styled-components for the Create button
const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: black;
  }

  .sign {
    width: 100%;
    font-size: 2em;
    color: white;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 1.2em;
    font-weight: 500;
    transition-duration: 0.3s;
  }

  .Btn:hover {
    width: 125px;
    border-radius: 12px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-left: 20px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-right: 20px;
  }

  .Btn:active {
    transform: translate(2px, 2px);
  }
`;

export default Curriculum;
