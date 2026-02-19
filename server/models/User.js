const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: false }, // Optional for now to support existing users
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['pet_owner', 'vet', 'admin'],
            default: 'pet_owner',
        },
        // For Vets
        specialization: {
            type: String,
        },
        vetCategory: {
            type: String,
            enum: ['Small Animal', 'Large Animal', 'Mixed', 'Exotic Animal', 'Other'],
        },
        supportedSpecies: {
            type: [String],
            default: []
        },
        experience: {
            type: Number,
        },
        fee: {
            type: Number,
        },
        clinicAddress: String,
        isApproved: {
            type: Boolean,
            default: function () {
                return this.role !== 'vet'; // Vets need approval
            },
        },
        // Subscription Fields
        subscriptionStatus: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
        },
        subscriptionExpiresAt: {
            type: Date,
        },
        stripeCustomerId: { type: String },
        stripeSubscriptionId: { type: String },
        // Password reset fields
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        isBanned: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Match entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
