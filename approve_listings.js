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

const approveAll = async () => {
    await connectDB();

    try {
        const result = await mongoose.connection.db.collection('listings').updateMany(
            {},
            { $set: { status: 'approved' } }
        );

        console.log(`Updated ${result.modifiedCount} listings to 'approved' status.`);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

approveAll();
