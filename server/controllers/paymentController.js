const Transaction = require('../models/Transaction');
const Listing = require('../models/Listing');
const User = require('../models/User');

const paymentController = {
    // User submits a payment for verification
    submitPayment: async (req, res) => {
        try {
            const { amount, paymentMethod, transactionReference, type, relatedListing, screenshotUrl, packageType } = req.body;
            const userId = req.user.userId; // Provided by auth middleware

            if (type === 'feature_listing') {
                const listing = await Listing.findById(relatedListing);
                if (!listing) {
                    return res.status(404).json({ message: 'Listing not found.' });
                }
                if (listing.status !== 'approved') {
                    return res.status(400).json({ message: 'Listing must be approved before it can be promoted.' });
                }
            }

            const transaction = new Transaction({
                user: userId,
                amount,
                paymentMethod,
                transactionReference,
                screenshotUrl,
                type,
                packageType: type === 'feature_listing' ? (packageType || 'weekly') : undefined,
                relatedListing: type === 'feature_listing' ? relatedListing : undefined,
                status: 'pending'
            });

            await transaction.save();

            res.status(201).json({ message: 'Payment submitted successfully! Waiting for admin approval.', transaction });
        } catch (error) {
            console.error('Payment Submission Error:', error);
            res.status(500).json({ message: 'Error submitting payment.' });
        }
    },

    // Admin gets all pending transactions
    getPendingTransactions: async (req, res) => {
        try {
            const transactions = await Transaction.find({ status: 'pending' })
                .populate('user', 'name email')
                .populate('relatedListing', 'title')
                .sort({ createdAt: -1 });

            res.status(200).json(transactions);
        } catch (error) {
            console.error('Fetch Transactions Error:', error);
            res.status(500).json({ message: 'Error fetching transactions.' });
        }
    },

    // Admin approves a payment
    approveTransaction: async (req, res) => {
        try {
            const { transactionId } = req.params;
            const transaction = await Transaction.findById(transactionId);

            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found.' });
            }

            if (transaction.status !== 'pending') {
                return res.status(400).json({ message: 'Transaction is already processed.' });
            }

            // Update Transaction Status
            transaction.status = 'approved';
            await transaction.save();

            // Apply Benefits
            if (transaction.type === 'feature_listing') {
                const listing = await Listing.findById(transaction.relatedListing);
                if (listing) {
                    listing.isFeatured = true;
                    listing.isFeatured = true;
                    // Feature based on package
                    const expiresAt = new Date();
                    if (transaction.packageType === 'monthly') {
                        expiresAt.setDate(expiresAt.getDate() + 30);
                    } else {
                        // Default to weekly
                        expiresAt.setDate(expiresAt.getDate() + 7);
                    }
                    listing.featuredExpiresAt = expiresAt;
                    await listing.save();
                }
            } else if (transaction.type === 'vet_subscription') {
                const user = await User.findById(transaction.user);
                if (user) {
                    user.subscriptionStatus = 'active';
                    // Subscribe for 30 days
                    const expiresAt = new Date();
                    expiresAt.setDate(expiresAt.getDate() + 30);
                    user.subscriptionExpiresAt = expiresAt;
                    await user.save();
                }
            }

            res.status(200).json({ message: 'Payment approved and benefits applied!', transaction });
        } catch (error) {
            console.error('Approval Error:', error);
            res.status(500).json({ message: 'Error approving transaction.' });
        }
    },

    // Admin rejects a payment
    rejectTransaction: async (req, res) => {
        try {
            const { transactionId } = req.params;
            const transaction = await Transaction.findById(transactionId);

            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found.' });
            }

            transaction.status = 'rejected';
            await transaction.save();

            res.status(200).json({ message: 'Transaction rejected.', transaction });
        } catch (error) {
            console.error('Rejection Error:', error);
            res.status(500).json({ message: 'Error rejecting transaction.' });
        }
    }
};

module.exports = paymentController;
