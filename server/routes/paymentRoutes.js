const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route to submit a payment (Any logged-in user)
router.post('/submit', protect, paymentController.submitPayment);

// Admin Routes
router.get('/pending', protect, admin, paymentController.getPendingTransactions);
router.put('/action/:transactionId/approve', protect, admin, paymentController.approveTransaction);
router.put('/action/:transactionId/reject', protect, admin, paymentController.rejectTransaction);

module.exports = router;
