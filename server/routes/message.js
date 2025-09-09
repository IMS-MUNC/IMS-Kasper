const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
// const auth = require('../middleware/auth');


router.post('/',  messageController.saveMessage);
router.get('/', messageController.getMessages);
router.post('/read', messageController.markAsRead);
router.delete('/clear', messageController.clearMessages);
router.delete('/delete-user-messages', messageController.deleteUserMessages);
router.delete('/delete-selected', messageController.deleteSelectedMessages);
router.get('/:userId',  messageController.getConversations);

module.exports = router; 