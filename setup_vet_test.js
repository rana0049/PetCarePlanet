const mongoose = require('mongoose');
const User = require('./server/models/User'); // Adjust path as needed
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

const setupVet = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        let vet = await User.findOne({ email: 'vet_fee_test@example.com' });

        if (!vet) {
            console.log('Creating new vet...');
            vet = new User({
                name: 'Dr. Fee Test',
                email: 'vet_fee_test@example.com',
                password: 'password123', // Will be hashed by pre-save
                role: 'vet',
                specialization: 'Surgeon',
                vetCategory: 'Small Animal',
                experience: 5,
                clinicAddress: '123 Vet Lane',
                isApproved: true,
                fee: 1000
            });
        } else {
            console.log('Vet exists. Updating...');
            vet.isApproved = true;
            vet.password = 'password123'; // Resetting password
        }

        await vet.save();
        console.log('Vet ready: vet_fee_test@example.com / password123');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

setupVet();
