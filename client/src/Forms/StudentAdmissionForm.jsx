import React, { useState } from "react";
import styled from "styled-components";

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
      <h2 className="text-2xl font-bold text-center mb-12">STUDENT ADMISSION FORM</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Page 1: Photo Upload and Preview */}
        {currentPage === 1 && (
          <div className="col-span-2  flex justify-center items-center space-x-6">
            <StyledWrapper>
              <div className="container">
                <div className="folder">
                  <div className="front-side">
                    <div className="tip" />
                    <div className="cover" />
                  </div>
                  <div className="back-side cover" />
                </div>
                <label className="custom-file-upload">
                  <input
                    className="title"
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    accept="image/*"
                  />
                  Choose a file
                </label>
              </div>
            </StyledWrapper>

            {/* Photo Preview */}
            {photoPreview && (
              <div className="flex-shrink-0 border-2 border-gray-300 rounded p-2">
                <img
                  src={photoPreview}
                  alt="Uploaded Photo Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
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
          {currentPage === 1 && (
            <button
              type="button"
              onClick={onClose}
              className="text-[#9d16be] hover:underline"
            >
              Cancel
            </button>
          )}
          {currentPage > 1 && (
            <button
              type="button"
              onClick={prevPage}
              className="text-[#9d16be] hover:underline"
            >
              Previous
            </button>
          )}
          {currentPage < 3 && (
            <button
              type="button"
              onClick={nextPage}
              className="bg-[#9d16be] text-white px-4 py-2 rounded"
            >
              Next
            </button>
          )}
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

const StyledWrapper = styled.div`
  .container {
    --transition: 350ms;
    --folder-W: 120px;
    --folder-H: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    background: linear-gradient(#A78BFA 10%, #ffb3dd 70%);
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    height: calc(var(--folder-H) * 1.7);
    position: relative;
  }

  .folder {
    position: absolute;
    top: -20px;
    left: calc(50% - 60px);
    animation: float 2.5s infinite ease-in-out;
    transition: transform var(--transition) ease;
  }

  .folder:hover {
    transform: scale(1.05);
  }

  .folder .front-side,
  .folder .back-side {
    position: absolute;
    transition: transform var(--transition);
    transform-origin: bottom center;
  }

  .folder .back-side::before,
  .folder .back-side::after {
    content: "";
    display: block;
    background-color: white;
    opacity: 0.5;
    z-index: 0;
    width: var(--folder-W);
    height: var(--folder-H);
    position: absolute;
    transform-origin: bottom center;
    border-radius: 15px;
    transition: transform 350ms;
    z-index: 0;
  }

  .container:hover .back-side::before {
    transform: rotateX(-5deg) skewX(5deg);
  }

  .container:hover .back-side::after {
    transform: rotateX(-15deg) skewX(12deg);
  }

  .folder .front-side {
    z-index: 1;
  }

  .container:hover .front-side {
    transform: rotateX(-40deg) skewX(15deg);
  }

  .folder .tip {
    background: linear-gradient(135deg, #ff9a56, #ff6f56);
    width: 80px;
    height: 20px;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: -10px;
    z-index: 2;
  }

  .folder .cover {
    background: linear-gradient(135deg, #ffe563, #ffc663);
    width: var(--folder-W);
    height: var(--folder-H);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  .custom-file-upload {
    font-size: 1.1em;
    color: #;
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background var(--transition) ease;
    display: inline-block;
    width: 100%;
    padding: 10px 35px;
    position: relative;
  }

  .custom-file-upload:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  .custom-file-upload input[type="file"] {
    display: none;
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(-20px);
    }

    100% {
      transform: translateY(0px);
    }
  }
`;

export default StudentAdmissionForm;
