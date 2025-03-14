// server/models/Calendar.js
import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  visibility: { type: String, enum: ["personal", "all"], default: "personal" },
  schoolId: { type: String, required: true }, // Link to school
}, { 
  timestamps: true 
});

// Add index for better query performance
calendarSchema.index({ schoolId: 1, start: 1 });
calendarSchema.index({ createdBy: 1 });

export default mongoose.model("Calendar", calendarSchema);