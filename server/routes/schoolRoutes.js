// schoolRoutes.js
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
  summarizeFeedback,
  lessonPlan,
  saveLesson,
  deleteLesson,
  getSubwork,
  addSubwork,
  getStudentById,
  saveLessonToMultiple,
  saveProgress,
  saveFeedback, // Duplicate with addFeedback, consider removing
  addFeedback,
  getFeedback,
  getProgress, // Now correctly imported
  saveSummarizedFeedback,
  getSummarizedFeedback,
} from "../controllers/schoolController.js";
import userToken from "../middleware/userToken.js";

const schoolRouter = express.Router();

// Curriculum-related routes
schoolRouter.post("/add-program", userToken, addProgram);
schoolRouter.post("/add-level", userToken, addLevel);
schoolRouter.post("/add-class", userToken, addClass);
schoolRouter.post("/add-area", userToken, addArea);
schoolRouter.post("/add-lesson", userToken, addLesson);
schoolRouter.post("/add-work", userToken, addWork);
schoolRouter.post("/add-material", userToken, addMaterial);

schoolRouter.post("/add-curriculum", userToken, addCurriculum);
schoolRouter.get("/get-curriculum", userToken, getAllCurriculum);
schoolRouter.delete("/delete-curriculum/:id", userToken, deleteCurriculum);
schoolRouter.put("/edit-curriculum/:id", userToken, editCurriculum);

// Student-related routes
schoolRouter.get("/student/:schoolId", userToken, getStudentById);
schoolRouter.get("/class-list", userToken, getClassList);

// Feedback-related routes
schoolRouter.get("/get-feedback", userToken, getFeedback);
schoolRouter.post("/summarize-feedback", userToken, summarizeFeedback);
schoolRouter.post("/save-summarized-feedback", userToken, saveSummarizedFeedback);
schoolRouter.get("/get-summarized-feedback", userToken, getSummarizedFeedback);
schoolRouter.post("/add-feedback", userToken, addFeedback);

// Lesson-related routes
schoolRouter.get("/lesson-plan", userToken, lessonPlan);
schoolRouter.post("/save-lesson", userToken, saveLesson);
schoolRouter.delete("/delete-lesson", userToken, deleteLesson);
schoolRouter.post("/save-lesson-to-multiple", userToken, saveLessonToMultiple);

// Subwork-related routes
schoolRouter.get("/get-subwork", userToken, getSubwork);
schoolRouter.post("/add-subwork", userToken, addSubwork);

// Progress-related routes
schoolRouter.post("/save-progress", userToken, saveProgress);
schoolRouter.get("/student/:schoolId/progress", getProgress); // Route is correct

export default schoolRouter;