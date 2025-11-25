import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaSearch, FaFilter, FaPlus, FaPaw, FaMapMarkerAlt } from 'react-icons/fa';

const Marketplace = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        // Fetch listings logic would go here
    }, [keyword, category]);

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
                        Pet Marketplace
                    </h1>
                    <p className="text-xl text-neutral-600">Find your perfect companion</p>
                </div>

                {/* Search & Filter */}
                <div className="bg-white p-6 rounded-3xl shadow-card mb-8 border border-secondary-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                            <input
                                type="text"
                                placeholder="Search pets..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-neutral-800 transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-neutral-800 transition-all"
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
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                <FaPlus /> Sell a Pet
                            </Link>
                        )}
                    </div>
                </div>

                {/* Listings Grid */}
                {listings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-secondary-200">
                        <p className="text-2xl text-neutral-500">No listings found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {listings.map((listing) => (
                            <div
                                key={listing._id}
                                className="bg-white rounded-3xl shadow-card overflow-hidden border border-secondary-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="h-56 bg-secondary-100 flex items-center justify-center text-6xl">
                                    {listing.image ? (
                                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <FaPaw className="text-secondary-300" />
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-neutral-900">{listing.title}</h3>
                                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-bold">
                                            {listing.category}
                                        </span>
                                    </div>
                                    <p className="text-neutral-600 mb-4 line-clamp-2">{listing.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-accent-600">
                                            PKR {listing.price.toLocaleString()}
                                        </span>
                                        <button className="px-4 py-2 border-2 border-primary-100 text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition-all">
                                            View Details
                                        </button>
                                    </div>
                                    {listing.location && (
                                        <p className="text-neutral-500 text-sm mt-3 flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-neutral-400" /> {listing.location}
                                        </p>
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
