const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { receiverId, listingId, content } = req.body;

    try {
        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            listing: listingId,
            content,
        });

        const fullMessage = await Message.findOne({ _id: message._id })
            .populate('sender', 'name email')
            .populate('receiver', 'name email');

        res.status(201).json(fullMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get messages between current user and another user (or for a listing)
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId },
            ],
        })
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort({ createdAt: 1 });

        // Mark messages from the other user as read
        await Message.updateMany(
            { sender: userId, receiver: currentUserId, read: false },
            { $set: { read: true } }
        );

        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all conversations for current user
// @route   GET /api/messages
// @access  Private
const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }],
        })
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort({ createdAt: -1 });

        // Group by conversation partner
        const conversations = [];
        const seenUsers = new Set();
        const unreadCounts = {};

        // First pass: count unread messages
        messages.forEach(msg => {
            if (!msg.sender || !msg.receiver) return;

            // If I am the receiver and message is not read
            if (msg.receiver._id.toString() === currentUserId.toString() && !msg.read) {
                const partnerId = msg.sender._id.toString();
                unreadCounts[partnerId] = (unreadCounts[partnerId] || 0) + 1;
            }
        });

        messages.forEach((msg) => {
            if (!msg.sender || !msg.receiver) {
                return; // Skip messages with missing users
            }

            const partner = msg.sender._id.toString() === currentUserId.toString() ? msg.receiver : msg.sender;
            const partnerId = partner._id.toString();

            if (!seenUsers.has(partnerId)) {
                seenUsers.add(partnerId);
                conversations.push({
                    partner,
                    lastMessage: msg,
                    unreadCount: unreadCounts[partnerId] || 0
                });
            }
        });

        res.json(conversations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get total unread message count
// @route   GET /api/messages/unread
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const count = await Message.countDocuments({
            receiver: currentUserId,
            read: false
        });
        res.json({ count });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { sendMessage, getMessages, getConversations, getUnreadCount };
