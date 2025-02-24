import { useState } from "react";
import { assets } from "../../assets/assets";

const students = [
  {
    name: "Student A",
    lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4"],
  },
  { name: "Student B", lessons: ["Lesson 1", "Lesson 2", "Lesson 3"] },
  {
    name: "Student C",
    lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4", "Lesson 5"],
  },
  { name: "Student D", lessons: ["Lesson 1", "Lesson 2"] },
  {
    name: "Student E",
    lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4"],
  },
  { name: "Student F", lessons: ["Lesson 1", "Lesson 2", "Lesson 3"] },
];

const LessonPlan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Close modal when clicking outside
  const closeModal = () => setSelectedStudent(null);

  return (
    <div className="flex flex-col w-full h-full p-6 mt-30">
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-8">
          <div className="text-black ml-5 font-bold text-2xl lg:text-4xl whitespace-nowrap">
            Lesson Plans
          </div>
          <select className="w-full lg:w-48 h-12 bg-[#d9d9d9] rounded-[15px] px-4">
            <option>CLASS</option>
            <option>Casa 1</option>
            <option>Casa 2</option>
            <option>Casa 3</option>
          </select>
          <select className="w-full lg:w-48 h-12 bg-[#d9d9d9] rounded-[15px] px-4">
            <option value="level">LEVEL</option>
            <option value="Toddler">Toddler</option>
            <option value="Junior Casa">Junior Casa</option>
            <option value="Junior Advanced Casa">Junior Advanced Casa</option>
            <option value="Advanced Casa">Advanced Casa</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
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

      <div className="max-h-[90vh] p-4">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
          }}
        >
          {students.map((student, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-300 flex flex-col h-[300px]"
            >
              {/* Student Name */}
              <h3 className="text-2xl font-semibold text-center bg-[#9d16be] text-white p-2 rounded-t-lg">
                {student.name}
              </h3>

              {/* Lesson Plan Content (Clickable) */}
              <div
                className="flex-grow p-3 overflow-hidden cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                <ul className="list-disc pl-5 text-gray-700 text-lg">
                  {student.lessons.slice(0, 3).map((lesson, i) => (
                    <li key={i} className="py-1">
                      {lesson}
                    </li>
                  ))}
                  {student.lessons.length > 3 && (
                    <li className="text-gray-500">...</li>
                  )}
                </ul>
              </div>

              {/* Dropdown and Check Button */}
              <div className="mt-auto flex items-center gap-2">
                <select className="flex-grow p-2 border rounded">
                  <option value="">Select Lesson</option>
                  {student.lessons.map((lesson, i) => (
                    <option key={i} value={lesson}>
                      {lesson}
                    </option>
                  ))}
                </select>
                <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                  ✓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for student details */}
      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-2xl font-bold text-center mb-4">
              {selectedStudent.name}
            </h2>
            <ul className="list-disc pl-5 text-lg">
              {selectedStudent.lessons.map((lesson, i) => (
                <li key={i} className="text-gray-700 py-1">
                  {lesson}
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlan;
