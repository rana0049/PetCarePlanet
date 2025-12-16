const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations, getUnreadCount } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, sendMessage).get(protect, getConversations);
router.route('/unread').get(protect, getUnreadCount);
router.route('/:userId').get(protect, getMessages);

module.exports = router;
