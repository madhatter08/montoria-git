import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SchoolYearList = () => {
  const [schoolYears, setSchoolYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/school-years');
      setSchoolYears(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch school years');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolYears();
  }, []);

  const handleArchive = async (id) => {
    if (!window.confirm('Are you sure you want to archive this school year?')) return;
    try {
      await axios.patch(`http://localhost:5000/api/school-years/${id}/archive`);
      alert('School year archived successfully!');
      fetchSchoolYears();
    } catch (err) {
      setError('Failed to archive school year');
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">School Years</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Year</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schoolYears.map((year) => (
            <tr key={year._id} className="hover:bg-gray-100">
              <td className="border p-2">{year.year}</td>
              <td className="border p-2">
                {year.isActive ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-red-500">Archived</span>
                )}
              </td>
              <td className="border p-2">
                <Link
                  to={`/school-year/${year._id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  View
                </Link>
                {year.isActive && (
                  <button
                    onClick={() => handleArchive(year._id)}
                    className="text-red-500 hover:underline"
                  >
                    Archive
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolYearList;