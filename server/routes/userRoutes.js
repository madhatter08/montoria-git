import express from "express";
import userToken from "../middleware/userToken.js"
import { getUserData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userToken, getUserData);

export default userRouter;
