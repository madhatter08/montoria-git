import { useState } from "react";
import NavbarUser from "../components/NavbarUser";
import background from "../assets/background.png";
import { assets } from "../assets/assets"; 

const tabContent = {
  students: Array(10).fill({
    schoolId: "",
    name: "",
    age: "",
    birthday: "",
    parent: "",
    phone: "",
    email: "",
    remarks: ""
  }),
  admin: Array(5).fill({
    schoolId: "",
    name: "",
    position: ""
  }),
  guide: Array(8).fill({
    photo: "",
    schoolId: "",
    name: "",
    email: "",
    phone: "",
    class: ""
  })
};

export default function TabPanel() {
  const [activeTab, setActiveTab] = useState("students");

  const tabs = [
    { name: "GUIDE", key: "guide", count: tabContent.guide.length },
    { name: "ADMIN", key: "admin", count: tabContent.admin.length },
    { name: "STUDENTS", key: "students", count: tabContent.students.length }
  ];

  return (
    <div className="h-screen w-full bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${background})` }}>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <NavbarUser /> //
      </div>

      <div className="max-w-7xl mx-auto p-6 rounded-lg mt-10 bg-transparent">
        {/* Tabs */}
        <div className="flex mt-20 bg-white w-full rounded-t-lg p-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`py-2 px-6 font-medium transition-all relative ${
                activeTab === tab.key ? "border-b-4 border-[#9d16be] text-black" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name} <span className="ml-2 bg-gray-300 px-2 py-1 text-xs rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-b-lg shadow-md">
          {/* Search & Actions */}
          <div className="mt-0 flex justify-between items-center">
            <div className="relative w-1/3">
              <input type="text" placeholder="Search" className="border p-2 rounded-xl w-full pl-10" />
              <img src={assets.search} alt="Search" className="absolute left-3 top-2.5 w-5 h-5" />
            </div>
            <div className="flex space-x-2">
              <button className="border p-2 bg-gray-100 rounded-xl">Export</button>
              <button className="bg-black text-white px-4 py-2 rounded-xl">+ Create New</button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-auto">
            <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg">
              <thead>
                <tr className="bg-[#9d16be] text-white">
                  {Object.keys(tabContent[activeTab][0]).map((field, i) => (
                    <th key={i} className="border p-2">{field.toUpperCase().replace(/_/g, " ")}</th>
                  ))}
                  <th className="border p-2">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {tabContent[activeTab].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(item).map((value, i) => (
                      <td key={i} className="border p-2 text-center">{value}</td>
                    ))}
                    <td className="border p-2 text-center">
                      <div className="flex justify-center space-x-2">
                        <img src={assets.edit_profile} alt="Edit" className="w-5 h-5 cursor-pointer" />
                        <img src={assets.delete_icon} alt="Delete" className="w-5 h-5 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-6">
            <button className="border p-2 rounded-xl">&lt; Previous</button>
            <button className="border p-2 rounded-xl">Next &gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
