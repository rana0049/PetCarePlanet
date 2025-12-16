import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaPaw, FaSpinner, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import PetCard from '../components/marketplace/PetCard';

const MarketplaceListings = () => {
    const location = useLocation();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        location: '',
        minPrice: '',
        maxPrice: '',
        isVaccinated: false,
        isTrained: false,
        isPedigree: false,
    });

    // Parse URL params on load
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setFilters(prev => ({
            ...prev,
            category: params.get('category') || '',
            location: params.get('location') || '',
            minPrice: params.get('minPrice') || '',
            maxPrice: params.get('maxPrice') || '',
            isVaccinated: params.get('isVaccinated') === 'true',
            isTrained: params.get('isTrained') === 'true',
            isPedigree: params.get('isPedigree') === 'true',
        }));
    }, [location.search]);

    // Fetch listings when filters change
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.category) params.append('category', filters.category);
                if (filters.location) params.append('location', filters.location);
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                if (filters.isVaccinated) params.append('isVaccinated', 'true');
                if (filters.isTrained) params.append('isTrained', 'true');
                if (filters.isPedigree) params.append('isPedigree', 'true');

                // Also include keyword from URL if present (not in local filter state for now)
                const urlParams = new URLSearchParams(location.search);
                const keyword = urlParams.get('keyword');
                if (keyword) params.append('keyword', keyword);

                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/market?${params.toString()}`);

                // Mock "Featured" status for demonstration (randomly assign to ~20% of listings)
                // In production, this would come from the backend
                const enhancedData = data.map((item, index) => ({
                    ...item,
                    isFeatured: index % 5 === 0 // Every 5th item is featured
                }));

                // Sort: Featured first
                const sortedData = enhancedData.sort((a, b) => {
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    return 0;
                });

                setListings(sortedData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce slightly to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchListings();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filters, location.search]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-secondary-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                    {/* Sidebar Filters with Animation */}
                    <AnimatePresence mode='wait'>
                        {showFilters && (
                            <motion.div
                                initial={{ width: 0, opacity: 0, x: -20 }}
                                animate={{ width: '16rem', opacity: 1, x: 0 }}
                                exit={{ width: 0, opacity: 0, x: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex-shrink-0 overflow-hidden"
                            >
                                <div className="w-64">
                                    <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Listings Grid */}
                    <motion.div
                        layout
                        className="flex-1 w-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-secondary-100 sticky top-4 z-30">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all duration-300 ${showFilters ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200' : 'bg-white text-neutral-600 border border-secondary-200 hover:border-primary-300 hover:text-primary-600 shadow-sm'}`}
                                >
                                    <FaFilter className={showFilters ? "" : "text-neutral-400"} />
                                    <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                                    {showFilters ? <FaChevronLeft className="text-xs" /> : <FaChevronRight className="text-xs" />}
                                </button>
                                <div className="h-6 w-px bg-secondary-200"></div>
                                <h1 className="text-lg font-bold text-neutral-900">
                                    {listings.length} Results Found
                                </h1>
                            </div>
                            {/* Sort dropdown could go here */}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <FaSpinner className="animate-spin text-4xl text-primary-600" />
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-card border border-secondary-100">
                                <FaPaw className="text-6xl text-secondary-300 mx-auto mb-4" />
                                <p className="text-xl text-neutral-500 mb-2">No listings match your criteria</p>
                                <button
                                    onClick={() => setFilters({ category: '', location: '', minPrice: '', maxPrice: '', isVaccinated: false, isTrained: false, isPedigree: false })}
                                    className="text-primary-600 font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                layout
                                className={`grid grid-cols-1 md:grid-cols-2 ${showFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}
                            >
                                <AnimatePresence>
                                    {listings.map((listing) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                            key={listing._id}
                                        >
                                            <PetCard listing={listing} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceListings;
