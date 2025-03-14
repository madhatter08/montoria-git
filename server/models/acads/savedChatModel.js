import mongoose from "mongoose";

const savedChatSchema = new mongoose.Schema({
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
      text: {
        type: String,
        required: true,
      },
      sender: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SavedChat", savedChatSchema);