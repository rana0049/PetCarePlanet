// @desc    Simulate JazzCash/Easypaisa Payment
// @route   POST /api/payments/charge
// @access  Private
const processPayment = async (req, res) => {
    const { amount, method, phoneNumber } = req.body;

    // Simulate processing delay
    setTimeout(() => {
        // Mock success (80% chance)
        const isSuccess = Math.random() < 0.8;

        if (isSuccess) {
            res.json({
                success: true,
                transactionId: 'TXN' + Math.floor(Math.random() * 1000000000),
                message: `Payment of PKR ${amount} via ${method} successful.`,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment failed. Insufficient funds or network error.',
            });
        }
    }, 2000);
};

module.exports = { processPayment };
