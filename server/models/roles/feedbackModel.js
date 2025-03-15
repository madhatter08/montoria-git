import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  schoolId: { type: String, required: true, unique: true },
  feedbacks: {
    quarter1: {
      week1: { type: String, default: "" },
      week2: { type: String, default: "" },
      week3: { type: String, default: "" },
      summarized_feedback: { type: String, default: null },
    },
    quarter2: {
      week4: { type: String, default: "" },
      week5: { type: String, default: "" },
      week6: { type: String, default: "" },
      summarized_feedback: { type: String, default: null },
    },
    quarter3: {
      week7: { type: String, default: "" },
      week8: { type: String, default: "" },
      week9: { type: String, default: "" },
      summarized_feedback: { type: String, default: null },
    },
    quarter4: {
      week10: { type: String, default: "" },
      week11: { type: String, default: "" },
      week12: { type: String, default: "" },
      summarized_feedback: { type: String, default: null },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Feedback", feedbackSchema);