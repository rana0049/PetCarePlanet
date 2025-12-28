
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:5000/api';

async function testPromotion() {
    try {
        console.log('1. Logging in as admin...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });

        if (!loginRes.ok) {
            console.log('   Login failed. Status:', loginRes.status);
            const text = await loginRes.text();
            console.log('   Response:', text);
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('   Login successful.');

        console.log('2. Fetching listings...');
        const listingsRes = await fetch(`${API_URL}/market/admin/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const listings = await listingsRes.json();
        if (listings.length === 0) {
            console.log('   No listings found to test promotion.');
            return;
        }

        const targetListing = listings[0];
        console.log(`   Targeting listing: ${targetListing.title} (${targetListing._id})`);
        console.log(`   Current Featured Status: ${targetListing.isFeatured}`);

        console.log('3. Promoting Listing (Weekly)...');
        // NOTE: The server route is /:id/feature
        // We fixed the typo in the previous step, ensuring it's correct here too.
        const promoteRes = await fetch(`${API_URL}/market/${targetListing._id}/feature`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ duration: 'weekly' })
        });

        console.log('   Promotion response status:', promoteRes.status);

        if (!promoteRes.ok) {
            const errText = await promoteRes.text();
            console.error('   Promotion failed:', errText);
            return;
        }

        const updatedListing = await promoteRes.json();
        console.log('   New Featured Status:', updatedListing.isFeatured);
        console.log('   Expires At:', updatedListing.featuredExpiresAt);

        if (updatedListing.isFeatured === true) {
            console.log('SUCCESS: Backend promotion logic works.');
        } else {
            console.error('FAILURE: Listing was not promoted in response.');
        }

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testPromotion();
