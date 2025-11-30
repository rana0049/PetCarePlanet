import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaPaw, FaSpinner } from 'react-icons/fa';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import PetCard from '../components/marketplace/PetCard';

const MarketplaceListings = () => {
    const location = useLocation();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
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
                setListings(data);
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
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-1/4">
                        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
                    </div>

                    {/* Listings Grid */}
                    <div className="w-full lg:w-3/4">
                        <div className="mb-6 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-neutral-900">
                                {listings.length} Results Found
                            </h1>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((listing) => (
                                    <PetCard key={listing._id} listing={listing} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceListings;
