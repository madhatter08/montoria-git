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
    schoolId: "",
    name: "",
    age: "",
    birthday: "",
    parent: "",
    phone: "",
    email: "",
    remarks: "",
  }),
  admin: Array(5).fill({
    schoolId: "",
    name: "",
    phone: "",
    email: "",
  }),
  guide: Array(8).fill({
    schoolId: "",
    name: "",
    email: "",
    phone: "",
    class: "",
  }),
  admission: Array(8).fill({
    program: "",
    level: "",
    learningArea: "",
    class: "",
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
    transition-duration: .3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: black;
  }

  .sign {
    width: 100%;
    font-size: 2em;
    color: white;
    transition-duration: .3s;
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
    transition-duration: .3s;
  }

  .Btn:hover {
    width: 125px;
    border-radius: 12px;
    transition-duration: .3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: .3s;
    padding-left: 20px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: .3s;
    padding-right: 20px;
  }

  .Btn:active {
    transform: translate(2px ,2px);
  }
`;

export default function TabPanel() {
  const [activeTab, setActiveTab] = useState("students");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const tabs = [
    { name: "GUIDE", key: "guide", count: tabContent.guide.length },
    { name: "ADMIN", key: "admin", count: tabContent.admin.length },
    { name: "STUDENTS", key: "students", count: tabContent.students.length },
    { name: "ADMISSION", key: "admission", count: tabContent.admission.length },
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
              <button className="border p-2 bg-gray-100 rounded-xl">Export</button>
              {(activeTab === "students" || activeTab === "admin" || activeTab === "guide" || activeTab === "admission") && (
                <Button onClick={() => setIsFormOpen(true)} />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg mt-4 shadow overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-[#9d16be] text-white">
                <tr>
                  {Object.keys(tabContent[activeTab][0]).map((field, i) => (
                    <th key={i} className="p-3 text-left w-1/6">{field.toUpperCase().replace(/_/g, " ")}</th>
                  ))}
                  <th className="p-3 text-left w-1/6">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {tabContent[activeTab].map((item, index) => (
                  <tr key={index} className="border-b">
                    {Object.values(item).map((value, i) => (
                      <td key={i} className="p-3">{value}</td>
                    ))}
                    <td className="p-3">
                      <div className="flex justify-start space-x-2">
                        <img src={assets.edit_profile} alt="Edit" className="w-5 h-5 cursor-pointer" />
                        <img src={assets.delete_icon} alt="Delete" className="w-5 h-5 cursor-pointer" />
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

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent shadow-5xl bg-opacity-50 z-50">
          <div className="bg-white p-6 border rounded-lg shadow-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            {renderForm()}
          </div>
        </div>
      )}
    </div>
  );
}
