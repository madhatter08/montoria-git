import { useState, useEffect, useContext } from "react";
import axios from "axios";
import NavbarUser from "../components/NavbarUser";
import StudentAdmissionForm from "../Forms/StudentAdmissionForm";
import AdminForm from "../Forms/AdminForm";
import GuideForm from "../Forms/GuideForm";
import AdmissionForm from "../Forms/AdmissionForm";
import { assets } from "../assets/assets";
import styled from "styled-components";
import PropTypes from "prop-types";
import ConfirmationModal from "../components/ConfirmationModal";
import ArchiveModal from "../components/ArchiveModal";
import RestoreModal from "../components/RestoreModal";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import Loader from "../components/style/Loader";

export default function TabPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab") || "students");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRemarks, setSelectedRemarks] = useState(null);
  const [data, setData] = useState({
    students: [],
    admin: [],
    guide: [],
    admission: [],
    inactive: [],
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [itemToRestore, setItemToRestore] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { backendUrl, userData } = useContext(AppContext);
  
  const ROWS_PER_PAGE = 15;

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
    setCurrentPage(1);
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/all`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const users = res.data.users;

        const students = users.filter((user) => user.role === "student" && user.isActive);
        const admin = users.filter((user) => user.role === "admin" && user.isActive);
        const guide = users.filter((user) => user.role === "guide" && user.isActive);
        const inactive = users.filter((user) => !user.isActive);

        const admissionRes = await axios.get(`${backendUrl}/api/user/all`, {
          withCredentials: true,
        });

        setData({
          students,
          admin,
          guide,
          admission: admissionRes.data.admissions || [],
          inactive,
        });
      } else {
        setError("Failed to fetch users.");
      }
    } catch (err) {
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const refreshData = () => {
    fetchUsers();
  };

  const openDeleteModal = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const openArchiveModal = (id) => {
    setItemToArchive(id);
    setArchiveModalOpen(true);
  };

  const openRestoreModal = (id) => {
    setItemToRestore(id);
    setRestoreModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const res = await axios.delete(`${backendUrl}/api/user/delete-user/${itemToDelete}`);
      if (res.data.success) {
        const updatedUserData = {
          ...data,
          [activeTab]: data[activeTab].filter((item) => item._id !== itemToDelete),
        };
        setData(updatedUserData);
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("An error occurred while deleting the user.");
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleArchiveConfirm = async () => {
    if (!itemToArchive) return;

    try {
      const res = await axios.put(
        `${backendUrl}/api/user/update/${itemToArchive}`,
        { isActive: false },
        { withCredentials: true }
      );

      if (res.data.success) {
        const userToArchive = data[activeTab].find((item) => item._id === itemToArchive);
        if (!userToArchive) {
          throw new Error("User not found in current tab");
        }
        const updatedUserData = {
          ...data,
          [activeTab]: data[activeTab].filter((item) => item._id !== itemToArchive),
          inactive: [...data.inactive, { ...userToArchive, isActive: false }],
        };
        setData(updatedUserData);
        toast.success("User archived successfully!");
      } else {
        toast.error("Failed to archive user: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error archiving user:", err);
      toast.error("An error occurred while archiving the user: " + err.message);
    } finally {
      setArchiveModalOpen(false);
      setItemToArchive(null);
    }
  };

  const handleRestoreConfirm = async () => {
    if (!itemToRestore) return;

    try {
      const res = await axios.put(
        `${backendUrl}/api/user/update/${itemToRestore}`,
        { isActive: true },
        { withCredentials: true }
      );

      if (res.data.success) {
        const userToRestore = data.inactive.find((item) => item._id === itemToRestore);
        if (!userToRestore) {
          throw new Error("User not found in inactive tab");
        }
        const originalTab = userToRestore.role + "s"; // e.g., "admins", "students"
        const updatedUserData = {
          ...data,
          inactive: data.inactive.filter((item) => item._id !== itemToRestore),
          [originalTab]: [...(data[originalTab] || []), { ...userToRestore, isActive: true }],
        };
        setData(updatedUserData);
        toast.success("User restored successfully!");
      } else {
        toast.error("Failed to restore user: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error restoring user:", err);
      toast.error("An error occurred while restoring the user: " + err.message);
    } finally {
      setRestoreModalOpen(false);
      setItemToRestore(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleArchiveCancel = () => {
    setArchiveModalOpen(false);
    setItemToArchive(null);
  };

  const handleRestoreCancel = () => {
    setRestoreModalOpen(false);
    setItemToRestore(null);
  };

  const handleEditData = (id) => {
    const itemToEdit = data[activeTab].find((item) => item._id === id);
    setEditData(itemToEdit);
    setIsFormOpen(true);
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Loader />
      </div>
    );
  if (error) return <p>{error}</p>;

  if (activeTab === "admission" && (!userData || userData.role !== "admin")) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">
          {userData ? "Not available: Admin access only." : "Please log in to access the admission dashboard."}
        </p>
      </div>
    );
  }

  const tabs = [
    { name: "GUIDE", key: "guide", count: data.guide.length },
    { name: "ADMIN", key: "admin", count: data.admin.length },
    { name: "STUDENTS", key: "students", count: data.students.length },
    { name: "ADMISSION", key: "admission", count: data.admission.length },
    { name: "INACTIVE", key: "inactive", count: data.inactive.length },
  ];

  const renderForm = () => {
    switch (activeTab) {
      case "students":
        return (
          <StudentAdmissionForm
            onClose={() => {
              setIsFormOpen(false);
              setEditData(null);
            }}
            refreshData={refreshData}
            editData={editData}
          />
        );
      case "admin":
        return (
          <AdminForm
            onClose={() => {
              setIsFormOpen(false);
              setEditData(null);
            }}
            refreshData={refreshData}
            editData={editData}
          />
        );
      case "guide":
        return (
          <GuideForm
            onClose={() => {
              setIsFormOpen(false);
              setEditData(null);
            }}
            refreshData={refreshData}
            editData={editData}
          />
        );
      case "admission":
        return <AdmissionForm onClose={() => setIsFormOpen(false)} />;
      default:
        return null;
    }
  };

  const filterData = (data, activeTab, searchQuery) => {
    if (!searchQuery) return data;

    const searchLower = searchQuery.toLowerCase();

    switch (activeTab) {
      case "guide":
        return data.filter((item) => {
          const guideData = item.guideData || {};
          return (
            (guideData.firstName?.toLowerCase().includes(searchLower) || false) ||
            (guideData.lastName?.toLowerCase().includes(searchLower) || false) ||
            (guideData.address?.toLowerCase().includes(searchLower) || false) ||
            (guideData.contactNumber?.toLowerCase().includes(searchLower) || false) ||
            (guideData.class?.toLowerCase().includes(searchLower) || false) ||
            (guideData.guideType?.toLowerCase().includes(searchLower) || false) ||
            (guideData.birthday?.toLowerCase().includes(searchLower) || false) ||
            item.email.toLowerCase().includes(searchLower) ||
            item.schoolId.toLowerCase().includes(searchLower)
          );
        });
      case "admin":
        return data.filter((item) => {
          const adminData = item.adminData || {};
          return (
            (adminData.name?.toLowerCase().includes(searchLower) || false) ||
            item.email.toLowerCase().includes(searchLower) ||
            item.schoolId.toLowerCase().includes(searchLower) ||
            (adminData.contactNumber?.toLowerCase().includes(searchLower) || false)
          );
        });
      case "students":
      case "inactive":
        return data.filter((item) => {
          const studentData = item.studentData || {};
          const guideData = item.guideData || {};
          const adminData = item.adminData || {};
          return (
            item.email.toLowerCase().includes(searchLower) ||
            item.schoolId.toLowerCase().includes(searchLower) ||
            (studentData.firstName?.toLowerCase().includes(searchLower) || false) ||
            (studentData.lastName?.toLowerCase().includes(searchLower) || false) ||
            (studentData.level?.toLowerCase().includes(searchLower) || false) ||
            (studentData.address?.toLowerCase().includes(searchLower) || false) ||
            (studentData.parentName?.toLowerCase().includes(searchLower) || false) ||
            (studentData.parentPhone?.toLowerCase().includes(searchLower) || false) ||
            (studentData.class?.toLowerCase().includes(searchLower) || false) ||
            (guideData.firstName?.toLowerCase().includes(searchLower) || false) ||
            (guideData.lastName?.toLowerCase().includes(searchLower) || false) ||
            (adminData.name?.toLowerCase().includes(searchLower) || false)
          );
        });
      case "admission":
        return data.filter((item) => {
          return (
            (item.program?.toLowerCase().includes(searchLower) || false) ||
            (item.level?.toLowerCase().includes(searchLower) || false) ||
            (item.learningArea?.toLowerCase().includes(searchLower) || false)
          );
        });
      default:
        return data;
    }
  };

  const filteredData = filterData(data[activeTab], activeTab, searchQuery);
  
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const exportToExcel = () => {
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");
    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach((row) => {
      const rowData = [];
      row.querySelectorAll("th, td").forEach((cell) => {
        // Skip image cells for CSV export
        if (!cell.querySelector("img")) {
          rowData.push(cell.innerText);
        } else {
          rowData.push(""); // Placeholder for photo column
        }
      });
      csvContent += rowData.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTab}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemarksClick = (remarks) => {
    setSelectedRemarks(remarks);
  };

  const closeRemarksModal = () => {
    setSelectedRemarks(null);
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center overflow-hidden overflow-y-auto"
      style={{
        background:
          "radial-gradient(circle at top center, #6f4685 10%, #4A154B 70%, #4A154B 95%)",
      }}
    >
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <NavbarUser />
      </div>

      <div className="max-w-100% mx-auto p-6 rounded-lg mt-10 bg-transparent">
        <div className="flex mt-20 bg-white w-full rounded-t-lg p-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`py-2 px-6 font-medium transition-all relative ${
                activeTab === tab.key
                  ? "border-b-4 border-[#4A154B] text-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}{" "}
              <span className="ml-2 bg-gray-300 px-2 py-1 text-xs rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <div className="mt-0 flex justify-between items-center">
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border p-2 rounded-xl w-full pl-10"
              />
              <img
                src={assets.search}
                alt="Search"
                className="absolute left-3 top-2.5 w-5 h-5"
              />
            </div>
            <div className="flex space-x-2">
              <button
                className="border p-2 bg-gray-100 rounded-xl"
                onClick={exportToExcel}
              >
                Export to Excel
              </button>
              {(activeTab === "students" ||
                activeTab === "admin" ||
                activeTab === "guide" ||
                activeTab === "admission") && (
                <Button onClick={() => setIsFormOpen(true)} />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg mt-4 shadow overflow-x-auto max-h-[60vh]">
            <table className="w-full">
              <thead className="bg-[#4A154B] text-white sticky top-0 z-10">
                <tr>
                  {activeTab === "students" && (
                    <>
                      <th className="p-3 text-left">Photo</th>
                      <th className="p-3 text-left">School ID</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Level</th>
                      <th className="p-3 text-left">LRN</th>
                      <th className="p-3 text-left">Birthday</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-left">Parent / Guardian</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Class</th>
                    </>
                  )}
                  {activeTab === "admin" && (
                    <>
                      <th className="p-3 text-left">Photo</th>
                      <th className="p-3 text-left">School ID</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Phone</th>
                    </>
                  )}
                  {activeTab === "guide" && (
                    <>
                      <th className="p-3 text-left">Photo</th>
                      <th className="p-3 text-left">School ID</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Birthday</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Class</th>
                    </>
                  )}
                  {activeTab === "admission" && (
                    <>
                      <th className="p-3 text-left">Program</th>
                      <th className="p-3 text-left">Level</th>
                      <th className="p-3 text-left">Learning Area</th>
                    </>
                  )}
                  {activeTab === "inactive" && (
                    <>
                      <th className="p-3 text-left">Photo</th>
                      <th className="p-3 text-left">School ID</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                    </>
                  )}
                  <th className="p-3 text-left min-w-[120px]">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-3 text-center">
                      No results found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr 
                      key={index} 
                      className="border-b hover:bg-gray-100 transition-colors duration-200"
                    >
                      {activeTab === "students" && (
                        <>
                          <td className="p-3">
                            {item.studentData?.photo ? (
                              <img
                                src={`${backendUrl}${item.studentData.photo}`} // Prepend backend URL
                                alt={`${item.studentData.firstName}'s photo`}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => (e.target.src = assets.no_pfp)} // Fallback on error
                              />
                            ) : (
                              <img
                                src={assets.no_pfp}
                                alt="No photo"
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                          </td>
                          <td className="p-3">{item.schoolId}</td>
                          <td className="p-3">{`${item.studentData?.lastName || ""}, ${item.studentData?.firstName || ""} ${item.studentData?.middleName ? `${item.studentData.middleName.charAt(0)}.` : ""}`}</td>
                          <td className="p-3">{item.studentData?.level || "N/A"}</td>
                          <td className="p-3">{item.studentData?.lrn || "N/A"}</td>
                          <td className="p-3">{item.studentData?.birthday ? new Date(item.studentData.birthday).toISOString().split("T")[0] : "N/A"}</td>
                          <td className="p-3">{item.studentData?.address || "N/A"}</td>
                          <td className="p-3">{item.studentData?.parentName ? `${item.studentData.parentName} (${item.studentData.parentRel || "N/A"})` : "N/A"}</td>
                          <td className="p-3">{item.studentData?.parentPhone || "N/A"}</td>
                          <td className="p-3">{item.email}</td>
                          <td className="p-3">{item.studentData?.class || "N/A"}</td>
                        </>
                      )}
                      {activeTab === "admin" && (
                        <>
                          <td className="p-3">
                            {item.adminData?.photo ? (
                              <img
                                src={`${backendUrl}${item.adminData.photo}`} // Prepend backend URL
                                alt={`${item.adminData.name}'s photo`}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => (e.target.src = assets.no_pfp)} // Fallback on error
                              />
                            ) : (
                              <img
                                src={assets.no_pfp}
                                alt="No photo"
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                          </td>
                          <td className="p-3">{item.schoolId}</td>
                          <td className="p-3">{item.adminData?.name || "N/A"}</td>
                          <td className="p-3">{item.email}</td>
                          <td className="p-3">{item.adminData?.contactNumber || "N/A"}</td>
                        </>
                      )}
                      {activeTab === "guide" && (
                        <>
                          <td className="p-3">
                            {item.guideData?.photo ? (
                              <img
                                src={`${backendUrl}${item.guideData.photo}`} // Prepend backend URL
                                alt={`${item.guideData.firstName}'s photo`}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => (e.target.src = assets.no_pfp)} // Fallback on error
                              />
                            ) : (
                              <img
                                src={assets.no_pfp}
                                alt="No photo"
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                          </td>
                          <td className="p-3">{item.schoolId}</td>
                          <td className="p-3">{item.guideData?.guideType || "N/A"}</td>
                          <td className="p-3">{`${item.guideData?.lastName || ""}, ${item.guideData?.firstName || ""} ${item.guideData?.middleName ? `${item.guideData.middleName.charAt(0)}.` : ""}`}</td>
                          <td className="p-3">{item.guideData?.birthday ? new Date(item.guideData.birthday).toISOString().split("T")[0] : "N/A"}</td>
                          <td className="p-3">{item.guideData?.address || "N/A"}</td>
                          <td className="p-3">{item.email}</td>
                          <td className="p-3">{item.guideData?.contactNumber || "N/A"}</td>
                          <td className="p-3">{item.guideData?.class || "N/A"}</td>
                        </>
                      )}
                      {activeTab === "admission" && (
                        <>
                          <td className="p-3">{item.program || "N/A"}</td>
                          <td className="p-3">{item.level || "N/A"}</td>
                          <td className="p-3">{item.learningArea || "N/A"}</td>
                        </>
                      )}
                      {activeTab === "inactive" && (
                        <>
                          <td className="p-3">
                            {item.studentData?.photo || item.guideData?.photo || item.adminData?.photo ? (
                              <img
                                src={`${backendUrl}${item.studentData?.photo || item.guideData?.photo || item.adminData?.photo}`} // Prepend backend URL
                                alt="User photo"
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => (e.target.src = assets.no_pfp)} // Fallback on error
                              />
                            ) : (
                              <img
                                src={assets.no_pfp}
                                alt="No photo"
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                          </td>
                          <td className="p-3">{item.schoolId}</td>
                          <td className="p-3">{item.role}</td>
                          <td className="p-3">
                            {item.studentData
                              ? `${item.studentData.lastName || ""}, ${item.studentData.firstName || ""}`
                              : item.guideData
                              ? `${item.guideData.lastName || ""}, ${item.guideData.firstName || ""}`
                              : item.adminData?.name || "N/A"}
                          </td>
                          <td className="p-3">{item.email}</td>
                        </>
                      )}
                      <td className="p-3 min-w-[120px]">
                        <div className="flex justify-start space-x-2">
                          {activeTab !== "inactive" && activeTab !== "admission" && (
                            <img
                              src={assets.edit_profile}
                              alt="Edit"
                              className="w-5 h-5 cursor-pointer"
                              onClick={() => handleEditData(item._id)}
                            />
                          )}
                          <img
                            src={assets.delete_icon}
                            alt="Delete"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => openDeleteModal(item._id)}
                          />
                          {activeTab !== "admission" && activeTab !== "inactive" && (
                            <img
                              src={assets.archive_icon}
                              alt="Archive"
                              className="w-5 h-5 cursor-pointer"
                              onClick={() => openArchiveModal(item._id)}
                            />
                          )}
                          {activeTab === "inactive" && (
                            <img
                              src={assets.restore_icon}
                              alt="Restore"
                              className="w-5 h-5 cursor-pointer"
                              onClick={() => openRestoreModal(item._id)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button 
              className="border p-2 rounded-xl disabled:opacity-50" 
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              &lt; Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="border p-2 rounded-xl disabled:opacity-50" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent shadow-5xl bg-opacity-50 z-50">
          <div className="bg-white p-6 border rounded-lg shadow-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            {renderForm()}
          </div>
        </div>
      )}

      {selectedRemarks && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-[90%] max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Remarks</h2>
            <p>{selectedRemarks}</p>
            <button
              className="mt-4 p-2 bg-[#9d16be] text-white rounded-lg"
              onClick={closeRemarksModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this user?"
      />

      <ArchiveModal
        isOpen={archiveModalOpen}
        onClose={handleArchiveCancel}
        onConfirm={handleArchiveConfirm}
        message="Are you sure you want to deactivate this user?"
      />

      <RestoreModal
        isOpen={restoreModalOpen}
        onClose={handleRestoreCancel}
        onConfirm={handleRestoreConfirm}
        message="Are you sure you want to restore this user?"
      />
    </div>
  );
}

const Button = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="Btn" onClick={onClick}>
        <div className="sign">+</div>
        <div className="text">Create</div>
      </button>
    </StyledWrapper>
  );
};

// Styled component for the button
const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100px;
    height: 40px;
    border: none;
    padding: 0px 15px;
    background-color: rgb(126, 38, 134);
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s;
    gap: 10px;
  }
  .Btn:hover {
    background-color: rgb(0, 100, 255);
  }
  .sign {
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    font-weight: 800;
  }
  .text {
    width: 70px;
    font-size: 16px;
    color: white;
    font-weight: 500;
  }
`;

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};