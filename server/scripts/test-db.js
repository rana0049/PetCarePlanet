const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Adjusted path since we run from server/scripts

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/petcareplenet';

console.log("Testing MongoDB Connection...");
console.log("URI:", uri);

mongoose.connect(uri)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Failed:");
        console.error(err);
        process.exit(1);
    });
