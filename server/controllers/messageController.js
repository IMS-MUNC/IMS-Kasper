const Message = require('../models/Message');
const Notification = require('../models/notificationModel');

exports.saveMessage = async (req, res) => {
  try {
    const { from, to, message, replyTo, fileUrl, fileType, fileName } = req.body;

    // Sort participants to make [A, B] === [B, A]
    const participants = [from, to].sort();

    // ✅ Check if conversation already exists
    let conversation = await Message.findOne({ participants });

    if (!conversation) {
      conversation = new Message({
        participants,
        messages: [],
        lastMessage: { from, message, timestamp: new Date() }
      });
    }

    const newMessage = {
      from,
      message,
      timestamp: new Date(),
      read: false,
      ...(replyTo && { replyTo }),
      ...(fileUrl && { fileUrl }),
      ...(fileType && { fileType }),
      ...(fileName && { fileName }),
    };

    conversation.messages.push(newMessage);
    conversation.lastMessage = {
      from,
      message,
      timestamp: new Date()
    };

    await conversation.save();

    // Create notification for the recipient
    try {
      const notification = new Notification({
        recipient: to,
        sender: from,
        message: message,
        type: 'message',
        conversationId: conversation._id
      });
      await notification.save();
      // console.log('📧 Notification created for user:', to);
    } catch (notificationError) {
      console.error('❌ Error creating notification:', notificationError);
      // Don't fail the message save if notification fails
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Error saving message:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { from, to } = req.query;
    const currentUserId = req.user.id; // Get the authenticated user's ID

    // Sort participants to ensure consistent ordering
    const participants = [from, to].sort();

    const conversation = await Message.findOne({ participants });

    if (!conversation) {
      return res.json([]);
    }

    // Filter out messages that have been cleared by the current user
    const filteredMessages = conversation.messages.filter(message => {
      return !message.clearedBy || !message.clearedBy.includes(currentUserId);
    });

    res.json(filteredMessages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { from, to } = req.body;

    // Sort participants to ensure consistent ordering
    const participants = [from, to].sort();

    const conversation = await Message.findOne({ participants });

    if (!conversation) {
      return res.json({ success: true });
    }

    // Mark messages from 'from' user as read
    conversation.messages.forEach(msg => {
      if (msg.from.toString() === from && !msg.read) {
        msg.read = true;
      }
    });

    await conversation.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.clearMessages = async (req, res) => {
  try {
    const { from, to } = req.body;
    const currentUserId = req.user.id; // Get the authenticated user's ID

    // Sort participants to ensure consistent ordering
    const participants = [from, to].sort();

    const conversation = await Message.findOne({ participants });

    if (!conversation) {
      return res.json({ success: true, message: 'No conversation found' });
    }

    // Only clear messages for the current user by marking them as cleared
    // Instead of deleting messages, we'll add a clearedBy field to track who cleared the chat
    conversation.messages.forEach(message => {
      if (!message.clearedBy) {
        message.clearedBy = [];
      }
      if (!message.clearedBy.includes(currentUserId)) {
        message.clearedBy.push(currentUserId);
      }
    });

    // Update lastMessage only if it was cleared by the current user
    if (conversation.lastMessage) {
      if (!conversation.lastMessage.clearedBy) {
        conversation.lastMessage.clearedBy = [];
      }
      if (!conversation.lastMessage.clearedBy.includes(currentUserId)) {
        conversation.lastMessage.clearedBy.push(currentUserId);
      }
    }

    await conversation.save();

    res.json({ success: true, message: 'Messages cleared successfully for current user' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Function to delete only the current user's messages from a conversation
exports.deleteUserMessages = async (req, res) => {
  try {
    const { from, to } = req.body;
    const currentUserId = req.user.id; // Get the authenticated user's ID

    // Sort participants to ensure consistent ordering
    const participants = [from, to].sort();

    const conversation = await Message.findOne({ participants });

    if (!conversation) {
      return res.json({ success: true, message: 'No conversation found' });
    }

    // Remove only messages sent by the current user
    conversation.messages = conversation.messages.filter(msg =>
      msg.from.toString() !== currentUserId
    );

    // Update lastMessage if it was from the current user
    if (conversation.lastMessage && conversation.lastMessage.from.toString() === currentUserId) {
      if (conversation.messages.length > 0) {
        const lastRemainingMessage = conversation.messages[conversation.messages.length - 1];
        conversation.lastMessage = {
          from: lastRemainingMessage.from,
          message: lastRemainingMessage.message,
          timestamp: lastRemainingMessage.timestamp
        };
      } else {
        conversation.lastMessage = null;
      }
    }

    await conversation.save();

    res.json({ success: true, message: 'User messages deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Function to delete selected messages from a conversation
exports.deleteSelectedMessages = async (req, res) => {
  try {
    const { messages: selectedMessages, from, to } = req.body;
    const currentUserId = req.user.id; // Get the authenticated user's ID

    // console.log('Received selected messages to delete:', selectedMessages);

    // Sort participants to ensure consistent ordering
    const participants = [from, to].sort();

    const conversation = await Message.findOne({ participants });

    if (!conversation) {
      return res.json({ success: true, message: 'No conversation found' });
    }

    // console.log('Original conversation messages count:', conversation.messages.length);

    // Create a set of message identifiers to delete (using timestamp + message content)
    const messagesToDelete = new Set();
    selectedMessages.forEach(msg => {
      const identifier = `${new Date(msg.timestamp).toISOString()}_${msg.message.substring(0, 50)}`;
      messagesToDelete.add(identifier);
    });

    // console.log('Messages to delete (identifiers):', Array.from(messagesToDelete));

    // Mark selected messages as deleted (only if they belong to the current user)
    let deletedCount = 0;
    conversation.messages.forEach(msg => {
      // Only process messages from current user
      if (msg.from.toString() === currentUserId) {
        // For current user's messages, check if they should be deleted
        const messageIdentifier = `${new Date(msg.timestamp).toISOString()}_${msg.message.substring(0, 50)}`;
        const shouldDelete = messagesToDelete.has(messageIdentifier);

        if (shouldDelete && !msg.isDeleted) {
          msg.isDeleted = true;
          msg.message = "This message was deleted";
          deletedCount++;
          // console.log('Marking message as deleted:', messageIdentifier);
        }
      }
    });

    // console.log('Marked', deletedCount, 'messages as deleted');

    // Update lastMessage if it was the last message and got deleted
    if (conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (!lastMessage.isDeleted) {
        conversation.lastMessage = {
          from: lastMessage.from,
          message: lastMessage.message,
          timestamp: lastMessage.timestamp
        };
      } else {
        // Find the last non-deleted message
        const lastNonDeletedMessage = conversation.messages
          .slice()
          .reverse()
          .find(msg => !msg.isDeleted);
        
        if (lastNonDeletedMessage) {
          conversation.lastMessage = {
            from: lastNonDeletedMessage.from,
            message: lastNonDeletedMessage.message,
            timestamp: lastNonDeletedMessage.timestamp
          };
        } else {
          conversation.lastMessage = null;
        }
      }
    } else {
      conversation.lastMessage = null;
    }

    await conversation.save();

    res.json({
      success: true,
      message: 'Selected messages marked as deleted successfully',
      deletedCount: deletedCount
    });
  } catch (err) {
    console.error('Error in deleteSelectedMessages:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

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