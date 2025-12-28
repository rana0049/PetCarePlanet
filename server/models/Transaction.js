const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'PKR',
    },
    paymentMethod: {
        type: String,
        enum: ['jazzcash', 'easypaisa', 'bank_transfer'],
        required: true,
    },
    transactionReference: {
        type: String,
        required: true,
        trim: true,
    },
    screenshotUrl: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    type: {
        type: String,
        enum: ['feature_listing', 'vet_subscription'],
        required: true,
    },
    packageType: {
        type: String,
        enum: ['weekly', 'monthly'],
        default: 'weekly'
    },
    relatedListing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: function () { return this.type === 'feature_listing'; }
    },
    adminNote: {
        type: String,
    }
}, {
    timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
