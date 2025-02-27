import { useState } from "react";
import NavbarUser from "../components/NavbarUser";
import StudentAdmissionForm from "../Forms/StudentAdmissionForm";
import AdminForm from "../Forms/AdminForm";
import GuideForm from "../Forms/GuideForm";
import AdmissionForm from "../Forms/AdmissionForm";
import { assets } from "../assets/assets";
import styled from "styled-components";

const tabContent = {
  students: Array(10).fill({
    schoolId: "12345",
    name: "John Doe",
    age: "10",
    birthday: "01/01/2013",
    parent: "Jane Doe",
    phone: "123-456-7890",
    email: "john.doe@example.com",
    remarks: "Good student with excellent performance in all subjects.",
  }),
  admin: Array(5).fill({
    schoolId: "54321",
    name: "Admin User",
    phone: "987-654-3210",
    email: "admin@example.com",
  }),
  guide: Array(8).fill({
    schoolId: "67890",
    name: "Guide User",
    email: "guide@example.com",
    phone: "555-555-5555",
    class: "Class A",
  }),
  admission: Array(8).fill({
    program: "Math",
    level: "Beginner",
    learningArea: "Algebra",
    class: "Class B",
  }),
};

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

export default function TabPanel() {
  const [activeTab, setActiveTab] = useState("students");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRemarks, setSelectedRemarks] = useState(null);
  const [data, setData] = useState(tabContent);
  const [editItem, setEditItem] = useState(null);

  const tabs = [
    { name: "GUIDE", key: "guide", count: data.guide.length },
    { name: "ADMIN", key: "admin", count: data.admin.length },
    { name: "STUDENTS", key: "students", count: data.students.length },
    { name: "ADMISSION", key: "admission", count: data.admission.length },
  ];

  const renderForm = () => {
    switch (activeTab) {
      case "students":
        return <StudentAdmissionForm onClose={() => setIsFormOpen(false)} />;
      case "admin":
        return <AdminForm onClose={() => setIsFormOpen(false)} />;
      case "guide":
        return <GuideForm onClose={() => setIsFormOpen(false)} />;
      case "admission":
        return <AdmissionForm onClose={() => setIsFormOpen(false)} />;
      default:
        return null;
    }
  };

  const handleDelete = (index) => {
    const newData = { ...data };
    newData[activeTab] = newData[activeTab].filter((_, i) => i !== index);
    setData(newData);
  };

  const handleEdit = (index) => {
    setEditItem({ ...data[activeTab][index], index });
    setIsFormOpen(true);
  };

  const handleSave = (updatedItem) => {
    const newData = { ...data };
    newData[activeTab][updatedItem.index] = updatedItem;
    setData(newData);
    setEditItem(null);
    setIsFormOpen(false);
  };

  const exportToExcel = () => {
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");
    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach((row) => {
      const rowData = [];
      row.querySelectorAll("th, td").forEach((cell) => {
        rowData.push(cell.innerText);
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
    <div className="h-screen w-full bg-cover bg-center overflow-hidden overflow-y-auto" style={{ background: "radial-gradient(circle at top center, #A78BFA 10%, #ffb3dd 70%, #fff 95%)" }}>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <NavbarUser />
      </div>

      <div className="max-w-7xl mx-auto p-6 rounded-lg mt-10 bg-transparent">
        <div className="flex mt-20 bg-white w-full rounded-t-lg p-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`py-2 px-6 font-medium transition-all relative ${activeTab === tab.key ? "border-b-4 border-[#9d16be] text-black" : "text-gray-500"}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name} <span className="ml-2 bg-gray-300 px-2 py-1 text-xs rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <div className="mt-0 flex justify-between items-center">
            <div className="relative w-1/3">
              <input type="text" placeholder="Search" className="border p-2 rounded-xl w-full pl-10" />
              <img src={assets.search} alt="Search" className="absolute left-3 top-2.5 w-5 h-5" />
            </div>
            <div className="flex space-x-2">
              <button className="border p-2 bg-gray-100 rounded-xl" onClick={exportToExcel}>Export to Excel</button>
        
              {(activeTab === "students" || activeTab === "admin" || activeTab === "guide" || activeTab === "admission") && (
                <Button onClick={() => setIsFormOpen(true)} />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg mt-4 shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#9d16be] text-white">
                <tr>
                  {Object.keys(data[activeTab][0]).map((field, i) => (
                    <th
                      key={i}
                      className={`p-3 text-left ${field === "age" || field === "birthday" ? "w-[100px]" : "min-w-[150px] max-w-[200px]"}`}
                    >
                      {field.toUpperCase().replace(/_/g, " ")}
                    </th>
                  ))}
                  <th className="p-3 text-left min-w-[100px]">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data[activeTab].map((item, index) => (
                  <tr key={index} className="border-b">
                    {Object.entries(item).map(([key, value], i) => (
                      <td
                        key={i}
                        className={`p-3 ${key === "age" || key === "birthday" ? "w-[100px]" : "min-w-[150px] max-w-[200px]"} ${key === "remarks" ? "cursor-pointer hover:bg-gray-100" : ""}`}
                        onClick={key === "remarks" ? () => handleRemarksClick(value) : undefined}
                      >
                        {value}
                      </td>
                    ))}
                    <td className="p-3 min-w-[100px]">
                      <div className="flex justify-start space-x-2">
                        <img src={assets.edit_profile} alt="Edit" className="w-5 h-5 cursor-pointer" onClick={() => handleEdit(index)} />
                        <img src={assets.delete_icon} alt="Delete" className="w-5 h-5 cursor-pointer" onClick={() => handleDelete(index)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-6">
            <button className="border p-2 rounded-xl">&lt; Previous</button>
            <button className="border p-2 rounded-xl">Next &gt;</button>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
    </div>
  );
}