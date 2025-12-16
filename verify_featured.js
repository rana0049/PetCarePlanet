const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/petcareplenet');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const verifyFeatured = async () => {
    await connectDB();

    try {
        const featuredCount = await mongoose.connection.db.collection('listings').countDocuments({ isFeatured: true });
        const totalCount = await mongoose.connection.db.collection('listings').countDocuments();

        console.log('--- FEATURED VERIFICATION ---');
        console.log(`Total Listings: ${totalCount}`);
        console.log(`Featured Listings: ${featuredCount}`);

        if (totalCount > 0 && featuredCount === 0) {
            console.log('ISSUE FOUND: No listings are marked as featured. Marketplace landing page only shows featured items.');

            // Fix: Mark all as featured for testing
            // await mongoose.connection.db.collection('listings').updateMany({}, { $set: { isFeatured: true } });
            // console.log('FIX APPLIED: Marked all listings as featured for testing.');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

verifyFeatured();
