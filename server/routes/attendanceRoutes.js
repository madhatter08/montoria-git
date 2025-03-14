import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  class: String,
  date: Date,
  records: [
    {
      schoolId: { type: String, required: true },
      status: {
        type: String,
        enum: ["Present", "Late", "Excused", "Absent"],
        required: true,
      },
      recordedAt: { type: Date, default: Date.now },
    },
  ],
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

// POST /api/attendance/save
router.post("/save", async (req, res) => {
  const { class: className, date, records } = req.body;

  if (!className || !date || !records || !Array.isArray(records)) {
    return res.status(400).json({ success: false, message: "Invalid request data" });
  }

  try {
    // Check if attendance for this date and class already exists
    const existingAttendance = await Attendance.findOne({ date, class: className });
    if (existingAttendance) {
      existingAttendance.records = records;
      existingAttendance.updatedAt = new Date();
      await existingAttendance.save();
    } else {
      const attendance = new Attendance({
        class: className,
        date,
        records,
        createdBy: req.cookies?.userEmail || "unknown",
      });
      await attendance.save();
    }
    res.status(200).json({ success: true, message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/attendance/date/:date
router.get("/date/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const attendance = await Attendance.findOne({ date: new Date(date) });
    if (!attendance) {
      return res.status(404).json({ success: false, message: "No attendance data for this date" });
    }
    res.status(200).json({ success: true, records: attendance.records });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;