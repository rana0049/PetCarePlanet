import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';

const Marketplace = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
    }, [keyword, category]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                        Pet Marketplace 🛍️
                    </h1>
                    <p className="text-xl text-gray-600">Find your perfect companion</p>
                </div>

                {/* Search & Filter */}
                <div className="bg-white p-6 rounded-3xl shadow-xl mb-8 border-2 border-purple-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                            <input
                                type="text"
                                placeholder="Search pets..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 text-gray-800"
                            />
                        </div>
                        <div className="relative">
                            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 text-gray-800"
                            >
                                <option value="">All Categories</option>
                                <option value="Dog">Dogs</option>
                                <option value="Cat">Cats</option>
                                <option value="Bird">Birds</option>
                            </select>
                        </div>
                        {user && (
                            <Link
                                to="/create-listing"
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                <FaPlus /> Sell a Pet
                            </Link>
                        )}
                    </div>
                </div>

                {/* Listings Grid */}
                {listings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
                        <p className="text-2xl text-gray-500">No listings found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {listings.map((listing) => (
                            <div
                                key={listing._id}
                                className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-purple-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="h-56 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center text-6xl">
                                    {listing.image ? (
                                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>🐾</span>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-800">{listing.title}</h3>
                                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold">
                                            {listing.category}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
                                            PKR {listing.price.toLocaleString()}
                                        </span>
                                        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                                            View Details
                                        </button>
                                    </div>
                                    {listing.location && (
                                        <p className="text-gray-500 text-sm mt-3">📍 {listing.location}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
