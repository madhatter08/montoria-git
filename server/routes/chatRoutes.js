import express from "express";
import OpenAI from "openai";
import mongoose from "mongoose";
import "dotenv/config";
import Chat from "../models/acads/chatModel.js";

const router = express.Router();

// Use the existing Mongoose connection to montoriadb
const db = mongoose.connection;

// Initialize OpenAI client for DeepSeek API
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// Log API key for debugging (REMOVE after testing)
console.log("DeepSeek API Key Loaded:", !!process.env.DEEPSEEK_API_KEY);

// Function to search across all collections in montoriadb
const searchDatabase = async (query) => {
  try {
    const collections = await db.db.listCollections().toArray();
    const results = [];

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);

      const searchResult = await collection
        .find({
          $text: { $search: query },
        })
        .limit(10)
        .toArray();

      if (searchResult.length > 0) {
        results.push({
          collection: collectionName,
          data: searchResult,
        });
      }
    }

    return results;
  } catch (error) {
    console.error(`Error searching database: ${error.message}`);
    return [];
  }
};

// Helper function to format database results into a readable response
const formatDatabaseResponse = (results, query) => {
  if (results.length === 0) return null;

  let response = `Here is the information I found related to "${query}":\n`;
  results.forEach((result) => {
    response += `\nFrom ${result.collection}:\n`;
    result.data.forEach((doc, index) => {
      response += `${index + 1}. `;
      const docString = Object.entries(doc)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      response += `${docString}\n`;
    });
  });

  return response;
};

// Chat endpoint
router.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("Backend Received Message:", userMessage);

    if (!userMessage) {
      console.log("Error: Message is required");
      return res.status(400).json({ error: "Message is required" });
    }

    const dbResults = await searchDatabase(userMessage);
    const dbResponse = formatDatabaseResponse(dbResults, userMessage);

    if (dbResponse) {
      console.log("Sending response from database:", dbResponse);
      return res.json({ response: dbResponse });
    }

    console.log("No matching data found in the database. Using DeepSeek API for the query.");
    const messages = [
      {
        role: "system",
        content: `You are Montoria, a chatbot designed for supporting student's learning needs.

General Guidelines:
- Responses should be focused on education and aligned with Montessori principles.
- Answer directly—no need to explain the reason or purpose unless explicitly asked.
- For follow-up questions, keep responses concise and clear (under 700 words).
- Do not answer non-educational queries.
- Respond without using bold or any other markdown formatting to all queries.

Here are some example questions the user may ask:

1. "Recommend activities for Level focused on Lesson."
   - Response format:
     1. [Activity 1]
        - Materials:
          1. [Material 1]
          2. [Material 2]
     2. [Activity 2]
        - Materials:
          1. [Material 1]
          2. [Material 2]
     3. [Activity 3]
        - Materials:
          1. [Material 1]
          2. [Material 2]

2. "Suggest an activity for Learning Area to enhance students' Skill for Level"
   - Response format:
     1. [Activity Title]
     2. Materials Needed:
        1. [Material 1]
        2. [Material 2]
     3. Instructions (Provide short step-by-step instructions)`,
      },
      { role: "user", content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      messages,
      model: "deepseek-reasoner",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
    });

    if (!response || !response.choices || response.choices.length === 0) {
      console.log("Error: Invalid or empty API response");
      throw new Error("Invalid or empty API response");
    }

    console.log("Sending DeepSeek API response:", response.choices[0].message.content);
    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Chat API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch response" });
  }
});

// Saved chats routes
router.get("/saved-chats", async (req, res) => {
  const { schoolid } = req.query;
  try {
    console.log("Fetching chats for schoolid:", schoolid);
    const chats = await Chat.find({ schoolid });
    res.json(chats);
  } catch (error) {
    console.error("Error fetching saved chats:", error.message);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

router.post("/saved-chats", async (req, res) => {
  const { schoolid, topic, messages } = req.body;
  console.log("Received save request:", { schoolid, topic, messages });

  try {
    if (!schoolid) return res.status(400).json({ error: "schoolid is required" });
    if (!topic) return res.status(400).json({ error: "topic is required" });
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages must be a non-empty array" });
    }

    let chat = await Chat.findOne({ schoolid, topic });
    if (chat) {
      chat.messages = [...chat.messages, ...messages.filter(msg => 
        !chat.messages.some(m => m.text === msg.text && m.sender === msg.sender)
      )];
      chat.updatedAt = new Date();
      await chat.save();
      console.log("Chat updated:", chat);
      res.status(200).json(chat);
    } else {
      chat = new Chat({ schoolid, topic, messages });
      await chat.save();
      console.log("Chat created:", chat);
      res.status(201).json(chat);
    }
  } catch (error) {
    console.error("Error saving chat:", error.message);
    res.status(500).json({ error: "Failed to save chat: " + error.message });
  }
});

router.delete("/saved-chats/:id", async (req, res) => {
  const { id } = req.params;
  const { schoolid } = req.body;
  try {
    console.log("Deleting chat with id:", id, "for schoolid:", schoolid);
    if (!schoolid) return res.status(400).json({ error: "schoolid is required" });

    const chat = await Chat.findOneAndDelete({ _id: id, schoolid });
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.status(200).json({ message: "Chat deleted" });
  } catch (error) {
    console.error("Error deleting chat:", error.message);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

export default router;