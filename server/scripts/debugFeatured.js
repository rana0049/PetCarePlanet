const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('../models/Listing');

dotenv.config();

const debugFeatured = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const listings = await Listing.find({ isFeatured: true }).select('title isFeatured featuredExpiresAt status');

        console.log('--- Current "isFeatured: true" Listings ---');
        listings.forEach(l => {
            console.log(`ID: ${l._id} | Title: ${l.title} | Expires: ${l.featuredExpiresAt} | Status: ${l.status}`);
        });

        const allListings = await Listing.estimatedDocumentCount();
        console.log(`Total Listings in DB: ${allListings}`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugFeatured();
