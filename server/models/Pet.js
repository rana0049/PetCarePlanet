const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true, // e.g., Dog, Cat
    },
    breed: String,
    age: Number, // in years
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    weightHistory: [{
        weight: Number,
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    vaccinations: [{
        name: String,
        date: Date,
        nextDueDate: Date,
    }],
    medicalHistory: [{
        condition: String,
        treatment: String,
        date: Date,
        vet: String,
    }],
}, {
    timestamps: true,
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
