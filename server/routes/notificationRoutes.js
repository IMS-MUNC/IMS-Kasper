const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/Authentication/verifyToken');
const  {authMiddleware}=require("../middleware/auth.js")

// Get notifications for a user
router.get('/:userId',authMiddleware, auth.verifyToken, notificationController.getNotifications);

// Get unread count for a user
router.get('/unread/:userId',authMiddleware, auth.verifyToken, notificationController.getUnreadCount);

// Mark a notification as read
router.put('/read/:notificationId',authMiddleware, auth.verifyToken, notificationController.markAsRead);

// Mark all notifications as read for a user
router.put('/read-all/:userId',authMiddleware, auth.verifyToken, notificationController.markAllAsRead);

// Delete selected notifications (must come before /:notificationId)
router.delete('/bulk-delete',authMiddleware, auth.verifyToken, notificationController.deleteSelectedNotification);

// Delete all notifications for a user (must come before /:notificationId)
router.delete('/all/:userId',authMiddleware, auth.verifyToken, notificationController.deleteAllNotifications);

// Delete a notification
router.delete('/:notificationId',authMiddleware, auth.verifyToken, notificationController.deleteNotification);

// Get notifications with pagination
router.get('/paginated/:userId',authMiddleware, auth.verifyToken, notificationController.getNotificationsWithPagination);

module.exports = router;
