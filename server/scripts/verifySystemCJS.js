const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function test() {
    try {
        console.log('1. Registering/Logging in Test Admin...');
        let token;
        try {
            const res = await axios.post(`${API_URL}/users/login`, {
                email: 'verify@test.com',
                password: 'password123'
            });
            token = res.data.token;
        } catch (e) {
            const res = await axios.post(`${API_URL}/users/register`, {
                name: 'Verify Admin',
                email: 'verify@test.com',
                password: 'password123'
            });
            token = res.data.token;
        }

        console.log('2. Finding a listing...');
        const listRes = await axios.get(`${API_URL}/market`);
        const listing = listRes.data[0];

        if (!listing) {
            console.log('No listings found. Skipping test.');
            return;
        }
        console.log(`   Found listing: ${listing.title} (${listing._id})`);

        console.log('3. Promoting (Weekly)...');
        await axios.put(`${API_URL}/market/${listing._id}/feature`,
            { duration: 'weekly' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('   Promote request successful.');

        console.log('4. Verifying "Featured" state...');
        const featRes = await axios.get(`${API_URL}/market?isFeatured=true`);
        const isFeatured = featRes.data.find(l => l._id === listing._id);
        if (isFeatured) console.log('   PASS: Listing is in featured list.');
        else console.log('   FAIL: Listing NOT in featured list.');

        console.log('5. Removing Promotion...');
        await axios.put(`${API_URL}/market/${listing._id}/feature`,
            { duration: 'remove' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('   Remove request successful.');

        console.log('6. Verifying Removal...');
        const remRes = await axios.get(`${API_URL}/market?isFeatured=true`);
        const isGone = !remRes.data.find(l => l._id === listing._id);
        if (isGone) console.log('   PASS: Listing removed from featured list.');
        else console.log('   FAIL: Listing STILL in featured list.');

    } catch (err) {
        console.error('TEST FAILED:', err.response ? err.response.data : err.message);
    }
}

test();
