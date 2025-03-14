// server/controllers/calendarController.js
import Calendar from "../models/acads/calendarModel.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, start, end, visibility, schoolId, createdAt } = req.body;

    // Validate required fields
    if (!title || !start || !end || !schoolId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Ensure schoolId matches the logged-in user's schoolId (security check)
    if (schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, message: "School ID mismatch" });
    }

    const newEvent = new Calendar({
      title,
      start: new Date(start),
      end: new Date(end),
      visibility: visibility || "personal",
      schoolId,
      createdBy: req.user.id, // Use authenticated user's ID
      createdAt: createdAt ? new Date(createdAt) : Date.now(),
    });

    const savedEvent = await newEvent.save();
    console.log("Event saved:", savedEvent); // Debug log
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all events for the logged-in user
export const getEvents = async (req, res) => {
  try {
    const events = await Calendar.find({
      $or: [
        { visibility: "all" },
        { schoolId: req.user.schoolId, visibility: "personal" },
      ],
    });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { title, start, end, visibility, schoolId } = req.body;
    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Ensure the event belongs to the user's schoolId
    if (event.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    event.title = title || event.title;
    event.start = start ? new Date(start) : event.start;
    event.end = end ? new Date(end) : event.end;
    event.visibility = visibility || event.visibility;
    event.schoolId = schoolId || event.schoolId;
    event.updatedAt = Date.now();

    const updatedEvent = await event.save();
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Ensure the event belongs to the user's schoolId
    if (event.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await event.deleteOne();
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};