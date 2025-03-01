import express from "express";
import userToken from "../middleware/userToken.js"
import { getUserData, getAllUserData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userToken, getUserData);
userRouter.get("/all", userToken, getAllUserData);


export default userRouter;
