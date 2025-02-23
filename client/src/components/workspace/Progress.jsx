import { useState } from "react";
import { assets } from "../../assets/assets";

const Progress = () => {
  const [progress, setProgress] = useState(
    Array(15).fill({ presented: false, practiced: false, mastered: false })
  );
  const [selectedStudent, setSelectedStudent] = useState("STUDENT NAME");
  const [searchTerm, setSearchTerm] = useState("");

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

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-[#9d16be] text-white">
            <tr>
              <th className="border px-2 py-2 w-40 md:w-80">WORK</th>
              <th className="border px-1 py-2 text-center w-20">PRESENTED</th>
              <th className="border px-1 py-2 text-center w-20">PRACTICED</th>
              <th className="border px-1 py-2 text-center w-20">MASTERED</th>
              <th className="border px-2 py-2 w-40 md:w-80">REMARKS</th>
              <th className="border px-2 py-2 w-32">DATE PRESENTED</th>
              <th className="border px-2 py-2 w-32">DATE MASTERED</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((row, index) => (
              <tr key={index}>
                <td className="border px-2 py-2">Work {index + 1}</td>
                <td className="border px-1 py-2 text-center w-20">
                  <input
                    type="checkbox"
                    className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#c32cdd] checked:border-black"
                    checked={row.presented}
                    onChange={() => handleCheckboxChange(index, "presented")}
                  />
                </td>
                <td className="border px-1 py-2 text-center w-20">
                  <input
                    type="checkbox"
                    className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#c32cdd] checked:border-black"
                    checked={row.practiced}
                    onChange={() => handleCheckboxChange(index, "practiced")}
                    disabled={!row.presented}
                  />
                </td>
                <td className="border px-1 py-2 text-center w-20">
                  <input
                    type="checkbox"
                    className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#c32cdd] checked:border-black"
                    checked={row.mastered}
                    onChange={() => handleCheckboxChange(index, "mastered")}
                    disabled={!row.presented || !row.practiced}
                  />
                </td>
                <td className="border px-2 py-2 text-center w-40 md:w-80 relative">
                  -
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <img src={assets.edit} alt="Edit" className="w-5 h-5" />
                  </button>
                </td>
                <td className="border px-2 py-2 text-center w-32">-</td>
                <td className="border px-2 py-2 text-center w-32">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Progress;
