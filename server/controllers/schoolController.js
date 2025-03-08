import programModel from "../models/acads/programModel.js";
import levelModel from "../models/acads/levelModel.js";
import classModel from "../models/acads/classModel.js";
import areaModel from "../models/acads/areaModel.js";
import lessonModel from "../models/acads/lessonModel.js";
import workModel from "../models/acads/workModel.js";
import materialModel from "../models/acads/materialModel.js";
import curriculumModel from "../models/acads/curriculumModel.js";
import userModel from "../models/roles/userModel.js";


export const addCurriculum = async (req, res) => { 
  const { Program, Level, Areas, Material, Lesson, Work } = req.body;
  if ( !Program || !Level || !Areas || !Material || !Lesson || !Work ) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  const existing = await curriculumModel.findOne({ Program, Level, Areas, Material, Lesson, Work });
    if (existing) {
      return res.status(400).json({ success: false, message: "Curriculum already exist." });
    }

  try {
    const newCurriculum = new curriculumModel({ Program, Level, Areas, Material, Lesson, Work });
    await newCurriculum.save();
    res.status(201).json({ success: true, message: "Curriculum added successfully", data: newCurriculum });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCurriculum = async (req, res) => {
  try {
    const data = await curriculumModel.find();

    if (!data.length) {
      return res.json({ success: false, message: "No data found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteCurriculum = async (req, res) => {
  try {
    const { id } = req.params;

    const curriculum = await curriculumModel.findById(id);
    if (!curriculum) {
      return res
        .status(404)
        .json({ success: false, message: "Curriculum not found" });
    }

    await curriculumModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Curriculum deleted successfully" });
  } catch (error) {
    console.error("Error deleting curriculum:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while deleting curriculum",
      });
  }
};

export const editCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const curriculum = await curriculumModel.findById(id);
    if (!curriculum) {
      return res
        .status(404)
        .json({ success: false, message: "Curriculum not found" });
    }

    const updatedCurriculum = await curriculumModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Curriculum updated successfully",
      data: updatedCurriculum,
    });
  } catch (error) {
    console.error("Error updating curriculum:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while updating curriculum",
      });
  }
};




export const getClassList = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId).exec();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let students;
    if (user.role === "admin") {
      students = await userModel.find({ role: "student" }).exec();
    } else if (user.role === "guide") {
      const assignedClass = user.guideData?.class;
      if (!assignedClass) {
        return res
          .status(400)
          .json({ success: false, message: "Guide class not assigned" });
      }
      students = await userModel
        .find({
          role: "student",
          "studentData.class": assignedClass,
        })
        .exec();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error("Error in getClassList:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



/*--------------LESSON PLAN PAGE---------------------- */


export const lessonPlan = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId).exec();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let students;
    if (user.role === "admin") {
      students = await userModel.find({ role: "student" }).exec();
    } else if (user.role === "guide") {
      const assignedClass = user.guideData?.class;
      if (!assignedClass) {
        return res
          .status(400)
          .json({ success: false, message: "Guide class not assigned" });
      }
      students = await userModel
        .find({
          role: "student",
          "studentData.class": assignedClass,
        })
        .exec();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const curriculumData = await curriculumModel.find();

    if (!curriculumData.length) {
      return res.json({ success: false, message: "No data found" });
    }

    res.status(200).json({ success: true, students, curriculumData });
  } catch (error) {
    console.error("Error in lessonPlan:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




export const saveLesson = async (req, res) => {
  try {
    const { studentId, lesson_work, addedBy, remarks, start_date } = req.body;

    if (!studentId || !lesson_work || !addedBy || !start_date) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID, lesson work, addedBy, and start_date are required",
      });
    }

    const student = await userModel.findById(studentId).exec();
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Check if the lesson already exists
    const lessonExists = student.studentData.lessons.some(
      (lesson) => lesson.lesson_work === lesson_work
    );

    if (lessonExists) {
      return res.status(400).json({
        success: false,
        message: "This lesson is already saved for the student.",
      });
    }

    // Add the lesson to the student's lessons array
    student.studentData.lessons.push({
      lesson_work,
      addedBy,
      remarks,
      start_date,
      subwork: [], // Initialize subwork as an empty array
    });
    await student.save();

    res
      .status(200)
      .json({ success: true, message: "Lesson saved successfully" });
  } catch (error) {
    console.error("Error saving lesson:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




export const deleteLesson = async (req, res) => {
  try {
    const { studentId, lesson_work } = req.query; // Read from query parameters

    // Validate required fields
    if (!studentId || !lesson_work) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Lesson Work are required",
      });
    }

    // Find the student by ID
    const student = await userModel.findById(studentId).exec();
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Remove the lesson from the student's lessons array
    student.studentData.lessons = student.studentData.lessons.filter(
      (lesson) => lesson.lesson_work !== lesson_work
    );

    // Save the updated student
    await student.save();

    // Return success response
    res.json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting lesson",
    });
  }
};




/*----------------PROGRESS PAGE------------------- */


export const getSubwork = async (req, res) => {
  const { studentId, lessonIndex } = req.query;

  if (!studentId || !lessonIndex) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Student ID and Lesson Index are required.",
      });
  }

  try {
    // Find the student by their ID
    const student = await userModel.findOne({
      "studentData.schoolId": studentId,
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    // Check if the lesson index is valid
    if (lessonIndex < 0 || lessonIndex >= student.studentData.lessons.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid lesson index." });
    }

    // Get the subwork for the specified lesson
    const subwork = student.studentData.lessons[lessonIndex].subwork;

    res.status(200).json({ success: true, subwork });
  } catch (error) {
    console.error("Error in fetching subwork:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addSubwork = async (req, res) => {
  try {
    const { studentId, lessonIndex, subwork } = req.body;

    // Log the request payload for debugging
    console.log("Request Payload:", { studentId, lessonIndex, subwork });

    // Validate required fields
    if (!studentId || lessonIndex === undefined || !subwork) {
      return res.status(400).json({
        success: false,
        message: "studentId, lessonIndex, and subwork are required.",
      });
    }

    // Find the student by ID
    const student = await userModel.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    // Check if the lesson exists
    if (!student.studentData.lessons[lessonIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found." });
    }

    // Create a new subwork entry
    const newSubwork = {
      subwork_name: subwork.subwork_name,
      status: subwork.status,
      status_date: subwork.status_date || new Date(), // Automatically set the current date
      subwork_remarks: subwork.subwork_remarks || "", // Optional field
      updatedBy: subwork.updatedBy,
    };

    // Add the new subwork to the lesson's subwork array
    student.studentData.lessons[lessonIndex].subwork.push(newSubwork);

    // Save the updated student document
    await student.save();

    // Return the updated student document
    res.status(200).json({
      success: true,
      message: "Subwork added successfully.",
      data: student,
    });
  } catch (error) {
    console.error("Error in addSubwork:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};






export const getStudentList = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId).exec();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let students;
    if (user.role === "admin") {
      students = await userModel.find({ role: "student" }).exec();
    } else if (user.role === "guide") {
      const assignedClass = user.guideData?.class;
      if (!assignedClass) {
        return res
          .status(400)
          .json({ success: false, message: "Guide class not assigned" });
      }
      students = await userModel
        .find({
          role: "student",
          "studentData.class": assignedClass,
        })
        .exec();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error("Error in getClassList:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};





/*--------------------------------------------------------- */

export const addLevel = async (req, res) => {
  try {
    const { levelName, progName } = req.body;

    // Check if the level already exists in the same program
    const existingLevel = await levelModel.findOne({ levelName, progName });
    if (existingLevel) {
      return res.status(400).json({ success: false, message: "Level already exists in this program." });
    }

    const newLevel = new levelModel({ levelName, progName });
    await newLevel.save();
    //const savedLevel = await levelModel.findById(newLevel._id).populate('progId', 'progName');
    res.status(201).json({ success: true, message: "Level added successfully.", level: newLevel });
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const addProgram = async (req, res) => {
  try {
    const { progName } = req.body;
    const existingProgram = await programModel.findOne({ progName });
    if (existingProgram) {
      return res.status(400).json({ success: false, message: "Program already exists." });
    }

    const newProgram = new programModel({ progName });
    await newProgram.save();
    res.status(201).json({ success: true, message: "Program added successfully.", program: newProgram });
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const addClass = async (req, res) => {
  try {
    const { progName, className, guides, capacity, students, schedule } = req.body;

    // Check if the class name already exists in the same program
    const existingClass = await classModel.findOne({ progName, className });
    if (existingClass) {
      return res.status(400).json({ success: false, message: "Class already exists in this program." });
    }

    const existingProgram = await programModel.findOne({ progName });
    if (!existingProgram) {
      return res.status(404).json({ success: false, message: "Program not found." });
    }
    // Create the new class
    const newClass = new classModel({
      progName,
      className,
      guides: guides || [],
      capacity,
      students: students || [],
      schedule: {
        days: schedule?.days || [],
        startTime: schedule?.startTime,
        endTime: schedule?.endTime,
      }
    });

    await newClass.save();
    res.status(201).json({ success: true, message: "Class added successfully.", class: newClass });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const addArea = async (req, res) => {
  const { areaName, levelName } = req.body;

  if (!areaName || !levelName) {
    return res.status(400).json({ success: false, message: "Name and Level are required" });
  }

  try {
    const newArea = new areaModel({ areaName, levelName });
    await newArea.save();
    res.status(201).json({ success: true, message: "Area added successfully", data: newArea });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addLesson = async (req, res) => {
  const { name, area } = req.body;

  if (!name || !area) {
    return res.status(400).json({ success: false, message: "Name and Area are required" });
  }

  try {
    const newLesson = new lessonModel({ name, area });
    await newLesson.save();
    res.status(201).json({ success: true, message: "Lesson added successfully", data: newLesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addWork = async (req, res) => {
  const { name, lesson, materials } = req.body;

  if (!name || !lesson) {
    return res.status(400).json({ success: false, message: "Name and Lesson are required" });
  }

  try {
    const newWork = new workModel({ name, lesson, materials });
    await newWork.save();
    res.status(201).json({ success: true, message: "Work added successfully", data: newWork });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMaterial = async (req, res) => {
  const { name, photo, works } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }

  try {
    const newMaterial = new materialModel({ name, photo: photo || null, works });
    await newMaterial.save();
    res.status(201).json({ success: true, message: "Material added successfully", data: newMaterial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



