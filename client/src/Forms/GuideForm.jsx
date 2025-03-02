import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";

const GuideForm = ({ onClose, refreshData, editData }) => {
  const [guideType, setType] = useState(editData?.guideData.guideType || "");
  const [schoolId, setSchoolId] = useState(editData?.schoolId || "");
  const [firstName, setFirstName] = useState(editData?.guideData.firstName || "");
  const [middleName, setMiddleName] = useState(editData?.guideData.middleName || "");
  const [lastName, setLastName] = useState(editData?.guideData.lastName || "");
  const [address, setAddress] = useState(editData?.guideData.address || "");
  //const [birthday, setBirthday] = useState(editData?.guideData.birthday || "");
  const [birthday, setBirthday] = useState(
    editData?.guideData.birthday
      ? new Date(editData.guideData.birthday).toISOString().split("T")[0]
      : ""
  );
  const [contactNumber, setContactNumber] = useState(editData?.guideData.contactNumber || "");
  const [email, setEmail] = useState(editData?.email || "");
  const [className, setClass] = useState(editData?.guideData.class || "");
  const [photo, setPhoto] = useState(editData?.guideData.photo || "");

  const [formData, setFormData] = useState({
    guideType: "",
    schoolId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    birthday: "",
    class: "",
    contactNumber: "",
    email: "",
    address: "",
    photo: null,
  });
  
  // Update state when editData changes
  useEffect(() => {
    if (editData) {
      setType(editData.guideType);
      setSchoolId(editData.schoolId);
      setFirstName(editData.firstName);
      setMiddleName(editData.middleName);
      setLastName(editData.lastName);
      setAddress(editData.address);
      setBirthday(editData.birthday);
      setContactNumber(editData.contactNumber);
      setEmail(editData.email);
      setClass(editData.className);
      setPhoto(editData.photo);
    }
  }, [editData]);
  const [photoPreview, setPhotoPreview] = useState(null);

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

      const { name, value } = e.target;
      if (name === "birthday") {
        const isoDate = new Date(value).toISOString();
        setFormData({ ...formData, [name]: isoDate });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const guide = {
      guideType: guideType,
      schoolId: schoolId,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      address: address,
      birthday: birthday,
      contactNumber: contactNumber,
      email: email,
      class: className,
      photo: photo, 
      roleId: 2,
      password: "montoria@1234",
    };

    try {
      let response;
      if (editData) {
        // Edit existing guide
        response = await axios.put(
          `http://localhost:4000/api/user/edit-user/${editData._id}`,
          guide
        );
      } else {
        // Add new guide
        response = await axios.post(
          "http://localhost:4000/api/user/add-user",
          guide
        );
      }

      if (response.data.success) {
        toast.success(editData ? "Guide updated successfully!" : "Guide added successfully!");
        refreshData();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to save guide data.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">
        {editData ? "Edit Guide Information" : "Add New Guide"}
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
                  value={photo}
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

        {/* Teacher Type Dropdown */}
        <div className="relative block">
          <label className="relative block">
            <select
              name="guideType"
              value={guideType}
              //onChange={handleChange}
              onChange={(e) => setType(e.target.value)}
              required
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full appearance-none bg-white"
            >
              <option value="" disabled>
                Select Teacher Type
              </option>
              <option value="General">General</option>
              <option value="Preschool">Preschool</option>
              <option value="Lower Elementary">Lower Elementary</option>
            </select>
            <img
              src={assets.person_icon}
              alt="person icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Teacher Type
            </span>
          </label>
        </div>

        {/* School ID */}
        <div className="relative">
          <label className="relative block">
            <input
              name="schoolId"
              value={schoolId}
              //onChange={handleChange}
              onChange={(e) => setSchoolId(e.target.value)}
              required
              type="text"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.person_icon}
              alt="person icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              School ID
            </span>
          </label>
        </div>

        {/* First Name */}
        <div className="relative">
          <label className="relative block">
            <input
              name="firstName"
              value={firstName}
              //onChange={handleChange}
              onChange={(e) => setFirstName(e.target.value)}
              required
              type="text"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.person_icon}
              alt="person icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              First Name
            </span>
          </label>
        </div>

        {/* Birthday */}
        <div className="relative">
          <label className="relative block">
            <input
              name="birthday"
              value={birthday}
              //onChange={handleChange}
              onChange={(e) => setBirthday(e.target.value)}
              required
              type="date"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.person_icon}
              alt="person icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Birthday
            </span>
          </label>
        </div>

        {/* Middle Name */}
        <div className="relative">
          <label className="relative block">
            <input
              name="middleName"
              value={middleName}
              //onChange={}
              onChange={(e) => setMiddleName(e.target.value)}
              required
              type="text"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.person_icon}
              alt="person icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Middle Name
            </span>
          </label>
        </div>

        {/* Phone Number */}
        <div className="relative">
          <label className="relative block">
            <input
              name="contactNumber"
              value={contactNumber}
              //onChange={}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              type="string"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.mail_icon}
              alt="phone icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Phone Number
            </span>
          </label>
        </div>

        {/* Last Name */}
        <div className="relative">
          <label className="relative block">
            <input
              name="lastName"
              value={lastName}
              //onChange={}
              onChange={(e) => setLastName(e.target.value)}
              required
              type="text"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.person_icon}
              alt="person icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Last Name
            </span>
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <label className="relative block">
            <input
              name="email"
              value={email}
              //onChange={}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.mail_icon}
              alt="email icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Email
            </span>
          </label>
        </div>

        {/* Address */}
        <div className="relative">
          <label className="relative block">
            <input
              name="address"
              value={address}
              //onChange={}
              onChange={(e) => setAddress(e.target.value)}
              required
              type="text"
              placeholder=""
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
            />
            <img
              src={assets.person_icon}
              alt="person icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Address
            </span>
          </label>
        </div>

        {/* Class Assigned */}
        <div className="relative">
          <label className="relative block">
            <select
              name="class"
              value={className}
              onChange={(e) => setClass(e.target.value)}
              //onChange={}
              className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full appearance-none bg-white"
            >
              <option value="" disabled>
                Select Class Assigned
              </option>
              <option value="Casa 1">Casa 1</option>
              <option value="Casa 2">Casa 2</option>
              <option value="Class 1">Class 1</option>
            </select>
            <img
              src={assets.person_icon}
              alt="person icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
            />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
              Class Assigned
            </span>
          </label>
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

GuideForm.propTypes = {
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
export default GuideForm;