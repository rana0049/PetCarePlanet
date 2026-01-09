async function testRegistration() {
    const url = 'http://localhost:5000/api/auth/register';
    const userData = {
        name: "Test Vet",
        email: `testvet_${Date.now()}@example.com`,
        phone: "1234567890",
        password: "password123",
        role: "vet",
        specialization: "Surgeon",
        vetCategory: "Small Animal",
        experience: 5,
        clinicAddress: "123 Vet Lane"
    };

    console.log("Attempting registration with:", userData);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Registration Successful:", data);
        } else {
            console.error("Registration Failed - Status:", response.status);
            console.error("Error Data:", data);
        }
    } catch (error) {
        console.error("Error setting up request:", error.message);
    }
}

testRegistration();
