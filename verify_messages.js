const mongoose = require('mongoose');

// Use the correct URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/petcareplenet';

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const messages = await mongoose.connection.collection('messages').find({}).toArray();
        console.log(`Found ${messages.length} messages.`);
        if (messages.length > 0) {
            console.log('Sample message:', messages[0]);
        } else {
            console.log('No messages found. Try sending one from the UI first.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
