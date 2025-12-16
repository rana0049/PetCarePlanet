import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import SearchHero from '../components/marketplace/SearchHero';
import CategoryTiles from '../components/marketplace/CategoryTiles';
import PetCard from '../components/marketplace/PetCard';

const Marketplace = () => {
    const { user } = useAuth();
    const [recentListings, setRecentListings] = useState([]);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                // Fetch featured listings (limit 6)
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/market?isFeatured=true&limit=6`);
                setRecentListings(data.slice(0, 6));
            } catch (error) {
                console.error(error);
            }
        };
        fetchRecent();
    }, []);

    return (
        <div className="min-h-screen bg-secondary-50 pb-20">
            {/* Hero Section */}
            <SearchHero />

            {/* Categories */}
            <CategoryTiles />

            {/* Recent Listings */}
            <div className="container mx-auto px-4 py-12">

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">Featured Recommendations</h2>
                        <p className="text-neutral-600">Check out the latest featured pets looking for a home</p>
                    </div>
                    <Link to="/market/search" className="hidden md:flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors">
                        View All Listings <FaArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {recentListings.map((listing) => (
                        <PetCard key={listing._id} listing={listing} />
                    ))}
                </div>

                <div className="text-center md:hidden">
                    <Link to="/market/search" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors">
                        View All Listings <FaArrowRight />
                    </Link>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 mb-12">
                <div className="bg-primary-900 rounded-3xl p-8 md:p-12 text-center md:text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500 rounded-full blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl font-display font-bold text-white mb-4">Have a pet to sell?</h2>
                            <p className="text-primary-100 text-lg max-w-xl">
                                List your pet on PetCarePlanet and connect with thousands of loving families instantly.
                            </p>
                        </div>
                        {user ? (
                            <Link
                                to="/create-listing"
                                className="px-8 py-4 bg-white text-primary-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-primary-50 transition-all flex items-center gap-2"
                            >
                                <FaPlus /> Sell Your Pet
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-white text-primary-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-primary-50 transition-all"
                            >
                                Login to Sell
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
