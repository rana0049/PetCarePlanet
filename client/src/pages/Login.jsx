import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaStar } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/50 backdrop-blur-md rounded-full text-primary-700 font-semibold mb-4 shadow-sm">
                        <FaStar className="text-accent-500" /> Welcome Back
                    </div>
                    <h2 className="text-4xl font-display font-bold text-neutral-900 mb-2">Sign In</h2>
                    <p className="text-neutral-600 text-lg">Access your pet care dashboard</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-neutral-700 font-bold mb-2 text-sm">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                                <input
                                    type="email"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-neutral-700 font-bold mb-2 text-sm">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                                <input
                                    type="password"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mb-6">
                            <Link to="/forgot-password" className="text-sm font-bold text-primary-600 hover:text-primary-700">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </form>

                    <p className="mt-6 text-center text-neutral-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
