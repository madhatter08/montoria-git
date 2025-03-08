import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/calendarController.js";
import userToken from "../middleware/userToken.js";

const calendarRouter = express.Router();

// Create a new event
calendarRouter.post("/create", userToken, createEvent);

// Fetch events
calendarRouter.get("/events", userToken, getEvents);

// Update an event
calendarRouter.put("/update/:id", userToken, updateEvent);

// Delete an event
calendarRouter.delete("/delete/:id", userToken, deleteEvent);

export default calendarRouter;