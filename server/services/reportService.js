import axios from "axios";

export const generateReport = async (prompt, userId) => {
  try {
    const response = await axios.post(
      "https://api.reportgenerator.com/generate", // Replace with real API URL
      { prompt, userId },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPORT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Assuming { graphType, data }
  } catch (error) {
    throw new Error("Failed to generate report");
  }
};