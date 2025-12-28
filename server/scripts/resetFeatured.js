const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('../models/Listing');

dotenv.config();

const resetFeatured = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const result = await Listing.updateMany(
            {},
            { $set: { isFeatured: false, featuredExpiresAt: null } }
        );

        console.log(`Reset complete. Modified ${result.modifiedCount} listings.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetFeatured();
