import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserMd, FaPaw, FaStar } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'pet_owner',
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');


    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold mb-4">
                        <FaStar /> Join Us Today
                    </div>
                    <h2 className="text-5xl font-display font-bold text-white mb-2">Create Account</h2>
                    <p className="text-white/90 text-lg">Start your pet care journey</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-white/50">
                    {error && (
                        <div className="bg-red-100 border-2 border-red-300 text-red-700 p-4 rounded-xl mb-6 font-semibold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full bg-gray-50 border-2 border-purple-200 text-gray-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full bg-gray-50 border-2 border-purple-200 text-gray-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                    onChange={handleChange}
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
                                    name="password"
                                    className="w-full bg-gray-50 border-2 border-purple-200 text-gray-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-3">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'pet_owner' })}
                                    className={`p-5 rounded-2xl border-3 transition-all ${formData.role === 'pet_owner'
                                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                                        : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                                        }`}
                                >
                                    <FaPaw className="text-4xl mx-auto mb-2 text-purple-500" />
                                    <span className="block text-gray-800 font-bold">Pet Owner</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'vet' })}
                                    className={`p-5 rounded-2xl border-3 transition-all ${formData.role === 'vet'
                                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg'
                                        : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                                        }`}
                                >
                                    <FaUserMd className="text-4xl mx-auto mb-2 text-blue-500" />
                                    <span className="block text-gray-800 font-bold">Veterinarian</span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 hover:text-purple-700 font-bold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
