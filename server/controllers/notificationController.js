const Notification = require('../models/notificationModel');
const User = require('../models/usersModels');
const mongoose = require('mongoose');

// Create a new notification
exports.createNotification = async (recipientId, senderId, message, type = 'message', conversationId = null) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      message,
      type,
      conversationId
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', '_id firstName lastName email profileImage')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const totalCount = await Notification.countDocuments({ recipient: userId });
    
    res.status(200).json({
      notifications,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

// Get unread count for a user
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await Notification.countDocuments({ 
      recipient: userId, 
      read: false 
    });
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Failed to fetch unread count', error: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
    
    res.status(200).json({ 
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read', error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;
    
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
};

// Delete bulk selected notifications
exports.deleteSelectedNotification = async (req, res) => {
  try {
    const { notificationIds, userId } = req.body;

    console.log('Bulk delete request:', { notificationIds, userId });

    // Validate inputs
    if (!userId) {
      console.log('Missing userId in request body');
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      console.log('Invalid notificationIds:', notificationIds);
      return res.status(400).json({ message: 'No valid notification IDs provided' });
    }

    // Validate ObjectIDs
    const validIds = notificationIds.filter(id => {
      try {
        return mongoose.Types.ObjectId.isValid(id);
      } catch {
        return false;
      }
    });

    console.log('Valid IDs count:', validIds.length, 'out of', notificationIds.length);

    if (validIds.length === 0) {
      return res.status(400).json({ message: 'No valid ObjectIDs provided' });
    }

    // Check if notifications exist and belong to the user before deleting
    const existingNotifications = await Notification.find({
      _id: { $in: validIds },
      recipient: userId
    });

    console.log('Found notifications to delete:', existingNotifications.length);

    if (existingNotifications.length === 0) {
      return res.status(404).json({ 
        message: 'No notifications found to delete for this user',
        providedIds: notificationIds,
        validIds
      });
    }

    // Ensure all notificationIds belong to the user
    const result = await Notification.deleteMany({
      _id: { $in: validIds },
      recipient: userId
    });

    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        message: 'No notifications found to delete for this user',
        providedIds: notificationIds,
        validIds
      });
    }

    res.status(200).json({ 
      message: `${result.deletedCount} notification${result.deletedCount > 1 ? 's' : ''} deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting selected notifications:', error);
    res.status(500).json({ 
      message: 'Failed to delete notifications', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete all notifications for a user
exports.deleteAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await Notification.deleteMany({ recipient: userId });
    
    res.status(200).json({ 
      message: 'All notifications deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({ message: 'Failed to delete all notifications', error: error.message });
  }
};

// Get notifications with pagination
exports.getNotificationsWithPagination = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1, read } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { recipient: userId };
    
    // Filter by read status if provided
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    const notifications = await Notification.find(query)
      .populate('sender', '_id firstName lastName email profileImage')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const totalCount = await Notification.countDocuments(query);
    
    res.status(200).json({
      notifications,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      hasMore: skip + notifications.length < totalCount
    });
  } catch (error) {
    console.error('Error fetching notifications with pagination:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};
