import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPaw, FaMapMarkerAlt, FaTag, FaUser, FaEnvelope, FaArrowLeft, FaChevronLeft, FaChevronRight, FaExpand, FaTimes, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ListingDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Messaging & Contact State
    const [showPhone, setShowPhone] = useState(false);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [messageStatus, setMessageStatus] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessageStatus('Please login to send a message');
            return;
        }
        if (!message.trim()) return;

        setSending(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/messages`, {
                receiverId: listing.seller._id,
                listingId: listing._id,
                content: message
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMessage('');
            setMessageStatus('Message sent successfully!');
            setTimeout(() => setMessageStatus(''), 3000);
        } catch (error) {
            console.error(error);
            setMessageStatus('Failed to send message');
        } finally {
            setSending(false);
        }
    };

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

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    if (loading) return <div className="min-h-screen bg-secondary-50 flex items-center justify-center"><div className="text-xl text-neutral-600 font-semibold animate-pulse">Loading...</div></div>;
    if (!listing) return <div className="min-h-screen bg-secondary-50 flex items-center justify-center">Listing not found.</div>;

    const toggleModal = () => setIsModalOpen(!isModalOpen);

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
                                    className="h-full w-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
                                    onClick={() => setIsModalOpen(true)}
                                />
                            ) : (
                                <FaPaw className="text-6xl text-neutral-700" />
                            )}

                            {/* Overlay Icon to indicate clickability */}
                            <div
                                className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer pointer-events-none"
                            >
                                <FaExpand className="text-white opacity-0 group-hover:opacity-100 text-4xl drop-shadow-lg transition-opacity duration-300" />
                            </div>

                            {/* Navigation Arrows */}
                            {listing.images && listing.images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImageIndex(prev => (prev === 0 ? listing.images.length - 1 : prev - 1));
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110 z-10"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImageIndex(prev => (prev === listing.images.length - 1 ? 0 : prev + 1));
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110 z-10"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </>
                            )}

                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                {listing.images && listing.images.length > 0 ? `${activeImageIndex + 1}/${listing.images.length}` : '1/1'} Photos
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {listing.images && listing.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {listing.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index ? 'border-primary-500 opacity-100 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:border-secondary-300'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Key Info Grid (Mobile Only - usually) but good here too */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-2">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider">City</p>
                                <p className="font-bold text-neutral-800">{listing.location}</p>
                            </div>
                            <div className="p-2 border-l border-secondary-100">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider">Age</p>
                                <p className="font-bold text-neutral-800">{listing.age ? `${listing.age} Yrs` : 'N/A'}</p>
                            </div>
                            <div className="p-2 border-l border-secondary-100">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider">Gender</p>
                                <p className="font-bold text-neutral-800">{listing.gender || 'Unknown'}</p>
                            </div>
                            <div className="p-2 border-l border-secondary-100">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider">Breed</p>
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
                        <div className="bg-white p-6 rounded-xl shadow-card border border-secondary-200 sticky top-24">
                            <h1 className="text-2xl font-bold text-neutral-900 mb-1">{listing.title}</h1>
                            <p className="text-neutral-500 text-sm mb-4">{listing.location}</p>
                            <div className="text-3xl font-bold text-accent-600 mb-6">
                                PKR {listing.price ? listing.price.toLocaleString() : 'N/A'}
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowPhone(!showPhone)}
                                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-center rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                                >
                                    <FaPhone /> {showPhone ? (listing.seller?.phone || 'No phone number') : 'Show Phone Number'}
                                </button>
                                <a
                                    href={`mailto:${listing.seller?.email}?subject=Inquiry about ${listing.title}`}
                                    className="w-full py-3 bg-white border-2 border-secondary-200 hover:border-primary-500 text-neutral-700 hover:text-primary-600 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <FaEnvelope /> Email Seller
                                </a>
                            </div>

                            {/* On-site Messaging */}
                            <div className="mt-6 pt-6 border-t border-secondary-100">
                                <h3 className="font-bold text-neutral-900 mb-3 text-sm uppercase tracking-wide">Send a Message</h3>
                                <form onSubmit={handleSendMessage}>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={user ? "Hi, is this pet still available?" : "Please login to send a message"}
                                        disabled={!user}
                                        className="w-full p-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 min-h-[100px] mb-3 resize-none"
                                    ></textarea>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-xs font-medium ${messageStatus.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                                            {messageStatus}
                                        </span>
                                        <button
                                            type="submit"
                                            disabled={!user || sending || !message.trim()}
                                            className="px-6 py-2 bg-accent-600 hover:bg-accent-700 disabled:bg-secondary-300 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                                        >
                                            <FaPaperPlane /> {sending ? 'Sending...' : 'Send'}
                                        </button>
                                    </div>
                                    {!user && (
                                        <p className="text-xs text-neutral-500 mt-2">
                                            <Link to="/login" className="text-primary-600 font-bold hover:underline">Login</Link> to contact the seller.
                                        </p>
                                    )}
                                </form>
                            </div>

                            {/* Seller Info (Moved inside sticky card for better UX) */}
                            <div className="mt-8 pt-6 border-t border-secondary-100">
                                <h3 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide">Seller Information</h3>
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

            {/* Image Modal with Framer Motion */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white text-5xl z-[110] transition-colors"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <FaTimes />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
                            onClick={e => e.stopPropagation()}
                        >
                            {(listing.images && listing.images.length > 0) || listing.image ? (
                                <img
                                    src={(listing.images && listing.images.length > 0) ? listing.images[activeImageIndex] : listing.image}
                                    alt={listing.title}
                                    className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                                />
                            ) : null}

                            {/* Modal Navigation Arrows */}
                            {listing.images && listing.images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImageIndex(prev => (prev === 0 ? listing.images.length - 1 : prev - 1));
                                        }}
                                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 text-white p-4 rounded-full hover:bg-white/20 transition-all hover:scale-110 backdrop-blur-sm"
                                    >
                                        <FaChevronLeft className="text-3xl" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImageIndex(prev => (prev === listing.images.length - 1 ? 0 : prev + 1));
                                        }}
                                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 text-white p-4 rounded-full hover:bg-white/20 transition-all hover:scale-110 backdrop-blur-sm"
                                    >
                                        <FaChevronRight className="text-3xl" />
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ListingDetails;
