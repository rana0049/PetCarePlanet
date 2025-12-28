import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaCheck, FaTimes, FaPaw, FaMapMarkerAlt, FaTag, FaTrash, FaStar, FaBolt } from 'react-icons/fa';

const ListingManagement = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promotingId, setPromotingId] = useState(null);

    useEffect(() => {
        if (user) {
            fetchListings();
        }
    }, [user]);

    const fetchListings = async () => {
        if (!user) return;
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL}/market/${id}`, config);
                setListings(listings.filter(listing => listing._id !== id));
            } catch (error) {
                console.error(error);
                alert('Failed to delete listing');
            }
        }
    };

    const handlePromote = async (e, id, duration) => {
        e.preventDefault();
        e.stopPropagation();

        console.log(`DEBUG: handlePromote called for ${id} with duration ${duration}`);
        // Auto-confirm as requested by user
        // if (!window.confirm(...)) return;

        setPromotingId(id);
        try {
            console.log('DEBUG: Sending request...');
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/market/${id}/feature`, { duration }, config);
            console.log('DEBUG: Request success:', res.data);

            if (duration === 'remove') {
                alert('Success: Promotion removed!');
            } else {
                alert(`Success: Promoted (${duration})!`);
            }
            await fetchListings();
        } catch (error) {
            console.error('DEBUG: Promotion error:', error);
            console.error('DEBUG: Error response:', error.response);
            alert('Error: Failed to update promotion status. Check console for details.');
        } finally {
            setPromotingId(null);
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
                                                    src={(listing.images && listing.images.length > 0) ? listing.images[0] : (listing.image || 'https://via.placeholder.com/150')}
                                                    alt={listing.title}
                                                    className="w-16 h-16 rounded-xl object-cover shadow-sm"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }}
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
                                            PKR {(listing.price || 0).toLocaleString()}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${listing.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                listing.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    listing.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {listing.status ? listing.status.charAt(0).toUpperCase() + listing.status.slice(1) : 'Unknown'}
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
                                            <button
                                                onClick={() => handleDelete(listing._id)}
                                                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors ml-2"
                                                title="Delete Listing"
                                            >
                                                <FaTrash />
                                            </button>
                                            <div className="flex gap-1 ml-2">
                                                <button
                                                    onClick={(e) => handlePromote(e, listing._id, 'weekly')}
                                                    disabled={promotingId === listing._id}
                                                    className={`p-2 rounded-lg transition-colors ${listing.isFeatured ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600'} ${promotingId === listing._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    title="Promote Weekly"
                                                >
                                                    <FaBolt className={promotingId === listing._id ? 'animate-pulse' : ''} />
                                                </button>
                                                {listing.isFeatured && (
                                                    <button
                                                        onClick={(e) => handlePromote(e, listing._id, 'remove')}
                                                        disabled={promotingId === listing._id}
                                                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Remove Promotion"
                                                    >
                                                        <FaTimes className={promotingId === listing._id ? 'animate-pulse' : ''} />
                                                    </button>
                                                )}
                                            </div>
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
