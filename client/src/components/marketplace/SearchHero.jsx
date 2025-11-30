import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaPlus, FaPaw, FaCheckCircle, FaShieldAlt, FaUserCheck } from 'react-icons/fa';

const SearchHero = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [city, setCity] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (city) params.append('location', city);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);

        navigate(`/market/search?${params.toString()}`);
    };

    return (
        <div className="relative min-h-[60vh] flex items-center overflow-hidden bg-secondary-50">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Happy pets"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-50/95 via-secondary-50/80 to-secondary-50/30"></div>
            </div>

            <div className="relative container mx-auto px-4 z-10 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-neutral-900 mb-4 leading-tight">
                        Find Your New <br />
                        <span className="text-primary-600">Best Friend</span>
                    </h1>
                    <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Search through verified listings to find a pet that fits your lifestyle.
                    </p>

                    <div className="bg-white p-5 rounded-3xl shadow-2xl border border-secondary-100 mb-6">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
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
                                    className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none text-neutral-800"
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

                            <div className="md:col-span-2 relative">
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-800 placeholder-neutral-400"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full h-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                >
                                    Search
                                </button>
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
                </div>
            </div>
        </div>
    );
};

export default SearchHero;
