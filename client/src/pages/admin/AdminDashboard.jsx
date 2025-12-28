import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaUserMd, FaShoppingCart, FaCalendar, FaBlog, FaChartLine, FaMoneyBillWave, FaCheck, FaTimes } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }



        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, config);
                setStats(data);

                const { data: payments } = await axios.get(`${import.meta.env.VITE_API_URL}/payments/pending`, config);
                setTransactions(payments);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, navigate]);

    const handleTransaction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this payment?`)) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL}/payments/action/${id}/${action}`, {}, config);
            setTransactions(prev => prev.filter(t => t._id !== id));
            alert(`Payment ${action}d successfully!`);
        } catch (error) {
            console.error(error);
            alert(`Failed to ${action} payment.`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="text-xl text-neutral-600 font-semibold animate-pulse">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-neutral-900 mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-lg text-neutral-600">Manage your platform</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {/* Users Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-card border border-secondary-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <FaUsers className="text-primary-600 text-xl" />
                                </div>
                                <span className="text-3xl font-bold text-primary-600">{stats.users.total}</span>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-2">Total Users</h3>
                            <div className="space-y-1 text-sm text-neutral-600">
                                <p>Pet Owners: {stats.users.petOwners}</p>
                                <p>Vets: {stats.users.vets}</p>
                                <p>Admins: {stats.users.admins}</p>
                            </div>
                        </div>

                        {/* Vets Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-card border border-secondary-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                                    <FaUserMd className="text-accent-600 text-xl" />
                                </div>
                                <span className="text-3xl font-bold text-accent-600">{stats.users.pendingVets}</span>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-2">Pending Vets</h3>
                            <Link
                                to="/admin/vets"
                                className="inline-block mt-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold text-sm transition-all"
                            >
                                Manage Vets →
                            </Link>
                        </div>

                        {/* Listings Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-card border border-secondary-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <FaShoppingCart className="text-primary-600 text-xl" />
                                </div>
                                <span className="text-3xl font-bold text-primary-600">{stats.listings.total}</span>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-2">Listings</h3>
                            <div className="space-y-1 text-sm text-neutral-600 mb-3">
                                <p>Active: {stats.listings.active}</p>
                                <p>Pending: {stats.listings.pending}</p>
                            </div>
                            <Link
                                to="/admin/listings"
                                className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold text-sm transition-all"
                            >
                                Manage Listings →
                            </Link>
                        </div>

                        {/* Appointments Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-card border border-secondary-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <FaCalendar className="text-primary-600 text-xl" />
                                </div>
                                <span className="text-3xl font-bold text-primary-600">{stats.appointments}</span>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900">Total Appointments</h3>
                        </div>

                        {/* Blogs Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-card border border-secondary-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                                    <FaBlog className="text-accent-600 text-xl" />
                                </div>
                                <span className="text-3xl font-bold text-accent-600">{stats.blogs}</span>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-2">Blog Posts</h3>
                            <Link
                                to="/admin/blogs"
                                className="inline-block mt-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold text-sm transition-all"
                            >
                                Manage Blogs →
                            </Link>
                        </div>
                    </div>
                )}

                {/* Payment Requests Section */}
                {transactions.length > 0 && (
                    <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100 mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <FaMoneyBillWave className="text-green-600 text-xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900">Pending Payments</h2>
                                <p className="text-neutral-600">Review manual payment submissions</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-secondary-100 text-neutral-500 text-sm uppercase">
                                        <th className="py-4 px-2">User</th>
                                        <th className="py-4 px-2">Details</th>
                                        <th className="py-4 px-2">Method</th>
                                        <th className="py-4 px-2">Reference (TID)</th>
                                        <th className="py-4 px-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t._id} className="border-b border-secondary-50 hover:bg-secondary-50 transition-colors">
                                            <td className="py-4 px-2">
                                                <p className="font-bold text-neutral-900">{t.user?.name || 'Unknown'}</p>
                                                <p className="text-xs text-neutral-500">{t.user?.email}</p>
                                            </td>
                                            <td className="py-4 px-2">
                                                <p className="font-bold text-neutral-800">{t.type === 'feature_listing' ? 'Featured Listing' : 'Vet Subscription'}</p>
                                                <p className="text-xs text-neutral-500">Rs. {t.amount}</p>
                                                {t.relatedListing && <p className="text-xs text-blue-500 truncate w-32">{t.relatedListing.title}</p>}
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${t.paymentMethod === 'jazzcash' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {t.paymentMethod.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 font-mono text-neutral-700">{t.transactionReference}</td>
                                            <td className="py-4 px-2">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleTransaction(t._id, 'approve')}
                                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Approve"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => handleTransaction(t._id, 'reject')}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Reject"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/admin/vets"
                            className="flex items-center gap-4 p-4 bg-secondary-50 hover:bg-primary-50 rounded-2xl border border-secondary-200 hover:border-primary-300 transition-all"
                        >
                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                <FaUserMd className="text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900">Manage Vets</h3>
                                <p className="text-sm text-neutral-600">Approve or reject veterinarians</p>
                            </div>
                        </Link>

                        <Link
                            to="/admin/listings"
                            className="flex items-center gap-4 p-4 bg-secondary-50 hover:bg-primary-50 rounded-2xl border border-secondary-200 hover:border-primary-300 transition-all"
                        >
                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                <FaShoppingCart className="text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900">Manage Listings</h3>
                                <p className="text-sm text-neutral-600">Review pending pet listings</p>
                            </div>
                        </Link>

                        <Link
                            to="/admin/blogs"
                            className="flex items-center gap-4 p-4 bg-secondary-50 hover:bg-accent-50 rounded-2xl border border-secondary-200 hover:border-accent-300 transition-all"
                        >
                            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                                <FaBlog className="text-accent-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900">Manage Blogs</h3>
                                <p className="text-sm text-neutral-600">Create and edit blog posts</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
