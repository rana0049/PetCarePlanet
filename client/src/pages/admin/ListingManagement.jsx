import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaCheck, FaTimes, FaPaw, FaMapMarkerAlt, FaTag } from 'react-icons/fa';

const ListingManagement = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/market/admin/all`, config);
            setListings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL}/market/${id}/status`, { status }, config);
            fetchListings(); // Refresh list
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="text-xl text-neutral-600 font-semibold animate-pulse">Loading listings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-neutral-900 mb-2">
                        Manage Listings
                    </h1>
                    <p className="text-lg text-neutral-600">Approve or reject pet listings</p>
                </div>

                <div className="bg-white rounded-3xl shadow-card border border-secondary-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary-50 border-b border-secondary-100">
                                    <th className="p-6 font-bold text-neutral-700">Pet</th>
                                    <th className="p-6 font-bold text-neutral-700">Seller</th>
                                    <th className="p-6 font-bold text-neutral-700">Price</th>
                                    <th className="p-6 font-bold text-neutral-700">Status</th>
                                    <th className="p-6 font-bold text-neutral-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map((listing) => (
                                    <tr key={listing._id} className="border-b border-secondary-100 hover:bg-secondary-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={listing.image}
                                                    alt={listing.title}
                                                    className="w-16 h-16 rounded-xl object-cover shadow-sm"
                                                />
                                                <div>
                                                    <h3 className="font-bold text-neutral-900">{listing.title}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                                                        <FaTag className="text-primary-400" /> {listing.category}
                                                        <span className="mx-1">•</span>
                                                        <FaMapMarkerAlt className="text-primary-400" /> {listing.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="font-semibold text-neutral-900">{listing.seller?.name}</div>
                                            <div className="text-sm text-neutral-500">{listing.seller?.email}</div>
                                        </td>
                                        <td className="p-6 font-bold text-primary-600">
                                            PKR {listing.price.toLocaleString()}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${listing.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    listing.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        listing.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            {listing.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => updateStatus(listing._id, 'approved')}
                                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(listing._id, 'rejected')}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {listings.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-neutral-500">
                                            No listings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingManagement;
