import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";

const StudentAdmissionForm = ({ onClose, refreshData, editData }) => {
  const [schoolId, setSchoolId] = useState(editData?.schoolId || "");
  const [lrn, setLrn] = useState(editData?.studentData.lrn || "");
  const [email, setEmail] = useState(editData?.email || "");
  const [firstName, setFirstName] = useState(editData?.studentData.firstName || "");
  const [middleName, setMiddleName] = useState(editData?.studentData.middleName || "");
  const [lastName, setLastName] = useState(editData?.studentData.lastName || "");
  const [age, setAge] = useState(editData?.studentData.age || "");
  const [gender, setGender] = useState(editData?.studentData.gender || "");
  const [birthday, setBirthday] = useState(
    editData?.studentData.birthday
      ? new Date(editData.studentData.birthday).toISOString().split("T")[0]
      : ""
  );
  const [address, setAddress] = useState(editData?.studentData.address || "");
  const [parentName, setParentName] = useState(editData?.studentData.parentName || "");
  const [parentRel, setParentRel] = useState(editData?.studentData.parentRel || "");
  const [parentPhone, setParentPhone] = useState(editData?.studentData.parentPhone || "");
  const [program, setProgram] = useState(editData?.studentData.program || "");
  const [level, setLevel] = useState(editData?.studentData.level || "");
  const [className, setClass] = useState(editData?.studentData.class || "");
  const [remarks, setRemarks] = useState(editData?.studentData.remarks || "");
  const [photo, setPhoto] = useState(editData?.studentData.photo || "");

  const [formData, setFormData] = useState({
    schoolId: "",
    lrn: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    age: "",
    birthday: "",
    program: "",
    level: "",
    class: "",
    parentName: "",
    parentRel: "",
    parentPhone: "",
    email: "",
    address: "",
    remarks: "",
    photo: null,
    password: "montoria@1234",
  });
  

  // Update state when editData changes
  useEffect(() => {
    if (editData) {
      setSchoolId(editData.schoolId);
      setLrn(editData.lrn);
      setFirstName(editData.firstName);
      setMiddleName(editData.middleName);
      setLastName(editData.lastName);
      setGender(editData.gender);
      setAge(editData.age);
      setAddress(editData.address);
      setBirthday(editData.birthday);
      setProgram(editData.program);
      setLevel(editData.level);
      setClass(editData.className);
      setRemarks(editData.remarks);
      setParentName(editData.parentName);
      setParentRel(editData.parentRel);
      setParentPhone(editData.parentPhone);
      setEmail(editData.email);
      setPhoto(editData.photo);
    }
  }, [editData]);

  useEffect(() => {
    console.log("Edit Data:", editData);
  }, [editData]);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // const handleChange = (e) => {
  //   if (e.target.name === "photo") {
  //     const file = e.target.files[0];
  //     setFormData({ ...formData, [e.target.name]: file });

  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setPhotoPreview(reader.result);
  //       };
  //       reader.readAsDataURL(file);
  //     } else {
  //       setPhotoPreview(null);
  //     }

  //     const { name, value } = e.target;
  //     if (name === "birthday") {
  //       const isoDate = new Date(value).toISOString();
  //       setFormData({ ...formData, [name]: isoDate });
  //     } else {
  //       setFormData({ ...formData, [name]: value });
  //     }
  //   } else {
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  //   }
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form Data Submitted:", formData);
  //   onClose();
  // };

  useEffect(() => {
    if (editData) {
      setSchoolId(editData.schoolId || "");
      setLrn(editData.studentData?.lrn || "");
      setFirstName(editData.studentData?.firstName || "");
      setMiddleName(editData.studentData?.middleName || "");
      setLastName(editData.studentData?.lastName || "");
      setGender(editData.studentData?.gender || "");
      setAge(editData.studentData?.age || "");
      setAddress(editData.studentData?.address || "");
      setBirthday(
        editData.studentData?.birthday
          ? new Date(editData.studentData.birthday).toISOString().split("T")[0]
          : ""
      );
      setProgram(editData.studentData?.program || "");
      setLevel(editData.studentData?.level || "");
      setClass(editData.studentData?.class || "");
      setRemarks(editData.studentData?.remarks || "");
      setParentName(editData.studentData?.parentName || "");
      setParentRel(editData.studentData?.parentRel || "");
      setParentPhone(editData.studentData?.parentPhone || "");
      setEmail(editData.email || "");
      setPhoto(editData.studentData?.photo || "");
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "schoolId":
        setSchoolId(value);
        break;
      case "lrn":
        setLrn(value);
        break;
      case "firstName":
        setFirstName(value);
        break;
      case "middleName":
        setMiddleName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "gender":
        setGender(value);
        break;
      case "age":
        setAge(value);
        break;
      case "birthday":
        setBirthday(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "program":
        setProgram(value);
        break;
      case "level":
        setLevel(value);
        break;
      case "class":
        setClass(value);
        break;
      case "parentName":
        setParentName(value);
        break;
      case "parentRel":
        setParentRel(value);
        break;
      case "parentPhone":
        setParentPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "remarks":
        setRemarks(value);
        break;
      case "photo":
        const file = e.target.files[0];
        setPhoto(file);
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPhotoPreview(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setPhotoPreview(null);
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const student = {
      schoolId,
      lrn,
      firstName,
      middleName,
      lastName,
      address,
      gender,
      age,
      birthday,
      program,
      level,
      parentName,
      parentRel,
      parentPhone,
      email,
      class: className,
      remarks,
      photo,
      roleId: 3,
      password: "montoria@1234",
    };

    try {
      let response;
      if (editData) {
        // Edit existing guide
        response = await axios.put(
          `http://localhost:4000/api/user/edit-user/${editData._id}`,
          student
        );
      } else {
        // Add new guide
        response = await axios.post(
          "http://localhost:4000/api/user/add-user",
          student
        );
      }

      if (response.data.success) {
        toast.success(
          editData
            ? "Student updated successfully!"
            : "Student enrolled successfully!"
        );
        refreshData();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to save student data.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleProgramChange = (e) => {
    const selectedProgram = e.target.value;
    setProgram(selectedProgram);

    // Automatically set level and reset class when program changes
    if (selectedProgram === "Toddler") {
      setLevel("Toddler");
      setClass("");
    } else if (selectedProgram === "Preschool") {
      setLevel("");
      setClass("");
    } else if (selectedProgram === "Lower Elementary") {
      setLevel("");
      setClass("");
    }
  };

   useEffect(() => {
     setLevel("");
     setClass("");
   }, [program]);
  
  const handleProgramChange1 = (e) => {
    setProgram(e.target.value);
    setLevel("");
    setClass("");
  };

  // Function to calculate age based on birthday
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birthday hasn't occurred yet this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Handle birthday change
  const handleBirthdayChange = (e) => {
    const selectedBirthday = e.target.value;
    setBirthday(selectedBirthday);

    // Calculate and set age if a valid date is selected
    if (selectedBirthday) {
      const calculatedAge = calculateAge(selectedBirthday);
      setAge(calculatedAge);
    } else {
      setAge("");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-8 mt-3">
        {editData ? "Edit Student Information" : "STUDENT ADMISSION FORM"}
      </h2>
      <h3 className="text-xl font-semibold text-center">
        {currentPage === 3 && "Upload Student Profile"}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Page 1: Photo Upload and Preview */}
        {currentPage === 3 && (
          <div className="col-span-2  flex justify-center items-center space-x-6 pt-20">
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
        {currentPage === 1 && (
          <>
            <h3 className="col-span-2 text-xl font-semibold ">
              Student Information
            </h3>
            {/* Column 1 */}
            <div className="space-y-4">
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
              <div className="relative">
                <label className="relative block">
                  <input
                    name="middleName"
                    value={middleName}
                    //onChange={}
                    onChange={(e) => setMiddleName(e.target.value)}
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
              <div className="relative">
                <label className="relative block">
                  <input
                    name="age"
                    value={age}
                    //onChange={(e) => setAge(e.target.value)}
                    type="number"
                    placeholder=""
                    className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
                  />
                  <img
                    src={assets.person_icon}
                    alt="person icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
                  />
                  <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                    Age
                  </span>
                </label>
              </div>
              <div className="relative">
                <label className="relative block">
                  <input
                    name="birthday"
                    value={birthday}
                    required
                    //onChange={handleChange}
                    //onChange={(e) => setBirthday(e.target.value)}
                    onChange={handleBirthdayChange}
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
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="relative">
                <label className="relative block">
                  <input
                    name="lrn"
                    value={lrn}
                    //onChange={handleChange}
                    onChange={(e) => setLrn(e.target.value)}
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
                    LRN
                  </span>
                </label>
              </div>

              <div className="relative">
                <label className="relative block">
                  <select
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full appearance-none bg-white"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <img
                    src={assets.person_icon}
                    alt="person icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
                  />
                  <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                    Gender
                  </span>
                </label>
              </div>

              <div className="relative">
                <label className="relative block">
                  <input
                    name="address"
                    value={address}
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
              <div className="relative">
                <label className="relative block">
                  <select
                    name="program"
                    value={program}
                    //onChange={(e) => setProgram(e.target.value)}
                    onChange={handleProgramChange}
                    required
                    className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full appearance-none bg-white"
                  >
                    <option value="" disabled>
                      Select Program
                    </option>
                    <option value="Toddler">Toddler</option>
                    <option value="Preschool">Preschool</option>
                    <option value="Lower Elementary">Lower Elementary</option>
                  </select>
                  <img
                    src={assets.person_icon}
                    alt="person icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
                  />
                  <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                    Program
                  </span>
                </label>
              </div>
              <div className="relative">
                <label className="relative block">
                  <select
                    name="level"
                    value={level}
                    //onChange={handleLevelChange}
                    onChange={(e) => setLevel(e.target.value)}
                    className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full appearance-none bg-white"
                  >
                    <option value="" disabled>
                      Select Level
                    </option>
                    {program === "Toddler" && (
                      <option value="Toddler">Toddler</option>
                    )}
                    {program === "Preschool" && (
                      <>
                        <option value="Junior Casa">Junior Casa</option>
                        <option value="Junior Advanced Casa">
                          Junior Advanced Casa
                        </option>
                        <option value="Advanced Casa">Advanced Casa</option>
                      </>
                    )}
                    {program === "Lower Elementary" && (
                      <>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                      </>
                    )}
                  </select>
                  <img
                    src={assets.person_icon}
                    alt="person icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
                  />
                  <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                    Level
                  </span>
                </label>
              </div>
              <div className="relative">
                <label className="relative block">
                  <select
                    name="class"
                    value={className}
                    //onChange={handleClassChange}
                    onChange={(e) => setClass(e.target.value)}
                    className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full appearance-none bg-white"
                  >
                    <option value="" disabled>
                      Select Class Section
                    </option>
                    {program === "Toddler" && (
                      <>
                        <option value="Playgroup 1">Playgroup 1</option>
                        <option value="Playgroup 2">Playgroup 2</option>
                      </>
                    )}
                    {program === "Preschool" && (
                      <>
                        <option value="Casa 1">Casa 1</option>
                        <option value="Casa 2">Casa 2</option>
                      </>
                    )}
                    {program === "Lower Elementary" && (
                      <>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                      </>
                    )}
                  </select>
                  <img
                    src={assets.person_icon}
                    alt="person icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
                  />
                  <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                    Class Section
                  </span>
                </label>
              </div>
            </div>
          </>
        )}

        {/* Page 3: Parent Information */}
        {currentPage === 2 && (
          <div className="space-y-4 col-span-2">
            <h3 className="text-xl font-semibold mb-4">
              Parent / Guardian Information
            </h3>
            <div className="relative">
              <label className="relative block">
                <input
                  name="parentName"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
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
                  Full Name
                </span>
              </label>
            </div>
            <div className="relative">
              <label className="relative block">
                <input
                  name="parentRel"
                  value={parentRel}
                  onChange={(e) => setParentRel(e.target.value)}
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
                  Relationship
                </span>
              </label>
            </div>
            <div className="relative">
              <label className="relative block">
                <input
                  name="parentPhone"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
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
            <div className="relative">
              <label className="relative block">
                <input
                  name="email"
                  value={email}
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
            <div className="relative">
              <label className="relative block">
                <input
                  name="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  type="text"
                  placeholder="Medical conditions, special needs, allergies"
                  className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full"
                />
                <img
                  src={assets.person_icon}
                  alt="person icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"
                />
                <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-white peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                  Remarks
                </span>
              </label>
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

StudentAdmissionForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  editData: PropTypes.object,
};

export default StudentAdmissionForm;
