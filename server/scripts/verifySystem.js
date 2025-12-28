const axios = require('axios');
const mongoose = require('mongoose'); // Just for ID validation if needed, essentially not needed for requests
const dotenv = require('dotenv');

dotenv.config();

const API_URL = 'http://localhost:5000/api';
const EMAIL = 'test@example.com';
const PASSWORD = 'password123'; // Assuming this user exists or I need to register/login

// We will assume the server is running on 5000 based on previous logs.

async function verifyPromotionFlow() {
    try {
        console.log('1. Logging in as Admin...');
        let token;
        try {
            const loginRes = await axios.post(`${API_URL}/users/login`, { email: EMAIL, password: PASSWORD });
            token = loginRes.data.token;
            console.log('   Login successful.');
        } catch (e) {
            console.log('   Login failed, trying to register admin...');
            try {
                const regRes = await axios.post(`${API_URL}/users/register`, { name: 'Test Admin', email: EMAIL, password: PASSWORD });
                token = regRes.data.token;
                console.log('   Registration successful.');
                // Note: You might need to manually set this user as admin in DB if the endpoint requires admin.
                // But typically first user might not be admin, or we need an existing admin.
                // Let's assume the user provided valid creds or we'll cheat and use the DB to make them admin.
            } catch (regE) {
                console.error('   Registration also failed. Cannot proceed without token.', regE.message);
                return;
            }
        }

        // Ensure user is admin (Backend check: listingRoutes.js uses 'admin' middleware)
        // We might need to DB update this user to be admin if they aren't.
        // But let's try the flow first.

        console.log('2. Getting a listing to test...');
        const listingsRes = await axios.get(`${API_URL}/market`);
        const listings = listingsRes.data;
        if (listings.length === 0) {
            console.error('   No listings found to test. create one first.');
            return;
        }
        const targetListing = listings[0];
        console.log(`   Target Listing: ${targetListing.title} (ID: ${targetListing._id})`);
        console.log(`   Initial State: Featured=${targetListing.isFeatured}`);

        console.log('3. Promoting Listing (Weekly)...');
        try {
            await axios.put(
                `${API_URL}/market/${targetListing._id}/feature`,
                { duration: 'weekly' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('   Promotion request sent.');
        } catch (e) {
            console.error('   Promotion Failed (Auth?):', e.response?.data?.message || e.message);
            return;
        }

        console.log('4. Verifying Promotion in Market...');
        const verifyRes = await axios.get(`${API_URL}/market?isFeatured=true`);
        const featuredList = verifyRes.data;
        const isNowFeatured = featuredList.find(l => l._id === targetListing._id);

        if (isNowFeatured) {
            console.log('   SUCCESS: Listing IS showing in featured results.');
        } else {
            console.log('   FAILURE: Listing is NOT showing in featured results.');
        }

        console.log('5. Removing Promotion...');
        await axios.put(
            `${API_URL}/market/${targetListing._id}/feature`,
            { duration: 'remove' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('   Removal request sent.');

        console.log('6. Verifying Removal...');
        const verifyRemoveRes = await axios.get(`${API_URL}/market?isFeatured=true`);
        const isStillFeatured = verifyRemoveRes.data.find(l => l._id === targetListing._id);

        if (!isStillFeatured) {
            console.log('   SUCCESS: Listing is NO LONGER featured.');
        } else {
            console.log('   FAILURE: Listing is STILL showing as featured.');
        }

    } catch (error) {
        console.error('Unexpected Error:', error.message);
    }
}

verifyPromotionFlow();
