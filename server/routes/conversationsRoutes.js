const express = require('express');
const router = express.Router();
const conversationsControllers = require('../controllers/conversationsControllers');
// const auth = require('../middleware/auth');
const  {authMiddleware}=require("../middleware/auth.js")

router.get('/:userId', authMiddleware, conversationsControllers.getConversations);

module.exports = router; 