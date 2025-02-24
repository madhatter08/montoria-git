import React, { useState } from "react";

const StudentAdmissionForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    schoolId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    age: "",
    birthday: "",
    level: "",
    class: "",
    parent: "",
    relationship: "",
    phoneNumber: "",
    email: "",
    address: "",
    remarks: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      setFormData({ ...formData, [e.target.name]: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    onClose();
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">STUDENT ADMISSION FORM</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Page 1: Photo Upload and Preview */}
        {currentPage === 1 && (
          <div className="col-span-2 flex flex-col items-center space-y-4">
            <h3 className="text-xl font-semibold mb-4">Upload Student's Photo</h3>
            {/* Photo Preview with Border */}
            {photoPreview && (
              <div className="flex-shrink-0 border-2 border-gray-300 rounded p-2">
                <img
                  src={photoPreview}
                  alt="Uploaded Photo Preview"
                  className="w-50 h-50 object-cover rounded"
                />
              </div>
            )}
            {/* Upload Photo Icon and Text */}
            <label className="cursor-pointer flex items-center space-y-2">
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="hidden"
                accept="image/*"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-500 hover:text-[#9d16be]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-500">Drag or drop a photo</span>
            </label>
          </div>
        )}

        {/* Page 2: Student Information */}
        {currentPage === 2 && (
          <>
            <h3 className="col-span-2 text-xl font-semibold ">Student Information</h3>
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <input
                  type="text"
                  name="schoolId"
                  placeholder="2022-1234"
                  value={formData.schoolId}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <input
                  type="text"
                  name="middleName"
                  placeholder="Middle Name"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <input
                  type="text"
                  name="gender"
                  placeholder="Gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <input
                  type="text"
                  name="level"
                  placeholder="Level"
                  value={formData.level}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <input
                  type="text"
                  name="class"
                  placeholder="Class"
                  value={formData.class}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          </>
        )}

        {/* Page 3: Parent Information */}
        {currentPage === 3 && (
          <div className="space-y-4 col-span-2">
            <h3 className="text-xl font-semibold mb-4">Parent Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="parent"
                placeholder="Parent Name"
                value={formData.parent}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="relationship"
                placeholder="Relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="remarks"
                placeholder="Remarks (Medical conditions, special needs, allergies)"
                value={formData.remarks}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="col-span-2 flex justify-end space-x-4 mt-6">
          {/* Cancel Button (Only on the first page) */}
          {currentPage === 1 && (
            <button
              type="button"
              onClick={onClose}
              className="text-[#9d16be] hover:underline"
            >
              Cancel
            </button>
          )}

          {/* Previous Button (On pages 2 and 3) */}
          {currentPage > 1 && (
            <button
              type="button"
              onClick={prevPage}
              className="text-[#9d16be] hover:underline"
            >
              Previous
            </button>
          )}

          {/* Next Button (On pages 1 and 2) */}
          {currentPage < 3 && (
            <button
              type="button"
              onClick={nextPage}
              className="bg-[#9d16be] text-white px-4 py-2 rounded"
            >
              Next
            </button>
          )}

          {/* Confirm Button (Only on the third page) */}
          {currentPage === 3 && (
            <button
              type="submit"
              className="bg-[#9d16be] text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentAdmissionForm;