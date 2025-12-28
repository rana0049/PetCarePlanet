const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('../models/Listing');

dotenv.config();

const wipeFeatured = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Force update ALL documents
        const result = await Listing.updateMany(
            {},
            {
                $set: {
                    isFeatured: false,
                    featuredExpiresAt: null
                }
            }
        );

        console.log(`WIPED featured status for ${result.matchedCount} listings.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

wipeFeatured();
