
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@example.com';
        const password = 'admin123';

        let user = await User.findOne({ email });

        if (user) {
            console.log('Admin user exists. Updating password and ensuring role...');
            user.password = password; // Pre-save hook will hash this
            user.role = 'admin';
            user.name = 'Admin User';
            await user.save();
            console.log('Admin user updated.');
        } else {
            console.log('Creating new admin user...');
            user = new User({
                name: 'Admin User',
                email: email,
                password: password,
                role: 'admin',
                phone: '0000000000'
            });
            await user.save();
            console.log('Admin user created.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
