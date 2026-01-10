const mongoose = require('mongoose');
const User = require('./server/models/User');
const Listing = require('./server/models/Listing');
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

const setupStripeTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Create User
        const email = 'stripe_tester@example.com';
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name: 'Stripe Tester',
                email,
                password: 'password123', // Will be hashed via pre-save hook? 
                // Wait, if I use model directly, pre-save hooks run on .save()
                role: 'pet_owner',
            });
            // We need to ensure the password is plain text so the pre-save hook hashes it, 
            // OR if the hook logic handles it. 
            // Looking at User.js: if (!this.isModified('password')) return next();
            // So new User() + save() should hash it.
        } else {
            // Reset password just in case
            user.password = 'password123';
        }
        await user.save();
        console.log(`User ready: ${email}`);

        // 2. Create Listing
        // Check if listing exists
        let listing = await Listing.findOne({ user: user._id, title: 'Stripe Test Puppy' });

        if (!listing) {
            listing = new Listing({
                user: user._id,
                title: 'Stripe Test Puppy',
                type: 'Dog',
                breed: 'Golden Retriever',
                age: 2,
                price: 5000,
                description: 'A cute puppy ready for boosting.',
                location: 'Lahore',
                images: ['https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80&w=1000'],
                status: 'approved', // Must be approved to boost
                isFeatured: false
            });
            await listing.save();
        } else {
            // Reset status to ensure we can boost it
            listing.status = 'approved';
            listing.isFeatured = false;
            listing.featuredExpiresAt = null;
            await listing.save();
        }

        console.log(`Listing ready: ${listing._id}`);
        console.log(`Listing URL: http://localhost:5173/market/${listing._id}`);

        process.exit(0);
    } catch (error) {
        console.error('Setup Error:', error);
        process.exit(1);
    }
};

setupStripeTest();
