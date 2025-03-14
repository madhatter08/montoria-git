import SavedChat from "../models/acads/savedChatModel.js"; // Adjust path as needed

// Save a new chat (POST /api/saved-chats)
export const saveChat = async (req, res) => {
  const { schoolid, topic, messages } = req.body;

  if (!schoolid || !topic || !messages) {
    return res.status(400).json({ error: "Missing required fields: schoolid, topic, and messages are required" });
  }

  try {
    const newChat = new SavedChat({
      schoolid,
      topic,
      messages,
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error("Error saving chat:", error.message);
    res.status(500).json({ error: `Failed to save chat: ${error.message}` });
  }
};

// Get saved chats for a schoolid (GET /api/saved-chats?schoolid=...)
export const getSavedChats = async (req, res) => {
  const { schoolid } = req.query;

  if (!schoolid) {
    return res.status(400).json({ error: "schoolid query parameter is required" });
  }

  try {
    const chats = await SavedChat.find({ schoolid });
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching saved chats:", error.message);
    res.status(500).json({ error: "Failed to fetch saved chats" });
  }
};

// Delete a saved chat (DELETE /api/saved-chats/:id)
export const deleteChat = async (req, res) => {
  const { id } = req.params;
  const { schoolid } = req.body;

  if (!id || !schoolid) {
    return res.status(400).json({ error: "Chat ID and schoolid are required" });
  }

  try {
    const chat = await SavedChat.findOneAndDelete({ _id: id, schoolid });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error.message);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};