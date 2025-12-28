const axios = require('axios');

async function setupTest() {
    try {
        console.log('1. Setting up User...');
        let user;
        try {
            const loginRes = await axios.post('http://localhost:5000/api/users/login', {
                email: 'promo_tester@example.com',
                password: 'password123'
            });
            user = loginRes.data;
            console.log('User Exists');
        } catch (e) {
            const regRes = await axios.post('http://localhost:5000/api/users', {
                name: 'Promo Tester',
                email: 'promo_tester@example.com',
                password: 'password123',
                phone: '03001234567',
                role: 'pet_owner'
            });
            user = regRes.data;
            console.log('User Registered');
        }

        console.log('2. Creating Listing...');
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const newListing = {
            title: 'Promotion Test Pet',
            description: 'This is a test pet to verify promotion button',
            price: 1500,
            category: 'Cat',
            location: 'Lahore',
            breed: 'Persian',
            age: 2,
            images: ['https://via.placeholder.com/300'],
            phone: '03001234567',
            gender: 'Female'
        };

        await axios.post('http://localhost:5000/api/market', newListing, config);
        console.log('Listing Created');

        console.log('3. Setting up Admin...');
        // We can't register as admin via public API usually, but let's try or update DB directly if possible.
        // Actually, let's just use the user we have. If we need admin specific actions we might need to seed it directly or use a known admin.
        // For now, checking the "Promote" button only requires a normal user.

        console.log('DONE. Login with: promo_tester@example.com / password123');

    } catch (err) {
        console.error('Setup Failed:', err.message);
        if (err.response) console.error(err.response.data);
    }
}

setupTest();
