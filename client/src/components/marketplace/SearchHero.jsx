import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaPlus, FaPaw, FaCheckCircle, FaShieldAlt, FaUserCheck, FaFilter } from 'react-icons/fa';

import PageHero from '../PageHero';

const SearchHero = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [city, setCity] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [category, setCategory] = useState('');
    const [gender, setGender] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (city) params.append('location', city);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (category) params.append('category', category);
        if (gender) params.append('gender', gender);

        navigate(`/market/search?${params.toString()}`);
    };

    return (
        <PageHero
            title={
                <>
                    Find Your New <br />
                    <span className="text-primary-600">Best Friend</span>
                </>
            }
            subtitle="Search through verified listings to find a pet that fits your lifestyle."
            image="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        >
            <div
                className="bg-white p-6 rounded-3xl shadow-2xl border border-secondary-100 mb-6 transition-all duration-300"
            >
                <form onSubmit={handleSearch}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                        <div className="md:col-span-5 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search by breed or keyword..."
                                className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-800 placeholder-neutral-400"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-3 relative">
                            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <select
                                className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none text-neutral-800 cursor-pointer"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            >
                                <option value="">All Cities</option>
                                <option value="Lahore">Lahore</option>
                                <option value="Karachi">Karachi</option>
                                <option value="Islamabad">Islamabad</option>
                                <option value="Rawalpindi">Rawalpindi</option>
                                <option value="Faisalabad">Faisalabad</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="button"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full py-3 bg-secondary-100 hover:bg-secondary-200 text-neutral-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <span>Filters</span>
                                <FaFilter className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full h-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-40 opacity-100 mt-4 pt-4 border-t border-secondary-100' : 'max-h-0 opacity-0'}`}>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1">Category</label>
                            <select
                                className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-neutral-800"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Dog">Dogs</option>
                                <option value="Cat">Cats</option>
                                <option value="Bird">Birds</option>
                                <option value="SmallPet">Small Pets</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1">Min Price</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-neutral-800"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1">Max Price</label>
                            <input
                                type="number"
                                placeholder="Any"
                                className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-neutral-800"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1">Gender</label>
                            <select
                                className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-neutral-800"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Any</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            {/* Trust Signals */}
            <div className="mb-8 flex flex-wrap justify-center gap-4 md:gap-8 text-neutral-600 font-medium text-sm md:text-base">
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm border border-secondary-200 shadow-sm">
                    <FaCheckCircle className="text-primary-500" /> <span>Verified Listings</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm border border-secondary-200 shadow-sm">
                    <FaShieldAlt className="text-primary-500" /> <span>Safe & Secure</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm border border-secondary-200 shadow-sm">
                    <FaUserCheck className="text-primary-500" /> <span>Trusted Sellers</span>
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={() => navigate('/create-listing')}
                    className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <FaPlus />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-lg leading-tight">Sell Your Pet</h3>
                        <p className="text-amber-100 text-xs font-medium">Post a free ad in minutes</p>
                    </div>
                </button>
            </div>
        </PageHero>
    );
};

export default SearchHero;
