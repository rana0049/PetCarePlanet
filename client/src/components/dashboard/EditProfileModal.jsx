import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaUserMd, FaTimes, FaSave } from 'react-icons/fa';

const EditProfileModal = ({ isOpen, onClose, onSuccess }) => {
    const { user, updateUser } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        vetCategory: 'Small Animal',
        experience: '',
        fee: '',
        clinicAddress: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                specialization: user.specialization || '',
                vetCategory: user.vetCategory || 'Small Animal',
                experience: user.experience || '',
                fee: user.fee || '',
                clinicAddress: user.clinicAddress || ''
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, formData, config);

            // Correctly merge the existing user data (like token) with the new profile data
            // The backend returns: _id, name, email, role, specialization, experience, clinicAddress, and potentially token
            // Ensure we don't lose the token if the backend didn't send it (controller sends req.body.token but let's be safe)
            const updatedUser = { ...user, ...data };

            updateUser(updatedUser); // Update context and localStorage via context method

            onSuccess(updatedUser);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-secondary-100 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-display font-bold text-neutral-900 flex items-center gap-2">
                        <FaUserMd className="text-primary-600" /> Edit Profile
                    </h3>
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
                        <FaTimes size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-neutral-700 font-semibold mb-2 text-sm">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-neutral-700 font-semibold mb-2 text-sm">Category</label>
                            <select
                                value={formData.vetCategory}
                                onChange={(e) => setFormData({ ...formData, vetCategory: e.target.value })}
                                className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all appearance-none"
                            >
                                <option value="Small Animal">Small Animal</option>
                                <option value="Large Animal">Large Animal</option>
                                <option value="Mixed">Mixed</option>
                                <option value="Exotic Animal">Exotic Animal</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-neutral-700 font-semibold mb-2 text-sm">Specialization</label>
                            <input
                                type="text"
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                placeholder="e.g. Surgeon"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-neutral-700 font-semibold mb-2 text-sm">Experience (Years)</label>
                        <input
                            type="number"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-neutral-700 font-semibold mb-2 text-sm">Consultation Fee (Rs.)</label>
                        <input
                            type="number"
                            value={formData.fee}
                            onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                            className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                            placeholder="e.g. 1000"
                        />
                    </div>

                    <div>
                        <label className="block text-neutral-700 font-semibold mb-2 text-sm">Clinic Address</label>
                        <textarea
                            value={formData.clinicAddress}
                            onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                            className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                            rows="3"
                            placeholder="Full address of your clinic..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
