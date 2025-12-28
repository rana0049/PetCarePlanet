const API_URL = 'http://localhost:5000/api';

const run = async () => {
    try {
        console.log('--- Starting Debug Script ---');

        // Helper for fetch
        const post = async (url, body, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`POST ${url} failed: ${res.status} ${text}`);
            }
            return res.json();
        };

        const get = async (url, token) => {
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch(url, { headers });
            if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
            return res.json();
        };

        const put = async (url, body, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers,
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`PUT ${url} failed: ${res.status} ${text}`);
            }
            return res.json();
        };

        // 1. Register User
        const email = `canceltest${Date.now()}@test.com`;
        console.log(`Registering user ${email}...`);
        const registerData = await post(`${API_URL}/auth/register`, {
            name: 'Cancel Test',
            email: email,
            password: 'password123',
            role: 'pet_owner',
            vetCategory: 'Small Animal'
        });
        const token = registerData.token;
        const userId = registerData._id;
        console.log('User registered. ID:', userId);

        // 3. Get Vets
        const vets = await get(`${API_URL}/users/vets`);
        if (vets.length === 0) {
            console.error('No vets found. Abort.');
            return;
        }
        const vetId = vets[0]._id;
        console.log('Using Vet ID:', vetId);

        // 4. Create Pet
        console.log('Creating pet...');
        const petData = await post(`${API_URL}/pets`, {
            name: 'Fluffy',
            type: 'Dog',
            breed: 'Mixed',
            age: 3,
            gender: 'Male'
        }, token);
        const petId = petData._id;
        console.log('Pet created. ID:', petId);

        // 5. Book Appointment
        console.log('Booking appointment...');
        const apptData = await post(`${API_URL}/appointments`, {
            vetId: vetId,
            petId: petId,
            date: new Date(Date.now() + 86400000).toISOString(),
            timeSlot: '10:00 AM',
            reason: 'Debug Cancel'
        }, token);

        const apptId = apptData._id;
        console.log(`Appointment booked. ID: ${apptId}, Status: ${apptData.status}`);

        // 6. Cancel Appointment
        console.log('Attempting to CANCEL appointment...');
        try {
            const cancelData = await put(`${API_URL}/appointments/${apptId}/status`, {
                status: 'cancelled'
            }, token);

            console.log('Cancel Request Success!');
            console.log('New Status:', cancelData.status);

            if (cancelData.status === 'cancelled') {
                console.log('PASSED: Appointment was cancelled successfully.');
            } else {
                console.log('FAILED: Status did not update to cancelled.');
            }

        } catch (cancelErr) {
            console.error('Cancel Request Failed:', cancelErr.message);
        }

    } catch (err) {
        console.error('Script Error:', err.message);
    }
};

run();
