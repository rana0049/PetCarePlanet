const mongoose = require('mongoose');
const User = require('./server/models/User'); // Adjust path
const Listing = require('./server/models/Listing'); // Adjust path

const MONGO_URI = 'mongodb://localhost:27017/petcareplenet';

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const users = await User.find({});
        console.log(`--- USERS (${users.length}) ---`);
        users.forEach(u => {
            console.log(`User: ${u.name} | ID: ${u._id} | Email: ${u.email}`);
        });

        const listings = await Listing.find({}).populate('owner', 'name');
        console.log(`\n--- LISTINGS (${listings.length}) ---`);
        listings.forEach(l => {
            const ownerName = l.owner ? l.owner.name : 'UNKNOWN (NULL)';
            const ownerId = l.owner ? l.owner._id : 'N/A';
            console.log(`Listing: ${l.mainTitle || l.title} | Owner: ${ownerName} (${ownerId}) | Status: ${l.status}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

run();
