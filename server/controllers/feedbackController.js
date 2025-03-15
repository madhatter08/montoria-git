const Feedback = require('../models/Feedback');

// Save or Update Feedback
exports.saveFeedback = async (req, res) => {
  const { studentId, schoolId, quarter, week, feedback } = req.body;

  try {
    let feedbackDoc = await Feedback.findOne({ studentId, schoolId });

    if (!feedbackDoc) {
      feedbackDoc = new Feedback({ studentId, schoolId, feedbacks: {} });
    }

    // Dynamically set the feedback for the given quarter and week
    if (!feedbackDoc.feedbacks[quarter]) {
      feedbackDoc.feedbacks[quarter] = {};
    }
    feedbackDoc.feedbacks[quarter][week] = feedback;

    feedbackDoc.updatedAt = Date.now();
    await feedbackDoc.save();

    res.status(200).json({ message: 'Feedback saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving feedback', error });
  }
};

// Get Feedback for a Student
exports.getFeedback = async (req, res) => {
  const { studentId, schoolId } = req.params;

  try {
    const feedbackDoc = await Feedback.findOne({ studentId, schoolId });
    if (!feedbackDoc) {
      return res.status(404).json({ message: 'No feedback found' });
    }

    res.status(200).json(feedbackDoc.feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving feedback', error });
  }
};