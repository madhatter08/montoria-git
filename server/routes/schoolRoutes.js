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
    lessonPlan,
    saveLesson,
    deleteLesson,
    getSubwork,
    addSubwork,
    //getLessonsByLevel,
} from "../controllers/schoolController.js";
import userToken from "../middleware/userToken.js";

const schoolRouter = express.Router();

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

schoolRouter.get("/lesson-plan", userToken, lessonPlan);
schoolRouter.post("/save-lesson", saveLesson);
schoolRouter.delete("/delete-lesson", deleteLesson);

//schoolRouter.get("/get-student-progress", userToken, lessonPlan);
schoolRouter.get("/get-subwork", userToken, getSubwork);
schoolRouter.post("/add-subwork", userToken, addSubwork);

//schoolRouter.get("/get-lessons-by-level", getLessonsByLevel);


export default schoolRouter;