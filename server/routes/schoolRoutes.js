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
  getStudentsByClass,
  getFeedbackByQuarter,
  summarizeFeedback,
  getStudentById,
  lessonPlan,
  saveLesson,
  deleteLesson,

} from "../controllers/schoolController.js";
import userToken from "../middleware/userToken.js";

const schoolRouter = express.Router();

// Existing routes
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

schoolRouter.get("/class-list", userToken, getClassList);
schoolRouter.get("/students-by-class", userToken, getStudentsByClass);
schoolRouter.get("/feedback-by-quarter", userToken, getFeedbackByQuarter);


// Corrected route for feedback summarization (POST instead of GET)
schoolRouter.post("/summarize-feedback", userToken, summarizeFeedback);
schoolRouter.get("/feedback-by-quarter", userToken, getFeedbackByQuarter);
schoolRouter.get("/:schoolId", userToken, getStudentById);
schoolRouter.get("/lesson-plan", userToken, lessonPlan);
schoolRouter.post("/save-lesson", saveLesson);
schoolRouter.delete("/delete-lesson/:id", deleteLesson);
//schoolRouter.get("/get-lessons-by-level", getLessonsByLevel);

export default schoolRouter;