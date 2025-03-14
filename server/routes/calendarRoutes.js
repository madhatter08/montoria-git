// server/routes/calendarRoutes.js
import express from "express";
import { 
  createEvent, 
  getEvents, 
  updateEvent, 
  deleteEvent 
} from "../controllers/calendarController.js";
import userToken from "../middleware/userToken.js"; // Use actual middleware

const router = express.Router();

router.post("/events", userToken, createEvent);
router.get("/events", userToken, getEvents);
router.put("/events/:id", userToken, updateEvent);
router.delete("/events/:id", userToken, deleteEvent);

export default router;