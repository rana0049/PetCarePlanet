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
    image: {
        type: String, // URL to image
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'sold', 'rejected'],
        default: 'pending',
    },
    location: {
        type: String,
        required: true, // e.g., Lahore, Karachi
    },
}, {
    timestamps: true,
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
