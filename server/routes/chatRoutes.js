import express from "express";
import OpenAI from "openai";
import "dotenv/config"; // Ensure .env is loaded

const router = express.Router();

const openai = new OpenAI({
    baseURL: "https://api.deepseek.com/v1", // Corrected DeepSeek API base URL
    apiKey: process.env.DEEPSEEK_API_KEY, // Load from .env
});

// Log API key for debugging (REMOVE after testing)
console.log("DeepSeek API Key Loaded:", !!process.env.DEEPSEEK_API_KEY);

router.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        const messages = [
            {
                role: "system",
                content: `You are Montoria, a chatbot designed for supporting student's learning needs. 

General Guidelines:
- Responses should be focused on education and aligned with Montessori principles.
- Answer directly—no need to explain the reason or purpose unless explicitly asked.
- For follow-up questions, keep responses concise and clear (under 700 words).
- Do not answer non-educational queries.
- Do not put any formats, do not use bold letters

Here are some example questions the user may ask:

1. "Recommend activities for [Level] focused on [Lesson]."
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

2. "Suggest an activity for [Learning Area] to enhance students' [Skill] for [Level]"
   - Response format:
     1. [Activity Title]
     2. Materials Needed:
        1. [Material 1]
        2. [Material 2]
     3. Instructions (Provide short step-by-step instructions)

3. "What group task can I assign to the [Level] in [Learning Area] for [Lesson]?"
   - Response format:
     1. [Activity 1] - Short details and example
     2. [Activity 2] - Short details and example
     3. [Activity 3] - Short details and example

4. "Can you list the materials needed for [Activity]?"
   - Provide as many materials as necessary if needed.`
            },
            { role: "user", content: userMessage }
        ];

        const response = await openai.chat.completions.create({
            messages,
            model: "deepseek-chat", // Ensure this is a valid model
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
            }
        });

        // Ensure the response is valid
        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error("Invalid or empty API response");
        }

        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error("Chat API Error:", error.message);
        res.status(500).json({ error: "Failed to fetch response from DeepSeek API" });
    }
});

export default router;
