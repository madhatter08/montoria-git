import React, { useState } from 'react';

const CurriculumForm = ({ onAdd, onClose }) => {
  const [level, setLevel] = useState('');
  const [area, setArea] = useState('');
  const [materials, setMaterials] = useState('');
  const [work, setWork] = useState('');
  const [lesson, setLesson] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ level, area, materials, work, lesson });
    onClose();
  };

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-transparent bg-opacity-50 flex items-start justify-center mt-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Curriculum</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Level</option>
              <option value="Toddler">Toddler</option>
              <option value="Preschool">Preschool</option>
              <option value="Lower Elementary">Lower Elementary</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Learning Area</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Learning Area</option>
              <option value="Language">Language</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="Literature">Literature</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Materials</label>
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Work</label>
            <input
              type="text"
              value={work}
              onChange={(e) => setWork(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Lesson</label>
            <input
              type="text"
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#9d16be] text-white rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurriculumForm;
