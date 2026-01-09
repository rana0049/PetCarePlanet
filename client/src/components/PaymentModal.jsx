import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentModal = ({ isOpen, onClose, type, amount: initialAmount, relatedId, onSuccess }) => {
    const [method, setMethod] = useState('jazzcash');
    const [tid, setTid] = useState('');
    const [screenshot, setScreenshot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Package Selection State
    const [packageType, setPackageType] = useState('weekly');
    const [currentAmount, setCurrentAmount] = useState(initialAmount);

    useEffect(() => {
        if (isOpen) {
            setCurrentAmount(initialAmount);
            setPackageType('weekly');
            setError('');
            setTid('');
            setScreenshot('');
        }
    }, [isOpen, initialAmount]);

    // Update amount when package changes
    useEffect(() => {
        if (type === 'feature_listing') {
            if (packageType === 'weekly') setCurrentAmount(500);
            if (packageType === 'monthly') setCurrentAmount(1500);
        }
    }, [packageType, type]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo?.token;

            if (!token) {
                throw new Error('Not authorized. Please log in again.');
            }
            const payload = {
                amount: currentAmount,
                paymentMethod: method,
                transactionReference: tid,
                type: type,
                relatedListing: relatedId,
                screenshotUrl: screenshot,
                packageType: type === 'feature_listing' ? packageType : undefined
            };

            await axios.post('http://localhost:5000/api/payments/submit', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit payment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {type === 'feature_listing' ? 'Promote Your Listing' : 'Subscribe as Vet'}
                </h2>

                {/* Package Selection for Featured Listings */}
                {type === 'feature_listing' && (
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div
                            onClick={() => setPackageType('weekly')}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${packageType === 'weekly' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                        >
                            <h3 className="font-bold text-gray-800">Weekly</h3>
                            <p className="text-sm text-gray-500">7 Days Promotion</p>
                            <p className="text-blue-600 font-bold mt-2">Rs. 500</p>
                        </div>
                        <div
                            onClick={() => setPackageType('monthly')}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${packageType === 'monthly' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                        >
                            <h3 className="font-bold text-gray-800">Monthly</h3>
                            <p className="text-sm text-gray-500">30 Days Promotion</p>
                            <p className="text-blue-600 font-bold mt-2">Rs. 1500</p>
                        </div>
                    </div>
                )}

                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-600 mb-2">Please transfer <strong className="text-blue-600 text-lg">Rs. {currentAmount}</strong> to:</p>

                    <div className="flex flex-col space-y-2">
                        <div className={`p-3 rounded-lg border cursor-pointer transition-all ${method === 'jazzcash' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} onClick={() => setMethod('jazzcash')}>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-red-600">JazzCash</span>
                                <span className="font-mono text-gray-700">0300-1234567</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg border cursor-pointer transition-all ${method === 'easypaisa' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`} onClick={() => setMethod('easypaisa')}>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-green-600">Easypaisa</span>
                                <span className="font-mono text-gray-700">0333-1234567</span>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID (TID)</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 8473928193"
                            value={tid}
                            onChange={(e) => setTid(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Screenshot URL (Optional)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Paste image link..."
                            value={screenshot}
                            onChange={(e) => setScreenshot(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Submit Verification'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
