import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";

const AdminForm = ({ onClose, refreshData, editData }) => {
  // Initialize state with default values
  const [schoolId, setSchoolId] = useState(editData?.schoolId || "");
  const [email, setEmail] = useState(editData?.email || "");
  const [name, setName] = useState(editData?.adminData?.name || ""); // Safely access nested properties
  const [contactNumber, setContactNumber] = useState(
    editData?.adminData?.contactNumber || ""
  );
  const [photo, setPhoto] = useState(editData?.adminData?.photo || "");
  const [photoPreview, setPhotoPreview] = useState(null);

  // Update state when editData changes
  useEffect(() => {
    if (editData) {
      setSchoolId(editData.schoolId || "");
      setEmail(editData.email || "");
      setName(editData.adminData?.name || ""); // Safely access nested properties
      setContactNumber(editData.adminData?.contactNumber || "");
      setPhoto(editData.adminData?.photo || "");
    }
  }, [editData]);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      if (file) {
        const validTypes = ["image/jpeg", "image/png"];
        if (validTypes.includes(file.type)) {
          setPhoto(file); // Update the photo state with the file object
          setPhotoPreview(URL.createObjectURL(file)); // Generate a preview URL
        } else {
          toast.error("Please upload a valid image file (JPEG or PNG).", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          e.target.value = ""; // Clear the file input
        }
      }
    } else {
      const { name, value } = e.target;
      if (name === "birthday") {
        const isoDate = new Date(value).toISOString();
        setFormData({ ...formData, [name]: isoDate });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const admin = {
      schoolId: schoolId,
      email: email,
      contactNumber: contactNumber,
      name: name,
      photo: photo,
      roleId: 1,
      password: "montoria@1234",
    };

    try {
      let response;
      if (editData) {
        // Edit existing admin
        response = await axios.put(
          `http://localhost:4000/api/user/edit-user/${editData._id}`,
          admin
        );
      } else {
        // Add new admin
        response = await axios.post(
          "http://localhost:4000/api/user/add-user",
          admin
        );
      }

      if (response.data.success) {
        toast.success(
          editData ? "Admin updated successfully!" : "Admin added successfully!"
        );
        refreshData();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to save admin data.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">
        {editData ? "Edit Admin" : "Add New Admin"}
      </h2>
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {/* Photo Upload and Preview */}
        <div className="col-span-2 flex justify-center items-center space-x-6 pt-12 pb-5">
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
                  accept="image/jpeg, image/png"
                />
                Choose an Image
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

        {/* School ID */}
        <div className="relative">
          <label className="relative block">
            <input
              name="schoolId"
              value={schoolId}
              onChange={(e) => {
                const input = e.target.value;
                // Allow only digits and enforce the format "0000-000000"
                if (/^\d{0,4}-?\d{0,6}$/.test(input)) {
                  setSchoolId(input);
                }
              }}
              onBlur={(e) => {
                // Ensure the format is complete when the input loses focus
                const input = e.target.value;
                if (/^\d{4}-\d{6}$/.test(input)) {
                  setSchoolId(input);
                } else {
                  setSchoolId(""); // Clear the input if the format is invalid
                }
              }}
              required
              type="text"
              placeholder="School ID (Format: 0000-000000)"
              className="px-4 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 focus:border-green-400 w-full"
            />
          </label>
          {/* Display validation error if needed */}
          {schoolId && !/^\d{4}-\d{6}$/.test(schoolId) && (
            <p className="text-red-500 text-sm ml-3 mt-1">
              School ID must be in the format 0000-000000.
            </p>
          )}
        </div>

        {/* Name */}
        <div className="relative">
          <label className="relative block">
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
              placeholder="Name"
              className="px-4 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 focus:border-green-400 w-full"
            />
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <label className="relative block">
            <input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="Email"
              className="px-4 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 focus:border-green-400 w-full"
            />
          </label>
        </div>

        {/* Phone Number */}
        <div className="relative">
          <label className="relative block">
            <input
              name="contactNumber"
              value={contactNumber}
              onChange={(e) => {
                const input = e.target.value;
                // Allow only digits and limit to 11 characters
                if (/^\d{0,11}$/.test(input)) {
                  setContactNumber(input);
                }
              }}
              required
              type="text" // Use type="text" to allow input handling
              placeholder="Phone Number"
              className="px-4 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 focus:border-green-400 w-full"
            />
          </label>
          {/* Display validation error if needed */}
          {contactNumber.length !== 11 && contactNumber.length > 0 && (
            <p className="text-red-500 text-sm ml-3 mt-1">
              Phone number must be exactly 11 digits.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-[#9d16be] hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#9d16be] text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

AdminForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  editData: PropTypes.object,
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
    background: linear-gradient(#a78bfa 10%, #ffb3dd 70%);
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

export default AdminForm;
