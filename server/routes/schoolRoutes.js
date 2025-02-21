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



export default schoolRouter;
