import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
// Using known test credentials or creating new ones would be better, 
// but let's try to register a temporary admin/user for this test to be self-contained.

async function test() {
    try {
        console.log('1. Registering/Logging in Test Admin...');
        let token;
        try {
            // Try login first
            const res = await axios.post(`${API_URL}/users/login`, {
                email: 'verify@test.com',
                password: 'password123'
            });
            token = res.data.token;
        } catch (e) {
            // If login fails, register
            const res = await axios.post(`${API_URL}/users/register`, {
                name: 'Verify Admin',
                email: 'verify@test.com',
                password: 'password123'
            });
            token = res.data.token;
        }

        // Note: In a real world, we'd need to make sure this user is an admin. 
        // For now, we assume the system might allow basic features or we rely on existing logic.
        // If 'promote' endpoint is admin-only, this user needs admin rights.
        // We will optimistically proceed.

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
        else {
            console.log('   FAIL: Listing NOT in featured list.');
            // Debug why
            const check = await axios.get(`${API_URL}/market/${listing._id}`);
            console.log('   Listing State:', check.data.isFeatured, check.data.featuredExpiresAt);
        }

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
