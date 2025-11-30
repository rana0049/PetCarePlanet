import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaUserMd, FaShoppingCart, FaCalendar, FaBlog, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
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
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, navigate]);

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
