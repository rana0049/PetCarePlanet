const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { bookAppointment } = require('../controllers/appointmentController');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyAdHocBooking = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Create Dummy Data
        const vet = await User.create({
            name: 'Test Vet ' + Date.now(),
            email: `testvet${Date.now()}@example.com`,
            password: 'password123',
            role: 'vet',
            specialization: 'General',
            supportedSpecies: ['Dog', 'Cat', 'Dinosaur']
        });

        const owner = await User.create({
            name: 'Test Owner ' + Date.now(),
            email: `testowner${Date.now()}@example.com`,
            password: 'password123',
            role: 'pet_owner'
        });

        console.log('Created Users:', { vet: vet._id, owner: owner._id });

        // Mock Req/Res
        const req = {
            user: owner,
            body: {
                vetId: vet._id,
                petName: 'Rex',
                petSpecies: 'Dinosaur',
                date: new Date(),
                timeSlot: '10:00 AM - 11:00 AM',
                reason: 'Checkup'
            }
        };

        const res = {
            status: (code) => {
                console.log('Status:', code);
                return res;
            },
            json: (data) => {
                console.log('Response Data:', data);
                if (data.petName === 'Rex') {
                    console.log('SUCCESS: Appointment created with ad-hoc pet details.');
                } else {
                    console.log('FAILURE: Response data does not match expected fields.');
                }
            }
        };

        // Execute Controller
        await bookAppointment(req, res);

        // Verification DB Check
        const savedAppt = await Appointment.findOne({ petName: 'Rex' });
        if (savedAppt && savedAppt.petSpecies === 'Dinosaur') {
            console.log('DB VERIFICATION: PASSED. Appointment found in DB.');
        } else {
            console.log('DB VERIFICATION: FAILED. Appointment not found or incorrect.');
        }

        // Cleanup
        await User.findByIdAndDelete(vet._id);
        await User.findByIdAndDelete(owner._id);
        if (savedAppt) await Appointment.findByIdAndDelete(savedAppt._id);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyAdHocBooking();
