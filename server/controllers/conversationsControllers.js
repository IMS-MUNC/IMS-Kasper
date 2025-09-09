const Message = require('../models/Message');

exports.getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log("Fetching conversations for user ID:", userId);

    const conversations = await Message.find({
      participants: { $in: [userId] }
    })
      .populate("participants", "_id firstName lastName email profileImage") // Fixed field names
      .populate("messages.from", "_id firstName lastName email profileImage") // Also populate message sender details
      .sort({ 'lastMessage.timestamp': -1 }); // Sort by most recent first

    // console.log("Found conversations:", conversations.length);
    res.status(200).json(conversations);
  } catch (err) {
    // console.error("❌ Error fetching conversations:", err.message);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
}; 