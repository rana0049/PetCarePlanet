const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('../models/Listing');

dotenv.config();

const fixListings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        console.log('--- STARTING FIX ---');

        const listings = await Listing.find({});
        const now = new Date();
        let modifiedCount = 0;

        for (const listing of listings) {
            let changed = false;

            // Scenario 1: isFeatured is true, but expired
            if (listing.isFeatured && listing.featuredExpiresAt && new Date(listing.featuredExpiresAt) <= now) {
                console.log(`Fixing EXPIRED listing: ${listing.title} (Expired: ${listing.featuredExpiresAt})`);
                listing.isFeatured = false;
                // Keep the date for history, or nullify? Let's keep it but flag false.
                changed = true;
            }

            // Scenario 2: isFeatured is true, but NO date
            if (listing.isFeatured && !listing.featuredExpiresAt) {
                console.log(`Fixing INVALID listing (No Date): ${listing.title}`);
                listing.isFeatured = false;
                listing.featuredExpiresAt = null;
                changed = true;
            }

            // Scenario 3: isFeatured is FALSE, but has future date? (Should we auto-enable? No, user might have removed it.)

            if (changed) {
                await listing.save();
                modifiedCount++;
            }
        }

        console.log(`--- FINISHED FIX ---`);
        console.log(`Fixed ${modifiedCount} listings.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixListings();
