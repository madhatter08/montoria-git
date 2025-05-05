import { useState } from 'react';
import axios from 'axios';

const SchoolYearForm = ({ onYearCreated, onClose }) => {
  const [year, setYear] = useState('');
  const [quarters, setQuarters] = useState([
    { quarterId: 'Q1', name: 'First Quarter', startDate: '', endDate: '' },
    { quarterId: 'Q2', name: 'Second Quarter', startDate: '', endDate: '' },
    { quarterId: 'Q3', name: 'Third Quarter', startDate: '', endDate: '' },
    { quarterId: 'Q4', name: 'Fourth Quarter', startDate: '', endDate: '' },
  ]);
  const [error, setError] = useState('');

  const handleQuarterChange = (index, field, value) => {
    const updatedQuarters = [...quarters];
    updatedQuarters[index] = { ...updatedQuarters[index], [field]: value };
    setQuarters(updatedQuarters);
  };

  const validateForm = () => {
    if (!year.match(/^\d{4}-\d{4}$/)) {
      return 'Year must be in format YYYY-YYYY (e.g., 2024-2025)';
    }
    for (let i = 0; i < quarters.length; i++) {
      const q = quarters[i];
      if (!q.startDate || !q.endDate) {
        return `${q.name} start and end dates are required`;
      }
      if (new Date(q.startDate) >= new Date(q.endDate)) {
        return `${q.name} start date must be before end date`;
      }
      if (i > 0 && new Date(q.startDate) <= new Date(quarters[i - 1].endDate)) {
        return `${q.name} start date must be after previous quarter's end date`;
      }
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/school-years', { year, quarters });
      alert('School year created successfully!');
      setYear('');
      setQuarters(quarters.map((q) => ({ ...q, startDate: '', endDate: '' })));
      setError('');
      onYearCreated();
      onClose(); // Close the form after successful submission
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create school year');
    }
  };

  const handleCancel = () => {
    setYear('');
    setQuarters(quarters.map((q) => ({ ...q, startDate: '', endDate: '' })));
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-gray-50 p-8 border-2 rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Create New School Year</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              School Year (e.g., 2024-2025)
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="2024-2025"
              required
            />
          </div>

          {quarters.map((quarter, index) => (
            <div
              key={quarter.quarterId}
              className="mb-6 p-6 bg-gray-100 rounded-xl shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {quarter.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={quarter.startDate}
                    onChange={(e) =>
                      handleQuarterChange(index, 'startDate', e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={quarter.endDate}
                    onChange={(e) =>
                      handleQuarterChange(index, 'endDate', e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Create School Year
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolYearForm;