const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    petOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    vet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Pet',
    },
    petName: String,
    petSpecies: String,
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true, // e.g., "10:00 AM - 11:00 AM"
    },
    reason: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid',
    },
}, {
    timestamps: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
