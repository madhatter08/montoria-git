import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  schoolid: {
    type: String,
    required: [true, "Path `schoolid` is required."],
  },
  topic: {
    type: String,
    required: [true, "Path `topic` is required."],
  },
  messages: [
    {
      text: { type: String, required: true },
      sender: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);