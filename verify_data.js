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

const verifyData = async () => {
    await connectDB();

    try {
        const users = await mongoose.connection.db.collection('users').countDocuments();
        const pets = await mongoose.connection.db.collection('pets').countDocuments();
        const listings = await mongoose.connection.db.collection('listings').countDocuments();

        console.log('--- DATA VERIFICATION ---');
        console.log(`Users: ${users}`);
        console.log(`Pets: ${pets}`);
        console.log(`Listings: ${listings}`);
        console.log('-------------------------');

        if (listings > 0) {
            const firstListing = await mongoose.connection.db.collection('listings').findOne();
            console.log('Sample Listing:', firstListing.title);
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

verifyData();
