const mongoose = require('mongoose');

const listingSchema = mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true, // e.g., Dog, Cat, Bird
    },
    breed: String,
    age: Number,
    images: [{
        type: String, // URL to image
        required: true,
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'sold', 'rejected'],
        default: 'pending',
    },
    location: {
        type: String,
        required: true, // e.g., Lahore, Karachi
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Pair', 'Unknown'],
        default: 'Unknown',
    },
    isVaccinated: {
        type: Boolean,
        default: false,
    },
    isTrained: {
        type: Boolean,
        default: false,
    },
    isPedigree: {
        type: Boolean,
        default: false,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
