import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, type, relatedId, packageType, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        if (!stripe || !elements) {
            setLoading(false);
            return;
        }

        try {
            // 1. Confirm Payment with Stripe
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // We don't need a return_url because we handle success via the loop below or server hook, 
                    // but Elements requires it if redirecting. We'll use redirect: 'if_required'.
                    return_url: window.location.href,
                },
                redirect: 'if_required'
            });

            if (error) {
                setErrorMessage(error.message);
                onError(error.message);
                setLoading(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // 2. Notify Backend to Verify & Record
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                await axios.post(`${import.meta.env.VITE_API_URL}/payments/confirm-stripe-payment`, {
                    paymentIntentId: paymentIntent.id,
                    type,
                    relatedListing: relatedId,
                    packageType: type === 'feature_listing' ? packageType : undefined
                }, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });

                onSuccess();
                setLoading(false);
            }
        } catch (serverError) {
            console.error(serverError);
            setErrorMessage('Payment confirmed but server verification failed. Please contact support.');
            onError(serverError.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
            <button
                disabled={!stripe || loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
                {loading ? 'Processing...' : `Pay Rs. ${amount}`}
            </button>
        </form>
    );
};

const PaymentModal = ({ isOpen, onClose, type, amount: initialAmount, relatedId, onSuccess }) => {
    const [method, setMethod] = useState('card'); // Default to card
    const [tid, setTid] = useState('');
    const [screenshot, setScreenshot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');

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
            setMethod('card');
        }
    }, [isOpen, initialAmount]);

    // Update amount when package changes
    useEffect(() => {
        if (type === 'feature_listing') {
            if (packageType === 'weekly') setCurrentAmount(500);
            if (packageType === 'biweekly') setCurrentAmount(1000);
            if (packageType === 'monthly') setCurrentAmount(1500);
        }
    }, [packageType, type]);

    // Fetch Client Secret function
    const fetchClientSecret = async () => {
        if (isOpen && method === 'card') {
            setLoading(true); // Re-use loading state or add a specific one if needed, but 'loading' is used for submission. Let's rely on clientSecret being null for "loading" state of the form.
            setError('');
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/payments/create-payment-intent`, {
                    amount: currentAmount,
                    currency: 'pkr'
                }, {
                    headers: { Authorization: `Bearer ${userInfo?.token}` }
                });
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error("Failed to fetch intent", err);
                setError("Could not initialize payment system. Please check your connection or try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    // Fetch Client Secret when switching to Card
    useEffect(() => {
        fetchClientSecret();
    }, [isOpen, method, currentAmount]);


    if (!isOpen) return null;

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo?.token;

            if (!token) throw new Error('Not authorized.');

            const payload = {
                amount: currentAmount,
                paymentMethod: method,
                transactionReference: tid,
                type: type,
                relatedListing: relatedId,
                screenshotUrl: screenshot,
                packageType: type === 'feature_listing' ? packageType : undefined
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/payments/submit`, payload, {
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

    const appearance = { theme: 'stripe' };
    const options = { clientSecret, appearance };

    return (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative border border-white/20 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 transition-colors bg-neutral-100 p-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>

                <h2 className="text-3xl font-display font-bold mb-2 text-neutral-900">
                    {type === 'feature_listing' ? 'Boost Your Listing 🚀' : 'Subscribe as Vet'}
                </h2>
                <p className="text-neutral-500 mb-8">Choose a plan and payment method.</p>

                {/* Package Selection */}
                {type === 'feature_listing' && (
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {[
                            { id: 'weekly', label: '7 Days', price: 500 },
                            { id: 'biweekly', label: '14 Days', price: 1000 },
                            { id: 'monthly', label: '30 Days', price: 1500, popular: true },
                        ].map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => setPackageType(plan.id)}
                                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center ${packageType === plan.id ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-100' : 'border-neutral-200 hover:border-primary-200'}`}
                            >
                                {plan.popular && <span className="absolute -top-3 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">POPULAR</span>}
                                <span className="text-sm font-bold text-neutral-600">{plan.label}</span>
                                <span className="text-xl font-extrabold text-primary-600 mt-1">Rs.{plan.price}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Payment Method Tabs */}
                <div className="flex bg-neutral-100 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => { setMethod('card'); setError(''); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${method === 'card' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                        Credit/Debit Card
                    </button>
                    <button
                        onClick={() => { setMethod('manual'); setError(''); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${method === 'manual' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                        Manual Transfer
                    </button>
                </div>

                {method === 'card' ? (
                    clientSecret ? (
                        <Elements stripe={stripePromise} options={options}>
                            <CheckoutForm
                                amount={currentAmount}
                                type={type}
                                relatedId={relatedId}
                                packageType={packageType}
                                onSuccess={onSuccess}
                                onError={setError}
                            />
                        </Elements>
                    ) : (
                        <div className="flex flex-col justify-center items-center py-8">
                            {error ? (
                                <div className="text-center w-full">
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm border border-red-100">
                                        {error}
                                    </div>
                                    <button
                                        onClick={fetchClientSecret}
                                        className="text-primary-600 font-bold hover:underline text-sm"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                            )}
                        </div>
                    )
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 flex items-start gap-3">
                            <div className="bg-primary-100 p-2 rounded-full text-primary-600">ℹ️</div>
                            <div>
                                <p className="text-sm text-primary-900 font-medium">Please transfer <strong className="text-lg">Rs. {currentAmount}</strong> to:</p>
                                <ul className="text-sm text-primary-700 mt-2 space-y-1">
                                    <li>• <strong>JazzCash:</strong> 0300-1234567</li>
                                    <li>• <strong>Easypaisa:</strong> 0333-1234567</li>
                                </ul>
                            </div>
                        </div>

                        <form onSubmit={handleManualSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Transaction ID (TID)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="e.g. 8473928193"
                                    value={tid}
                                    onChange={(e) => setTid(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Screenshot URL (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="Provide a link to payment proof"
                                    value={screenshot}
                                    onChange={(e) => setScreenshot(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Verification'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
