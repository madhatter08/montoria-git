import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY // Securely load API key
});

async function getChatResponse(messages) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_completion_tokens: 400,
            top_p: 1,
            stream: false
        });

        return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error fetching chat response:", error);
        throw error;
    }
}

export default getChatResponse;