const API_URL = 'http://localhost:5000/api';

async function request(url, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    };

    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
}

async function test() {
    try {
        console.log('1. Registering/Logging in Test Admin...');
        let token;
        try {
            const data = await request(`${API_URL}/auth/login`, 'POST', {
                email: 'verify@test.com',
                password: 'password123'
            });
            token = data.token;
        } catch (e) {
            const data = await request(`${API_URL}/auth/register`, 'POST', {
                name: 'Verify Admin',
                email: 'verify@test.com',
                password: 'password123'
            });
            token = data.token;
        }

        console.log('2. Finding a listing...');
        const listings = await request(`${API_URL}/market`);
        const listing = listings[0];

        if (!listing) {
            console.log('No listings found. Skipping test.');
            return;
        }
        console.log(`   Found listing: ${listing.title} (${listing._id})`);

        console.log('3. Promoting (Weekly)...');
        await request(`${API_URL}/market/${listing._id}/feature`, 'PUT', { duration: 'weekly' }, token);
        console.log('   Promote request successful.');

        console.log('4. Verifying "Featured" state...');
        const featuredList = await request(`${API_URL}/market?isFeatured=true`);
        const isFeatured = featuredList.find(l => l._id === listing._id);
        if (isFeatured) console.log('   PASS: Listing is in featured list.');
        else console.log('   FAIL: Listing NOT in featured list.');

        console.log('5. Removing Promotion...');
        await request(`${API_URL}/market/${listing._id}/feature`, 'PUT', { duration: 'remove' }, token);
        console.log('   Remove request successful.');

        console.log('6. Verifying Removal...');
        const featuredListAfter = await request(`${API_URL}/market?isFeatured=true`);
        const isGone = !featuredListAfter.find(l => l._id === listing._id);
        if (isGone) console.log('   PASS: Listing removed from featured list.');
        else console.log('   FAIL: Listing STILL in featured list.');

    } catch (err) {
        console.error('TEST FAILED:', err.message);
    }
}

test();
