import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaArrowLeft } from 'react-icons/fa';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { resetToken } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth(); // We might not need this if we handle token manually, but let's see

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/auth/resetpassword/${resetToken}`, { password });

            if (data.success) {
                setMessage('Password updated successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-display font-bold text-neutral-900 mb-2">Reset Password</h2>
                    <p className="text-neutral-600 text-lg">Enter your new password below</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100">
                    {message && (
                        <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl mb-6 font-medium text-sm">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-neutral-700 font-bold mb-2 text-sm">New Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                                <input
                                    type="password"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-neutral-700 font-bold mb-2 text-sm">Confirm Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                                <input
                                    type="password"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-neutral-600">
                        <Link to="/login" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold">
                            <FaArrowLeft /> Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
