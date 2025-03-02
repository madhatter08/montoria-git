import express from "express";
import userToken from "../middleware/userToken.js"
import { getUserData, getAllUserData, addUser, editUser, deleteUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userToken, getUserData);
userRouter.get("/all", getAllUserData);
userRouter.post("/add-user", addUser);
userRouter.put("/edit-user/:id", editUser);
userRouter.delete("/delete-user/:id", deleteUser);


export default userRouter;
