import programModel from "../models/acads/programModel.js";
import levelModel from "../models/acads/levelModel.js";
import classModel from "../models/acads/classModel.js";
import areaModel from "../models/acads/areaModel.js";
import lessonModel from "../models/acads/lessonModel.js";
import workModel from "../models/acads/workModel.js";
import materialModel from "../models/acads/materialModel.js";
import curriculumModel from "../models/acads/curriculumModel.js";
import userModel from "../models/roles/userModel.js";
import OpenAI from "openai";

// Initialize OpenAI client with DeepSeek API
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.SUMMARIZER_API_KEY, // Ensure this is set in your .env file
});

// Fetch student by schoolId
export const getStudentById = async (req, res) => {
  try {
    const { schoolId } = req.params;

    // Find the student by schoolId
    const student = await userModel.findOne({ schoolId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    // Return the student data
    res.status(200).json({ success: true, ...student.toObject() });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student." });
  }
};

// Preload student data
const preloadStudentData = async () => {
  try {
    // Fetch all students
    const studentData = await userModel.find({ role: "student" }).exec();
    console.log("Student data preloaded successfully:", studentData.length, "documents found");
  } catch (error) {
    console.error("Error preloading student data:", error);
  }
};

preloadStudentData();

// Function to summarize feedback using DeepSeek API
export const summarizeFeedback = async (req, res) => {
  const { feedback, studentName } = req.body; // Feedback text and student name

  if (!feedback || !studentName) {
    return res.status(400).json({ success: false, message: "Feedback text and student name are required." });
  }

  try {
    // Call the DeepSeek API for summarization
    const response = await openai.chat.completions.create({
      model: "deepseek-reasoner", // Use the appropriate DeepSeek model
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes feedback for student progress reports in a Montessori setting. " +
            "Provide a concise summary of the feedback and include suggestions for improvement. " +
            "Respond without using bold (*text*) or any other markdown formatting. " +
            "Focus on Montessori principles such as independence, self-directed learning, and holistic development. " +
            "Format the response as follows:\n\n" +
            "Progress Report:\n[Summary of the feedback]\n\n" +
            "Suggestions for Improvement:\n1. [First suggestion]\n2. [Second suggestion]\n3. [Third suggestion] (if applicable)\n\n" +
            "Ensure that each suggestion is clear, actionable, and aligns with Montessori principles."
          
        },
        {
          role: "user",
          content: `Summarize the following feedback for ${studentName} and provide suggestions for improvement based on Montessori principles:\n\n${feedback}`,
        },
      ],
      max_tokens: 300, // Increase token limit for detailed feedback
    });

    // Extract the summarized feedback
    const summary = response.choices[0].message.content;

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error summarizing feedback:", error);
    res.status(500).json({ success: false, message: "Failed to summarize feedback." });
  }
};

// Get Feedback by Quarter
export const getFeedbackByQuarter = async (req, res) => {
  console.log("getFeedbackByQuarter called");
  try {
    const { studentId, quarter } = req.query;

    // Log the incoming query parameters
    console.log("studentId:", studentId);
    console.log("quarter:", quarter);

    if (!studentId || !quarter) {
      console.log("Missing studentId or quarter"); // Log if parameters are missing
      return res.status(400).json({ success: false, message: "studentId and quarter are required." });
    }

    // Find the student by ID
    const student = await userModel.findById(studentId);
    console.log("Student Document:", student); // Log the fetched student document

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    // Log the entire student document for debugging
    console.log("Student Document:", JSON.stringify(student, null, 2));

    // Check if the student has the studentData field
    if (!student.studentData || !student.studentData.quarters) {
      return res.status(404).json({ success: false, message: "No quarters data found for the student." });
    }

    // Log the quarters array for debugging
    console.log("Quarters Array:", JSON.stringify(student.studentData.quarters, null, 2));

    // Find the selected quarter's feedback
    const quarterData = student.studentData.quarters.find(
      (q) => q.quarter === parseInt(quarter)
    );

    // Log the found quarter data for debugging
    console.log("Quarter Data:", JSON.stringify(quarterData, null, 2));
    console.log("Quarter Data:", quarterData);

    if (!quarterData || !quarterData.feedback || quarterData.feedback.length === 0) {
      console.log("No feedback found for the selected quarter");
      return res.status(404).json({ success: false, message: "No feedback found for the selected quarter." });
    }

    // Return the feedback for the selected quarter
    console.log("quarterData", quarterData.feedback);
    res.status(200).json({ success: true, feedback: quarterData.feedback });
  } catch (error) {
    console.error("Error fetching feedback by quarter:", error);
    res.status(500).json({ success: false, message: "Failed to fetch feedback by quarter." });
  }
};

// Handle Generate button click
export const handleGenerate = async (req, res) => {
  const { studentId, quarter } = req.body;

  if (!studentId || !quarter) {
    return res.status(400).json({ success: false, message: "Student ID and quarter are required." });
  }

  try {
    // Fetch the feedback for the selected quarter
    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const quarterData = student.quarters.find((q) => q.quarter === parseInt(quarter));
    if (!quarterData) {
      return res.status(404).json({ success: false, message: "No feedback found for the selected quarter." });
    }

    // Summarize the feedback
    const feedbackText = quarterData.feedback;
    const response = await openai.chat.completions.create({
      model: "deepseek-reasoner",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes feedback for student progress reports. Provide a concise summary of the feedback and include suggestions for improvement.",
        },
        {
          role: "user",
          content: `Summarize the following feedback in one paragraph and provide suggestions for improvement: ${feedbackText}`,
        },
      ],
      max_tokens: 200,
    });

    const summary = response.choices[0].message.content;

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ success: false, message: "Failed to generate summary." });
  }
};

// Add Curriculum
export const addCurriculum = async (req, res) => {
  const { Program, Level, Areas, Material, Lesson, Work } = req.body;
  if (!Program || !Level || !Areas || !Material || !Lesson || !Work) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  const existing = await curriculumModel.findOne({ Program, Level, Areas, Material, Lesson, Work });
  if (existing) {
    return res.status(400).json({ success: false, message: "Curriculum already exists." });
  }

  try {
    const newCurriculum = new curriculumModel({ Program, Level, Areas, Material, Lesson, Work });
    await newCurriculum.save();
    res.status(201).json({ success: true, message: "Curriculum added successfully", data: newCurriculum });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Curriculum
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

// Delete Curriculum
export const deleteCurriculum = async (req, res) => {
  try {
    const { id } = req.params;

    const curriculum = await curriculumModel.findById(id);
    if (!curriculum) {
      return res.status(404).json({ success: false, message: "Curriculum not found" });
    }

    await curriculumModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Curriculum deleted successfully" });
  } catch (error) {
    console.error("Error deleting curriculum:", error);
    res.status(500).json({ success: false, message: "Server error while deleting curriculum" });
  }
};

// Edit Curriculum
export const editCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const curriculum = await curriculumModel.findById(id);
    if (!curriculum) {
      return res.status(404).json({ success: false, message: "Curriculum not found" });
    }

    const updatedCurriculum = await curriculumModel.findByIdAndUpdate(id, updatedData, { new: true });

    res.json({
      success: true,
      message: "Curriculum updated successfully",
      data: updatedCurriculum,
    });
  } catch (error) {
    console.error("Error updating curriculum:", error);
    res.status(500).json({ success: false, message: "Server error while updating curriculum" });
  }
};

// Get Class List
export const getClassList = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let students;
    if (user.role === "admin") {
      students = await userModel.find({ role: "student" }).exec();
    } else if (user.role === "guide") {
      const assignedClass = user.guideData?.class;
      if (!assignedClass) {
        return res.status(400).json({ success: false, message: "Guide class not assigned" });
      }
      students = await userModel
        .find({
          role: "student",
          "studentData.class": assignedClass,
        })
        .exec();
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
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



//END

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
    res.status(201).json({ success: true, message: "Level added successfully.", level: newLevel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Add Program
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

// Add Class
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
      },
    });

    await newClass.save();
    res.status(201).json({ success: true, message: "Class added successfully.", class: newClass });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Add Area
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

// Add Lesson
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

// Add Work
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

// Add Material
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