import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPaw, FaMapMarkerAlt, FaTag, FaUser, FaEnvelope, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ListingDetails = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/market/${id}`);
                setListing(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-secondary-50 flex items-center justify-center"><div className="text-xl text-neutral-600 font-semibold animate-pulse">Loading...</div></div>;
    if (!listing) return <div className="min-h-screen bg-secondary-50 flex items-center justify-center">Listing not found.</div>;

    return (
        <div className="min-h-screen bg-secondary-50 pb-12">
            {/* Breadcrumb / Header */}
            <div className="bg-white border-b border-secondary-200 py-4">
                <div className="container mx-auto px-4">
                    <Link to="/market/search" className="text-neutral-500 hover:text-primary-600 flex items-center gap-2 text-sm font-medium">
                        <FaArrowLeft /> Back to Search Results
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Images & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Image (Carousel) */}
                        <div className="bg-black rounded-xl overflow-hidden h-96 flex items-center justify-center relative group">
                            {(listing.images && listing.images.length > 0) || listing.image ? (
                                <img
                                    src={(listing.images && listing.images.length > 0) ? listing.images[activeImageIndex] : listing.image}
                                    alt={listing.title}
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <FaPaw className="text-6xl text-neutral-700" />
                            )}

                            {/* Navigation Arrows */}
                            {listing.images && listing.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImageIndex(prev => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={() => setActiveImageIndex(prev => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </>
                            )}

                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                {listing.images && listing.images.length > 0 ? `${activeImageIndex + 1}/${listing.images.length}` : '1/1'} Photos
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {listing.images && listing.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {listing.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index ? 'border-primary-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Key Info Grid (Mobile Only - usually) but good here too */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-2">
                                <p className="text-xs text-neutral-500 uppercase">City</p>
                                <p className="font-bold text-neutral-800">{listing.location}</p>
                            </div>
                            <div className="p-2 border-l border-secondary-100">
                                <p className="text-xs text-neutral-500 uppercase">Age</p>
                                <p className="font-bold text-neutral-800">{listing.age ? `${listing.age} Yrs` : 'N/A'}</p>
                            </div>
                            <div className="p-2 border-l border-secondary-100">
                                <p className="text-xs text-neutral-500 uppercase">Gender</p>
                                <p className="font-bold text-neutral-800">{listing.gender || 'Unknown'}</p>
                            </div>
                            <div className="p-2 border-l border-secondary-100">
                                <p className="text-xs text-neutral-500 uppercase">Breed</p>
                                <p className="font-bold text-neutral-800 truncate">{listing.breed || 'Mix'}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-secondary-200">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Description</h2>
                            <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                                {listing.description}
                            </p>
                        </div>

                        {/* Features Badges */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-secondary-200">
                            <h2 className="text-xl font-bold text-neutral-900 mb-4">Features</h2>
                            <div className="flex flex-wrap gap-3">
                                {listing.isVaccinated && (
                                    <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100 font-medium flex items-center gap-2">
                                        <FaTag /> Vaccinated
                                    </span>
                                )}
                                {listing.isTrained && (
                                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-medium flex items-center gap-2">
                                        <FaTag /> Trained
                                    </span>
                                )}
                                {listing.isPedigree && (
                                    <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-100 font-medium flex items-center gap-2">
                                        <FaTag /> Pedigree
                                    </span>
                                )}
                                {!listing.isVaccinated && !listing.isTrained && !listing.isPedigree && (
                                    <span className="text-neutral-500 italic">No specific features listed.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Price & Seller */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <div className="bg-white p-6 rounded-xl shadow-card border border-secondary-200">
                            <h1 className="text-2xl font-bold text-neutral-900 mb-1">{listing.title}</h1>
                            <p className="text-neutral-500 text-sm mb-4">{listing.location}</p>
                            <div className="text-3xl font-bold text-accent-600 mb-6">
                                PKR {listing.price ? listing.price.toLocaleString() : 'N/A'}
                            </div>
                            <a
                                href={`mailto:${listing.seller?.email}?subject=Inquiry about ${listing.title}`}
                                className="block w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-center rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <FaEnvelope /> Contact Seller
                            </a>
                        </div>

                        {/* Seller Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200">
                            <h3 className="font-bold text-neutral-900 mb-4 border-b border-secondary-100 pb-2">Seller Information</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-500">
                                    <FaUser />
                                </div>
                                <div>
                                    <p className="font-bold text-neutral-900">{listing.seller?.name || 'Pet Owner'}</p>
                                    <p className="text-xs text-neutral-500">Member since 2024</p>
                                </div>
                            </div>
                        </div>

                        {/* Safety Tips */}
                        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                            <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                                <FaTag /> Safety Tips
                            </h3>
                            <ul className="space-y-2 text-sm text-yellow-800/80 list-disc list-inside">
                                <li>Meet in a safe, public place.</li>
                                <li>Inspect the pet before buying.</li>
                                <li>Check vaccination records.</li>
                                <li>Never pay in advance.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetails;
