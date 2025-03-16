import express from "express";
import {
  addLevel,
  addProgram,
  addClass,
  addArea,
  addLesson,
  addWork,
  addMaterial,
  addCurriculum,
  getAllCurriculum,
  deleteCurriculum,
  editCurriculum,
  getClassList,
  getFeedbackByQuarter,
  summarizeFeedback,
  lessonPlan,
  saveLesson,
  deleteLesson,
  getSubwork,
  addSubwork,
  getStudentById,
  saveLessonToMultiple,
  saveProgress,
  saveFeedback,
} from "../controllers/schoolController.js";
import userToken from "../middleware/userToken.js";

const schoolRouter = express.Router();

// Other routes
schoolRouter.post("/add-program", addProgram);
schoolRouter.post("/add-level", addLevel);
schoolRouter.post("/add-class", addClass);
schoolRouter.post("/add-area", addArea);
schoolRouter.post("/add-lesson", addLesson);
schoolRouter.post("/add-work", addWork);
schoolRouter.post("/add-material", addMaterial);

schoolRouter.post("/add-curriculum", addCurriculum);
schoolRouter.get("/get-curriculum", getAllCurriculum);
schoolRouter.delete("/delete-curriculum/:id", deleteCurriculum);
schoolRouter.put("/edit-curriculum/:id", editCurriculum);

schoolRouter.get("/student/:schoolId", getStudentById);
schoolRouter.get("/class-list", userToken, getClassList);

// Updated feedback routes
schoolRouter.get("/get-feedback", userToken, getFeedbackByQuarter); // Use schoolId and quarter as query params
schoolRouter.post("/summarize-feedback", userToken, summarizeFeedback); // Protected route

schoolRouter.get("/lesson-plan", userToken, lessonPlan);
schoolRouter.post("/save-lesson", saveLesson);
schoolRouter.delete("/delete-lesson", deleteLesson);

schoolRouter.get("/get-subwork", userToken, getSubwork);
schoolRouter.post("/add-subwork", userToken, addSubwork);
schoolRouter.post("/save-lesson-to-multiple", saveLessonToMultiple);

// New routes for saving progress and feedback
schoolRouter.post("/save-progress", userToken, saveProgress);
schoolRouter.post("/save-feedback", userToken, saveFeedback);

export default schoolRouter;