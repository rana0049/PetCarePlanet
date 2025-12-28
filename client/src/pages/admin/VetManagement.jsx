import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserMd, FaCheck, FaTimes, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const VetManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vets, setVets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        fetchVets();
    }, [user, navigate]);

    const fetchVets = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/vets`, config);
            setVets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (vetId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/vets/${vetId}/approve`, {}, config);
            fetchVets();
        } catch (error) {
            console.error(error);
            alert('Failed to approve vet');
        }
    };

    const handleReject = async (vetId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/vets/${vetId}/reject`, {}, config);
            fetchVets();
        } catch (error) {
            console.error(error);
            alert('Failed to reject vet');
        }
    };

    const filteredVets = vets.filter(vet => {
        if (filter === 'pending') return !vet.isApproved;
        if (filter === 'approved') return vet.isApproved;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="text-xl text-neutral-600 font-semibold animate-pulse">Loading vets...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-neutral-900 mb-2">
                        Vet Management
                    </h1>
                    <p className="text-lg text-neutral-600">Approve or reject veterinarian applications</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'all'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white text-neutral-700 border border-secondary-200 hover:bg-secondary-50'
                            }`}
                    >
                        All ({vets.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'pending'
                            ? 'bg-accent-600 text-white shadow-lg'
                            : 'bg-white text-neutral-700 border border-secondary-200 hover:bg-secondary-50'
                            }`}
                    >
                        Pending ({vets.filter(v => !v.isApproved).length})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'approved'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-white text-neutral-700 border border-secondary-200 hover:bg-secondary-50'
                            }`}
                    >
                        Approved ({vets.filter(v => v.isApproved).length})
                    </button>
                </div>

                {/* Vets List */}
                {filteredVets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-secondary-200">
                        <p className="text-2xl text-neutral-500">No vets found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVets.map((vet) => (
                            <div
                                key={vet._id}
                                className="bg-white p-6 rounded-3xl shadow-card border border-secondary-100 hover:shadow-card-hover transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-xl">
                                            <FaUserMd />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-neutral-900">{vet.name}</h3>
                                            <p className="text-sm text-primary-600 font-medium">{vet.specialization}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${vet.isApproved
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                    >
                                        {vet.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4 text-sm text-neutral-600">
                                    <p className="flex items-center gap-2">
                                        <FaGraduationCap className="text-neutral-400" />
                                        {vet.experience} years experience
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-neutral-400" />
                                        {vet.clinicAddress || 'No address provided'}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaEnvelope className="text-neutral-400" />
                                        {vet.email}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaPhone className="text-neutral-400" />
                                        {vet.phone || 'No phone provided'}
                                    </p>
                                </div>

                                {!vet.isApproved ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(vet._id)}
                                            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                        >
                                            <FaCheck /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(vet._id)}
                                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                        >
                                            <FaTimes /> Reject
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleReject(vet._id)}
                                        className="w-full py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all"
                                    >
                                        Revoke Approval
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VetManagement;
