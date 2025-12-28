const axios = require('axios');

async function testGetVets() {
    try {
        console.log('Fetching vets from http://localhost:5000/api/users/vets...');
        const response = await axios.get('http://localhost:5000/api/users/vets');
        console.log('Status:', response.status);
        console.log('Vets Found:', response.data.length);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching vets:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testGetVets();
