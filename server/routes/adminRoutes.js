import express from "express";
import userToken from "../middleware/userToken.js";
import { addUser } from "../controllers/adminController.js";

const userRouter = express.Router();

adminRouter.post("/add-user", userToken, addUser);
//adminRouter.put("/edit-user", userToken, getAllUserData);
//adminRouter.delete("/delete-user", userToken, getAllUserData);

export default userRouter;
