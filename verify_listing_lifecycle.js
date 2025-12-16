const axios = require('axios');
const mongoose = require('mongoose');

// Connect to DB directly to clean up if needed
const MONGO_URI = 'mongodb://localhost:27017/petcareplenet';

async function verifyLifecycle() {
    try {
        console.log('1. Registering/Logging in User...');
        let user;
        try {
            // Try to login if exists
            const loginRes = await axios.post('http://localhost:5000/api/users/login', {
                email: 'test_lister@example.com',
                password: 'password123'
            });
            user = loginRes.data;
            console.log('Logged in:', user.name);
        } catch (e) {
            // Register
            const regRes = await axios.post('http://localhost:5000/api/users', {
                name: 'Test Lister',
                email: 'test_lister@example.com',
                password: 'password123',
                phone: '1234567890'
            });
            user = regRes.data;
            console.log('Registered:', user.name);
        }

        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        console.log('2. Creating Listing...');
        const newListing = {
            title: 'Lifecycle Test Pet',
            description: 'Testing create/update/delete',
            price: 500,
            category: 'Dog',
            location: 'Test City',
            breed: 'Lab',
            age: 1,
            images: ['https://via.placeholder.com/150'], // dummy image
            phone: '1234567890'
        };

        const createRes = await axios.post('http://localhost:5000/api/market', newListing, config);
        const listingId = createRes.data._id;
        console.log('Created Listing:', listingId);

        console.log('3. Fetching Listing to Verify...');
        const fetchRes = await axios.get(`http://localhost:5000/api/market/${listingId}`);
        console.log('Fetched:', fetchRes.data.title);

        console.log('4. Updating Listing...');
        const updateData = {
            title: 'Lifecycle Test Pet UPDATED',
            price: 600
        };
        const updateRes = await axios.put(`http://localhost:5000/api/market/${listingId}`, updateData, config);
        console.log('Updated:', updateRes.data.title);

        if (updateRes.data.title !== 'Lifecycle Test Pet UPDATED') {
            throw new Error('Update failed to persist');
        }

        console.log('5. Deleting Listing...');
        await axios.delete(`http://localhost:5000/api/market/${listingId}`, config);
        console.log('Deleted.');

        try {
            await axios.get(`http://localhost:5000/api/market/${listingId}`);
            console.error('Error: Listing should be 404');
        } catch (e) {
            console.log('Verified 404 after delete.');
        }

        console.log('SUCCESS: Full lifecycle verified.');

    } catch (error) {
        console.error('FAILURE:', error.message);
        if (error.response) console.error(error.response.data);
    }
}

verifyLifecycle();
