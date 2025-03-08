import express from "express";
import OpenAI from "openai";
import mongoose from "mongoose";
import "dotenv/config"; // Ensure .env is loaded


const router = express.Router();


// Use the existing Mongoose connection
const curriculumSchema = new mongoose.Schema(
  {
    Program: { type: String, required: true },
    Level: { type: String, required: true },
    Areas: { type: String, required: true },
    Material: { type: String, required: true },
    Lesson: { type: String, required: true },
    Work: { type: String, required: true },
  },
  { collection: "curriculums" }
);


const Curriculum = mongoose.models.curriculum || mongoose.model("curriculum", curriculumSchema);


const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});


// Log API key for debugging (REMOVE after testing)
console.log("DeepSeek API Key Loaded:", !!process.env.DEEPSEEK_API_KEY);


// Preload curriculum data when the server starts
const preloadCurriculumData = async () => {
  try {
    const curriculumData = await Curriculum.find({});
    console.log("Curriculum data preloaded successfully:", curriculumData.length, "documents found");
  } catch (error) {
    console.error("Error preloading curriculum data:", error);
  }
};


// Call the preload function when the server starts
preloadCurriculumData();


// Helper function to extract values from the user's message
const extractValue = (message, keyword) => {
  // Create a regex pattern to match the keyword and capture the value after it
  const regex = new RegExp(`${keyword}\\s*([^\\s]+)`, "i");
  const match = message.match(regex);


  // If a match is found, trim any trailing punctuation and return the value
  if (match) {
    return match[1].replace(/[^a-zA-Z\s]/g, "").trim(); // Remove any non-alphabetic characters
  }
  return null; // Return null if no match is found
};


router.post("/chat", async (req, res) => {
    try {
      const userMessage = req.body.message;
      console.log("Backend Received Message:", userMessage);
 
      if (!userMessage) {
        console.log("Error: Message is required");
        return res.status(400).json({ error: "Message is required" });
      }
 
      // Query 1: "What are the lessons in Nature for Junior Casa?"
      if (userMessage.toLowerCase().includes("lessons in") && userMessage.toLowerCase().includes("for")) {
        const areas = extractValue(userMessage, "lessons in");
        const level = extractValue(userMessage, "for");
 
        if (!areas || !level) {
          console.log("Error: Areas and level are required in the message");
          return res.status(400).json({ error: "Areas and level are required in the message" });
        }
 
        // Log extracted values for debugging
        console.log("Extracted Areas:", areas);
        console.log("Extracted Level:", level);
 
        // Query MongoDB for lessons in the specified areas and level (case-insensitive)
        const lessons = await Curriculum.find(
          { Areas: { $regex: new RegExp(areas, "i") }, Level: { $regex: new RegExp(level, "i") } },
          { Lesson: 1, _id: 0 }
        );
 
        // Log the query results for debugging
        console.log("Lessons Found:", lessons);
 
        // Check if lessons were found
        if (lessons.length === 0) {
          console.log("No lessons found in the database. Falling back to AI.");
        } else {
          // Extract and format the lessons into a numbered list
          const uniqueLessons = [...new Set(lessons.map((l) => l.Lesson))]; // Remove duplicates
 
          // Format the response
          let formattedResponse = `These are the Lessons in ${areas} for ${level}:\n`;
          uniqueLessons.forEach((lesson, index) => {
            formattedResponse += `${index + 1}. ${lesson}\n`;
          });
 
          console.log("Sending formatted response from database:", formattedResponse);
          return res.json({ response: formattedResponse });
        }
      }


 


// Query 2: "What Nature materials available for Junior Casa?"
if (userMessage.toLowerCase().includes("materials available for")) {
    const areas = extractValue(userMessage, "what", "materials available for");
    const level = extractValue(userMessage, "for");
 
    if (!areas || !level) {
      console.log("Error: Areas and level are required in the message");
      return res.status(400).json({ error: "Areas and level are required in the message" });
    }
 
    // Log extracted values for debugging
    console.log("Extracted Areas:", areas);
    console.log("Extracted Level:", level);
 
    // Query MongoDB for materials in the specified areas and level (case-insensitive)
    const materials = await Curriculum.find(
      { Areas: { $regex: new RegExp(areas, "i") }, Level: { $regex: new RegExp(level, "i") } },
      { Material: 1, _id: 0 }
    );
 
    // Log the query results for debugging
    console.log("Materials Found:", materials);
 
    // Check if materials were found
    if (materials.length === 0) {
      console.log("No materials found in the database. Falling back to AI.");
    } else {
      // Extract and format the materials into a numbered list
      const uniqueMaterials = [...new Set(materials.map((m) => m.Material))]; // Remove duplicates
 
      // Format the response
      let formattedResponse = `Here are the ${areas} materials available for ${level}:\n`;
      uniqueMaterials.forEach((material, index) => {
        formattedResponse += `${index + 1}. ${material}\n`;
      });
 
      console.log("Sending formatted response from database:", formattedResponse);
      return res.json({ response: formattedResponse });
    }
  }
if (userMessage.toLowerCase().includes("works for") && userMessage.toLowerCase().includes("in the")) {
  const level = extractValue(userMessage, "works for");
  const areas = extractValue(userMessage, "in the");


  if (!level || !areas) {
    return res.status(400).json({ error: "Level and Areas are required in the message" });
  }


  const works = await Curriculum.find(
    { Level: { $regex: new RegExp(level, "i") }, Areas: { $regex: new RegExp(areas, "i") } },
    { Work: 1, _id: 0 }
  );


  if (works.length === 0) {
    console.log("No works found in the database. Falling back to AI.");
  } else {
    const uniqueWorks = [...new Set(works.map((w) => w.Work))];
    let formattedResponse = `Here are the Works for ${level} in the ${areas} area:\n`;
    uniqueWorks.forEach((work, index) => {
      formattedResponse += `${index + 1}. ${work}\n`;
    });
    return res.json({ response: formattedResponse });
  }
}


//Query 3
if (userMessage.toLowerCase().includes("works for") && userMessage.toLowerCase().includes("in the")) {
    const level = extractValue(userMessage, "works for");
    const areas = extractValue(userMessage, "in the");
 
    if (!level || !areas) {
      return res.status(400).json({ error: "Level and Areas are required in the message" });
    }
 
    const works = await Curriculum.find(
      { Level: { $regex: new RegExp(level, "i") }, Areas: { $regex: new RegExp(areas, "i") } },
      { Work: 1, _id: 0 }
    );
 
    if (works.length === 0) {
      console.log("No works found in the database. Falling back to AI.");
    } else {
      const uniqueWorks = [...new Set(works.map((w) => w.Work))];
      let formattedResponse = `Here are the Works for ${level} in the ${areas} area:\n`;
      uniqueWorks.forEach((work, index) => {
        formattedResponse += `${index + 1}. ${work}\n`;
      });
      return res.json({ response: formattedResponse });
    }
  }


  //Query4
  if (userMessage.toLowerCase().includes("materials are needed for the")) {
    const lesson = extractValue(userMessage, "materials are needed for the");
 
    if (!lesson) {
      return res.status(400).json({ error: "Lesson is required in the message" });
    }
 
    const materials = await Curriculum.find(
      { Lesson: { $regex: new RegExp(lesson, "i") } },
      { Material: 1, _id: 0 }
    );
 
    if (materials.length === 0) {
      console.log("No materials found in the database. Falling back to AI.");
    } else {
      const uniqueMaterials = [...new Set(materials.map((m) => m.Material))];
      let formattedResponse = `Here are the Materials needed for the ${lesson} lesson:\n`;
      uniqueMaterials.forEach((material, index) => {
        formattedResponse += `${index + 1}. ${material}\n`;
      });
      return res.json({ response: formattedResponse });
    }
  }
    // If no data is found in the database, use DeepSeek API as a fallback
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
- Respond without using bold (**text**) or any other markdown formatting to all queries.


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
     3. Instructions (Provide short step-by-step instructions)


3. "What group task can I assign to the Level in Learning Area for Lesson?"
   - Response format:
     1. [Activity 1] - Short details and example
     2. [Activity 2] - Short details and example
     3. [Activity 3] - Short details and example


4. "Can you list the materials needed for Activity?"
   - Provide as many materials as necessary if needed.`,
      },
      { role: "user", content: userMessage },
    ];


    const response = await openai.chat.completions.create({
      messages,
      model: "deepseek-reasoner", // Ensure this is a valid model
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
    });


    // Ensure the response is valid
    if (!response || !response.choices || response.choices.length === 0) {
      console.log("Error: Invalid or empty API response");
      throw new Error("Invalid or empty API response");
    }


    console.log("Sending DeepSeek API response:", response.choices[0].message.content);
    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Chat API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch response from DeepSeek API" });
  }
});


export default router; 