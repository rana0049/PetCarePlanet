import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaStar } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold mb-4">
                        <FaStar /> Welcome Back
                    </div>
                    <h2 className="text-5xl font-display font-bold text-white mb-2">Sign In</h2>
                    <p className="text-white/80 text-lg">Access your pet care dashboard</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-white/50">
                    {error && (
                        <div className="bg-red-100 border-2 border-red-300 text-red-700 p-4 rounded-xl mb-6 font-semibold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                                <input
                                    type="email"
                                    className="w-full bg-gray-50 border-2 border-purple-200 text-gray-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                                <input
                                    type="password"
                                    className="w-full bg-gray-50 border-2 border-purple-200 text-gray-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-purple-600 hover:text-purple-700 font-bold">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
