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

const verifyStatus = async () => {
    await connectDB();

    try {
        const listings = await mongoose.connection.db.collection('listings').find({}).toArray();

        console.log('--- LISTING STATUS ---');
        listings.forEach(l => {
            console.log(`Title: ${l.title} | Status: ${l.status} | Featured: ${l.isFeatured}`);
        });

        const approvedCount = listings.filter(l => l.status === 'approved').length;
        if (approvedCount === 0) {
            console.log('ISSUE: No listings are approved. They might not show up in search.');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

verifyStatus();
