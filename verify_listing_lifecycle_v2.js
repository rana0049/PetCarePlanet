const mongoose = require('mongoose');

async function verifyLifecycle() {
    try {
        console.log('1. Registering/Logging in User...');
        let user;

        // Login
        let res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test_lister@example.com',
                password: 'password123'
            })
        });

        if (res.ok) {
            user = await res.json();
            console.log('Logged in:', user.name);
        } else {
            // Register
            res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Test Lister',
                    email: 'test_lister@example.com',
                    password: 'password123',
                    phone: '1234567890'
                })
            });
            user = await res.json();
            if (!res.ok) throw new Error(JSON.stringify(user));
            console.log('Registered:', user.name);
        }

        const token = user.token;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        console.log('2. Creating Listing...');
        const newListing = {
            title: 'Lifecycle Test Pet',
            description: 'Testing create/update/delete',
            price: 500,
            category: 'Dog',
            location: 'Test City',
            breed: 'Lab',
            age: 1,
            images: ['https://via.placeholder.com/150'],
            phone: '1234567890'
        };

        res = await fetch('http://localhost:5000/api/market', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newListing)
        });
        const createdListing = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(createdListing));
        const listingId = createdListing._id;
        console.log('Created Listing:', listingId);

        console.log('3. Fetching Listing to Verify...');
        res = await fetch(`http://localhost:5000/api/market/${listingId}`);
        const parsedListing = await res.json();
        console.log('Fetched:', parsedListing.title);

        console.log('4. Updating Listing...');
        const updateData = {
            title: 'Lifecycle Test Pet UPDATED',
            price: 600
        };
        res = await fetch(`http://localhost:5000/api/market/${listingId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updateData)
        });
        const updated = await res.json();
        console.log('Updated:', updated.title);

        if (updated.title !== 'Lifecycle Test Pet UPDATED') {
            throw new Error('Update failed to persist');
        }

        console.log('5. Deleting Listing...');
        res = await fetch(`http://localhost:5000/api/market/${listingId}`, {
            method: 'DELETE',
            headers: headers
        });
        console.log('Deleted status:', res.status);

        res = await fetch(`http://localhost:5000/api/market/${listingId}`);
        if (res.status === 404) {
            console.log('Verified 404 after delete.');
        } else {
            console.error('Error: Listing should be 404, got', res.status);
        }

        console.log('SUCCESS: Full lifecycle verified.');

    } catch (error) {
        console.error('FAILURE:', error);
    }
}

verifyLifecycle();
