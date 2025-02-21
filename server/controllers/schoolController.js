import programModel from "../models/acads/programModel.js";
import levelModel from "../models/acads/levelModel.js";
import classModel from "../models/acads/classModel.js";
import areaModel from "../models/acads/areaModel.js";
import lessonModel from "../models/acads/lessonModel.js";
import workModel from "../models/acads/workModel.js";
import materialModel from "../models/acads/materialModel.js";

import curriculumModel from "../models/acads/curriculumModel.js";

export const addCurriculum = async (req, res) => { 
  const { curId, progName, levelName, areaName, lessonName, workName, materialName, photo } = req.body;
  if ( !curId, !progName || !levelName || !areaName || !lessonName || !workName ) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  const existingCurId = await curriculumModel.findOne({ curId });
    if (existingCurId) {
      return res.status(400).json({ success: false, message: "Curriculum already exist." });
    }

  try {
    const newCurriculum = new curriculumModel({ curId, progName, levelName, areaName, lessonName, workName, materialName, photo: photo || null });
    await newCurriculum.save();
    res.status(201).json({ success: true, message: "Curriculum added successfully", data: newCurriculum });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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



