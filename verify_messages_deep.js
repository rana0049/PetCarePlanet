const mongoose = require('mongoose');
const User = require('./server/models/User'); // Adjust path as needed
const Message = require('./server/models/Message'); // Adjust path as needed

const MONGO_URI = 'mongodb://localhost:27017/petcareplenet';

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // Verify Users exist
        const users = await User.find({});
        console.log(`Total Users: ${users.length}`);

        // 1. Simulate getConversations Logic
        console.log('--- Simulating getConversations ---');

        // Find a user to act as "current user" (take the first one)
        const currentUser = users[0];
        if (!currentUser) {
            console.log('No users found to simulate with.');
            return;
        }
        console.log(`Simulating for user: ${currentUser.name} (${currentUser._id})`);

        const messages = await Message.find({
            $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
        })
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort({ createdAt: -1 });

        console.log(`Found ${messages.length} messages for this user.`);

        const conversations = [];
        const seenUsers = new Set();

        messages.forEach((msg, index) => {
            console.log(`Processing message ${index}...`);

            // This is the line from controller that might crash
            // const partner = msg.sender._id.toString() === currentUserId.toString() ? msg.receiver : msg.sender;

            // Let's log sender/receiver status
            if (!msg.sender) console.log(`  > ERROR: msg.sender is null for msg ${msg._id}`);
            if (!msg.receiver) console.log(`  > ERROR: msg.receiver is null for msg ${msg._id}`);

            try {
                // strict simulation of controller logic
                const partner = msg.sender._id.toString() === currentUser._id.toString() ? msg.receiver : msg.sender;
                const partnerId = partner._id.toString();

                if (!seenUsers.has(partnerId)) {
                    seenUsers.add(partnerId);
                    conversations.push({
                        partner,
                        lastMessage: msg,
                    });
                }
            } catch (err) {
                console.error(`  > CRASH encountered processing message ${msg._id}:`, err.message);
            }
        });

        console.log('Simulation complete.');

    } catch (e) {
        console.error('GLOBAL SCRIPT ERROR:', e);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

run();
