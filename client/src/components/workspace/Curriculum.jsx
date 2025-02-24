import React, { useState } from 'react';
import { assets } from '../../assets/assets'; // Import assets for the search icon

const Curriculum = () => {
  const [selectedLearningArea, setSelectedLearningArea] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Toddler'); // State for active tab

  const handleLearningAreaChange = (e) => {
    setSelectedLearningArea(e.target.value);
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Sample data for each tab
  const curriculumData = {
    Toddler: [
      {
        id: 1,
        level: 'Toddler',
        area: 'Language',
        materials: 'Picture Books',
        work: 'Listening',
        lesson: 'Basic Vocabulary',
      },
      {
        id: 2,
        level: 'Toddler',
        area: 'Math',
        materials: 'Counting Toys',
        work: 'Counting',
        lesson: 'Numbers 1-10',
      },
    ],
    Preschool: [
      {
        id: 1,
        level: 'Preschool',
        area: 'Language',
        materials: 'Phonics Book',
        work: 'Reading',
        lesson: 'Basic Phonics',
      },
      {
        id: 2,
        level: 'Preschool',
        area: 'Math',
        materials: 'Counting Blocks',
        work: 'Counting',
        lesson: 'Number Recognition',
      },
    ],
    LowerElementary: [
      {
        id: 1,
        level: 'Lower Elementary',
        area: 'Science',
        materials: 'Science Kit',
        work: 'Experiments',
        lesson: 'Basic Physics',
      },
      {
        id: 2,
        level: 'Lower Elementary',
        area: 'Literature',
        materials: 'Storybooks',
        work: 'Reading',
        lesson: 'Comprehension',
      },
    ],
  };

  return (
    <div className="p-8 bg-white min-h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Curriculum Page</h1>

      {/* Dropdowns and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Dropdowns on the Left */}
        <div className="flex space-x-4">
          {/* Learning Area Dropdown */}
          <div>
            <select
              value={selectedLearningArea}
              onChange={handleLearningAreaChange}
              className="w-64 h-12 mb-8 mt-12 bg-[#d9d9d9] rounded-[15px] px-4" // Wider dropdown
            >
              <option value="">Select Learning Area</option>
              <option value="Language">Language</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="Literature">Literature</option>
            </select>
          </div>

          {/* Level Dropdown */}
          <div>
            <select
              value={selectedLevel}
              onChange={handleLevelChange}
              className="w-64 h-12 mb-8 mt-12 bg-[#d9d9d9] rounded-[15px] px-4" // Wider dropdown
            >
              <option value="">Select Level</option>
              <option value="Toddler">Toddler</option>
              <option value="Preschool">Preschool</option>
              <option value="Lower Elementary">Lower Elementary</option>
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
            src={assets.search} // Use the search icon from assets
            alt="Search"
            className="absolute left-3 top-3.5 w-5 h-5"
          />
        </div>
      </div>

      {/* Tab Panel */}
      <div className="flex space-x-4 mb-4">
        {['Toddler', 'Preschool', 'LowerElementary'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-6 font-medium transition-all relative ${
              activeTab === tab ? 'border-b-4 border-[#9d16be] text-black' : 'text-gray-500'
            }`}
          >
            {tab.replace(/([A-Z])/g, ' $1').trim()} {/* Format tab names */}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full table-fixed"> {/* Use table-fixed for equal column sizes */}
          <thead className="bg-[#9d16be] text-white">
            <tr>
              <th className="p-3 text-left w-1/5">LEVEL</th> {/* Equal width for all columns */}
              <th className="p-3 text-left w-1/5">LEARNING AREA</th>
              <th className="p-3 text-left w-1/5">MATERIALS</th>
              <th className="p-3 text-left w-1/5">WORK</th>
              <th className="p-3 text-left w-1/5">LESSON</th>
            </tr>
          </thead>
          <tbody>
            {curriculumData[activeTab].map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.level}</td>
                <td className="p-3">{item.area}</td>
                <td className="p-3">{item.materials}</td>
                <td className="p-3">{item.work}</td>
                <td className="p-3">{item.lesson}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Curriculum;