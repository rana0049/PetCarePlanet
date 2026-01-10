const stripe = require('stripe');
require('dotenv').config();

console.log("Current Directory:", process.cwd());
console.log("STRIPE_SECRET_KEY prefix:", process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 10) + "..." : "MISSING");

if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ Key missing.");
    process.exit(1);
}

const client = stripe(process.env.STRIPE_SECRET_KEY);

client.balance.retrieve()
    .then(balance => {
        console.log("✅ Connection Successful. Available:", balance.available[0].amount);
    })
    .catch(err => {
        console.error("❌ Connection Failed:", err.message);
    });
