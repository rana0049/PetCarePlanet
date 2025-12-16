const mongoose = require('mongoose');

// Default to standard local URI if env not available
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/petcareplenet';

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // 1. Get or Create User
        let user = await mongoose.connection.collection('users').findOne({});
        if (!user) {
            console.log('No user found, creating one...');
            const result = await mongoose.connection.collection('users').insertOne({
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedpassword123', // Dummy password
                phone: '1234567890',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            user = await mongoose.connection.collection('users').findOne({ _id: result.insertedId });
        }
        console.log(`Using user: ${user._id}`);

        // 2. Get or Create Listing
        let listing = await mongoose.connection.collection('listings').findOne({});
        if (!listing) {
            console.log('No listing found, creating one...');
            const result = await mongoose.connection.collection('listings').insertOne({
                seller: user._id,
                title: 'Featured Golden Retriever',
                description: 'A beautiful featured verified dog.',
                price: 50000,
                category: 'Dog',
                breed: 'Golden Retriever',
                age: 2,
                images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
                location: 'Lahore',
                gender: 'Male',
                isVaccinated: true,
                isFeatured: false, // Will verify update next
                status: 'approved',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            listing = await mongoose.connection.collection('listings').findOne({ _id: result.insertedId });
        }

        // 3. Mark as Featured but rename title
        console.log(`Featuring listing: ${listing.title} (${listing._id})`);
        await mongoose.connection.collection('listings').updateOne(
            { _id: listing._id },
            { $set: { isFeatured: true, title: 'Golden Retriever' } }
        );

        console.log('Listing updated to isFeatured: true');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
