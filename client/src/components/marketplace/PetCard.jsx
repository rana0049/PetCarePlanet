import { Link } from 'react-router-dom';
import { FaPaw, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const PetCard = ({ listing }) => {
    return (
        <Link
            to={`/market/${listing._id}`}
            className="bg-white rounded-3xl shadow-card overflow-hidden border border-secondary-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 block group h-full flex flex-col"
        >
            <div className="h-52 bg-secondary-100 relative overflow-hidden">
                {(listing.images && listing.images.length > 0) || listing.image ? (
                    <img
                        src={(listing.images && listing.images.length > 0) ? listing.images[0] : listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FaPaw className="text-6xl text-secondary-300" />
                    </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 rounded-full text-xs font-bold shadow-sm">
                        {listing.category}
                    </span>
                    {listing.isVaccinated && (
                        <span className="px-3 py-1 bg-green-100/90 backdrop-blur-sm text-green-700 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                            <FaCheckCircle className="text-xs" /> Vaccinated
                        </span>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                    <div className="flex items-center gap-1 text-white text-sm font-medium">
                        <FaMapMarkerAlt className="text-accent-400" />
                        <span className="truncate">{listing.location}</span>
                    </div>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {listing.title}
                    </h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                    <span>{listing.breed || 'Unknown Breed'}</span>
                    <span>•</span>
                    <span>{listing.age ? `${listing.age} Yrs` : 'Age N/A'}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-secondary-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Price</p>
                        <span className="text-xl font-bold text-accent-600">
                            PKR {listing.price ? listing.price.toLocaleString() : 'N/A'}
                        </span>
                    </div>
                    <span className="text-sm font-bold text-primary-600 group-hover:translate-x-1 transition-transform">
                        View Details →
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default PetCard;
