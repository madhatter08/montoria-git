import { generateReport } from "../services/reportService.js";

export const createReport = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.userId || "admin_default"; // Replace with actual auth logic

  try {
    const reportData = await generateReport(prompt, userId);
    res.status(200).json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error generating report",
    });
  }
};