import mongoose from 'mongoose';

// Chatbot Schema - For AI-powered chatbot interface
const chatbotSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // chatbot or Guide
    message: { type: String, required: true, trim: true }, // User's question or input
    response: { type: String, trim: true }, // AI-generated response
    status: { type: String, enum: ["Pending", "Processing", "Completed", "Failed"], default: "Pending" }, // Status of chatbot response
    context: { type: mongoose.Schema.Types.Mixed, default: {} }, // Stores conversation context for continuity
    attachments: [{ url: { type: String }, type: { type: String } }], // Optional file URLs sent to the chatbot
}, { timestamps: true });

const chatbotModel = mongoose.models.chatbot || mongoose.model('chatbot', chatbotSchema)

export default chatbotModel;