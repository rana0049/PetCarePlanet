const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Submit a new manual payment
router.post('/submit', protect, paymentController.submitPayment);

// Stripe Routes
router.post('/create-payment-intent', protect, paymentController.createPaymentIntent);
router.post('/confirm-stripe-payment', protect, paymentController.confirmStripePayment);

// Admin Routes for Manual Verification
router.get('/pending', protect, admin, paymentController.getPendingTransactions);
router.put('/action/:transactionId/approve', protect, admin, paymentController.approveTransaction);
router.put('/action/:transactionId/reject', protect, admin, paymentController.rejectTransaction);

module.exports = router;
