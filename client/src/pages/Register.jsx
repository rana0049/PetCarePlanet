import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserMd, FaPaw, FaStar, FaPhone } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'pet_owner',
        specialization: '',
        vetCategory: 'Small Animal',
        experience: '',
        clinicAddress: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(formData);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-100 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/50 backdrop-blur-md rounded-full text-primary-700 font-semibold mb-4 shadow-sm">
                        <FaStar className="text-accent-500" /> Join Us Today
                    </div>
                    <h2 className="text-4xl font-display font-bold text-neutral-900 mb-2">Create Account</h2>
                    <p className="text-neutral-600 text-lg">Start your pet care journey</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-neutral-700 font-bold mb-2 text-sm">Full Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-neutral-700 font-bold mb-2 text-sm">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-neutral-700 font-bold mb-2 text-sm">Phone Number</label>
                            <div className="relative">
                                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    onChange={handleChange}
                                    placeholder="+92 300 1234567"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-neutral-700 font-bold mb-2 text-sm">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-neutral-700 font-bold mb-3 text-sm">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'pet_owner' })}
                                    className={`p-4 rounded-2xl border-2 transition-all ${formData.role === 'pet_owner'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-secondary-200 bg-white hover:border-primary-200 text-neutral-600'
                                        }`}
                                >
                                    <FaPaw className={`text-3xl mx-auto mb-2 ${formData.role === 'pet_owner' ? 'text-primary-600' : 'text-neutral-400'}`} />
                                    <span className="block font-bold text-sm">Pet Owner</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'vet' })}
                                    className={`p-4 rounded-2xl border-2 transition-all ${formData.role === 'vet'
                                        ? 'border-accent-500 bg-accent-50 text-accent-700'
                                        : 'border-secondary-200 bg-white hover:border-accent-200 text-neutral-600'
                                        }`}
                                >
                                    <FaUserMd className={`text-3xl mx-auto mb-2 ${formData.role === 'vet' ? 'text-accent-500' : 'text-neutral-400'}`} />
                                    <span className="block font-bold text-sm">Veterinarian</span>
                                </button>
                            </div>
                        </div>

                        {formData.role === 'vet' && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="p-4 bg-accent-50 rounded-2xl border border-accent-100">
                                    <h3 className="text-accent-800 font-bold mb-3 flex items-center gap-2">
                                        <FaUserMd /> Professional Details
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-neutral-700 font-bold mb-2 text-sm">Specialization</label>
                                            <input
                                                type="text"
                                                name="specialization"
                                                className="w-full bg-white border border-secondary-200 text-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
                                                onChange={handleChange}
                                                placeholder="e.g. Surgeon, General Practitioner"
                                                required={formData.role === 'vet'}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-neutral-700 font-bold mb-2 text-sm">Experience (Years)</label>
                                                <input
                                                    type="number"
                                                    name="experience"
                                                    className="w-full bg-white border border-secondary-200 text-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
                                                    onChange={handleChange}
                                                    placeholder="e.g. 5"
                                                    min="0"
                                                    required={formData.role === 'vet'}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-neutral-700 font-bold mb-2 text-sm">Clinic Name/Address</label>
                                                <input
                                                    type="text"
                                                    name="clinicAddress"
                                                    className="w-full bg-white border border-secondary-200 text-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
                                                    onChange={handleChange}
                                                    placeholder="City or Clinic Name"
                                                    required={formData.role === 'vet'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="mt-6 text-center text-neutral-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div >
        </div >
    );
};

export default Register;
