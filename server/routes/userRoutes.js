import express from "express";
import userToken from "../middleware/userToken.js"
import { getUserData, getAllUserData, addUser, editUser, deleteUser, archiveUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userToken, getUserData);
userRouter.get("/all", userToken, getAllUserData);
userRouter.post("/add-user", userToken, addUser);
userRouter.put("/edit-user/:id", userToken, editUser);
userRouter.delete("/delete-user/:id", userToken, deleteUser);
userRouter.put("/update/:id", userToken, archiveUser);


export default userRouter;
