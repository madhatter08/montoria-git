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
    editCurriculum
} from "../controllers/schoolController.js";

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



export default schoolRouter;
