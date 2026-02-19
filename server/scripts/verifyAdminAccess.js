const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const verifyAdmin = async () => {
    try {
        console.log('1. Attempting to login as admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'admin123'
        });

        const token = loginRes.data.token;
        console.log('Login successful. Token received.');
        console.log('User Role:', loginRes.data.role);

        if (loginRes.data.role !== 'admin') {
            console.error('ERROR: Logged in user does not have admin role!');
            return;
        }

        console.log('\n2. Attempting to access protected admin route (/admin/stats)...');
        try {
            const statsRes = await axios.get(`${API_URL}/admin/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Admin route access successful!');
            console.log('Status:', statsRes.status);
            console.log('Data:', statsRes.data);
        } catch (err) {
            console.error('Failed to access admin route:', err.response ? err.response.data : err.message);
            if (err.response && err.response.status === 401) {
                console.log('Reason: Unauthorized (401). Check middleware.');
            }
        }

    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
};

verifyAdmin();
