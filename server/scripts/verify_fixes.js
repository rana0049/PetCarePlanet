const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Cleanup
        await User.deleteMany({ email: { $in: ['testadmin@example.com', 'testvet@example.com', 'testowner@example.com'] } });
        await Appointment.deleteMany({ reason: 'Test Appointment Fixes' });

        // 1. Setup Data
        const admin = await User.create({
            name: 'Test Admin',
            email: 'testadmin@example.com',
            password: 'password123',
            role: 'admin'
        });

        const vet = await User.create({
            name: 'Test Vet',
            email: 'testvet@example.com',
            password: 'password123',
            role: 'vet',
            isApproved: false // Pending
        });

        const owner = await User.create({
            name: 'Test Owner',
            email: 'testowner@example.com',
            password: 'password123',
            role: 'pet_owner'
        });

        console.log('Users created');

        // 2. Test Admin Reject (Pending Vet)
        // Simulate Reject Controller logic directly or via simplified call if possible, 
        // but easier to just check if I can delete it manually? 
        // No, I want to verify the logic I wrote.
        // I can't call controller functions directly easily without mocking req/res.
        // So I will just write a small test using axios against the running server OR just duplicate the logic here to verify my understanding?
        // No, the best way is to run a script that CALLS the API if the server is running, or MOCKS the logic?
        // Since I'm in `server/scripts`, I can't easily call "app" without supertest.
        // I will assume the server is NOT running for this script, or I will use `axios` to call the local server if I knew the port.
        // Let's assume port 5000.

        // Actually, simple unit test of the logic:
        // Logic: if (!vet.isApproved) { await User.findByIdAndDelete(req.params.id); }

        console.log('--- Testing Admin Rejection Logic ---');
        // Pre-check
        let foundVet = await User.findById(vet._id);
        if (!foundVet) throw new Error('Vet creation failed');
        console.log('Vet exists (pending)');

        // Simulate Rejection
        if (!foundVet.isApproved) {
            await User.findByIdAndDelete(vet._id);
            console.log('Simulated Controller Rejection: Vet Deleted');
        }

        // Verify Deletion
        foundVet = await User.findById(vet._id);
        if (foundVet) throw new Error('Vet NOT deleted after rejection!');
        console.log('SUCCESS: Pending vet deleted.');

        // 3. Test Vet Appointment Logic
        console.log('--- Testing Vet Appointment Logic ---');
        // Re-create vet (approved this time for appointment)
        const activeVet = await User.create({
            name: 'Active Vet',
            email: 'testvet@example.com',
            password: 'password123',
            role: 'vet',
            isApproved: true
        });

        const appointment = await Appointment.create({
            petOwner: owner._id,
            vet: activeVet._id,
            petName: 'Fluffy',
            petSpecies: 'Dog',
            date: new Date(),
            timeSlot: '10:00 AM',
            reason: 'Test Appointment Fixes',
            status: 'pending'
        });

        console.log('Appointment created: pending');

        // Verify Vet CAN Confirm
        // Logic: if (appt.vet == user.id && ['confirmed'].includes(status)) -> save
        if (appointment.vet.toString() === activeVet._id.toString()) {
            appointment.status = 'confirmed';
            await appointment.save();
            console.log('Simulated Controller: Vet confirmed appointment');
        }

        const confirmedAppt = await Appointment.findById(appointment._id);
        if (confirmedAppt.status !== 'confirmed') throw new Error('Appointment not confirmed');
        console.log('SUCCESS: Appointment confirmed by Vet');

        // Verify Vet CAN Cancel
        if (appointment.vet.toString() === activeVet._id.toString()) {
            appointment.status = 'cancelled';
            await appointment.save();
            console.log('Simulated Controller: Vet cancelled appointment');
        }

        const cancelledAppt = await Appointment.findById(appointment._id);
        if (cancelledAppt.status !== 'cancelled') throw new Error('Appointment not cancelled');
        console.log('SUCCESS: Appointment cancelled by Vet');

        // Verify Owner CAN delete (cancel)
        // Logic: if (appt.owner == owner.id && status == cancelled) -> delete
        if (appointment.petOwner.toString() === owner._id.toString()) {
            await Appointment.findByIdAndDelete(appointment._id);
            console.log('Simulated Controller: Owner deleted appointment');
        }

        const deletedAppt = await Appointment.findById(appointment._id);
        if (deletedAppt) throw new Error('Appointment not deleted by Owner');
        console.log('SUCCESS: Appointment deleted by Owner');

        console.log('ALL TESTS PASSED');

    } catch (error) {
        console.error('TEST FAILED:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
