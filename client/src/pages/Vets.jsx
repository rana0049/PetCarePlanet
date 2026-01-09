import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaStethoscope, FaTimes, FaCalendar, FaClock, FaMapMarkerAlt, FaGraduationCap, FaPaw, FaSearch, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import PageHero from '../components/PageHero';

const Vets = () => {
    const { user } = useAuth();
    const [vets, setVets] = useState([]);

    useEffect(() => {
        const fetchVets = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users/vets`);
                // Transform data to match UI expected format if needed, or update UI to match data
                // Backend returns: { _id, name, specialization, experience, clinicAddress, ... }
                // UI expects: { id, name, clinic, experience, specialization, ... }

                const formattedVets = data.map(vet => ({
                    id: vet._id,
                    name: vet.name,
                    clinic: vet.clinicAddress || 'No Clinic Address',
                    experience: vet.experience || 0,
                    specialization: vet.specialization || 'General Vet',
                    category: vet.vetCategory || 'Small Animal',
                    image: vet.image || 'https://via.placeholder.com/300',
                    rating: vet.rating || 0, // Default to 0 if no rating
                    reviews: vet.reviews || 0,
                    fee: vet.fee || 1000,
                    availability: 'Available Today',
                    fee: vet.fee || 1000,
                    availability: 'Available Today',
                    patients: '0+',
                    supportedSpecies: vet.supportedSpecies || []
                }));
                setVets(formattedVets);
            } catch (error) {
                console.error('Error fetching vets:', error);
            }
        };
        fetchVets();
    }, []);

    const [showBooking, setShowBooking] = useState(false);
    const [selectedVet, setSelectedVet] = useState(null);
    const [pets, setPets] = useState([]);
    const [booking, setBooking] = useState({
        petId: '',
        date: '',
        timeSlot: '10:00 AM - 11:00 AM',
        reason: '',
        petId: '',
        petName: '',
        petSpecies: '',
        isGuestPet: false,
        date: '',
        timeSlot: '10:00 AM - 11:00 AM',
        reason: '',
    });
    const [filters, setFilters] = useState({
        location: '',
        category: '',
        name: ''
    });

    // Extract unique locations
    const locations = [...new Set(vets.map(vet => vet.clinic.split(', ')[1] || vet.clinic))];

    useEffect(() => {
        const fetchPets = async () => {
            if (user) {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/pets`, config);
                    setPets(data);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchPets();
    }, [user]);

    const handleBookAppointment = (vet) => {
        if (!user) {
            alert('Please login to book an appointment');
            return;
        }
        // Removed Role Check: Allow any registered user to book
        setSelectedVet(vet);
        setShowBooking(true);
    };

    const categoryMap = {
        'Small Animal': ['Dog', 'Cat', 'Rabbit', 'Bird', 'Hamster'],
        'Large Animal': ['Horse', 'Cow', 'Sheep', 'Goat', 'Pig'],
        'Exotic Animal': ['Snake', 'Lizard', 'Turtle', 'Parrot'],
        'Mixed': null, // All types allowed
        'Other': null
    };

    const allowedTypes = selectedVet ? categoryMap[selectedVet.category] : null;

    const compatiblePets = pets.filter(pet => {
        if (!selectedVet) return false;
        if (!allowedTypes) return true; // Mixed/Other allows all
        // Simple case-insensitive check
        return allowedTypes.some(type => pet.type.toLowerCase() === type.toLowerCase());
    });

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                vetId: selectedVet.id,
                date: booking.date,
                timeSlot: booking.timeSlot,
                reason: booking.reason,
            };

            if (booking.isGuestPet) {
                payload.petName = booking.petName;
                payload.petSpecies = booking.petSpecies;
            } else {
                payload.petId = booking.petId;
            }

            await axios.post(`${import.meta.env.VITE_API_URL}/appointments`, payload, config);
            alert('Appointment booked successfully!');
            setShowBooking(false);
            setBooking({
                petId: '',
                petName: '',
                petSpecies: '',
                isGuestPet: false,
                date: '',
                timeSlot: '10:00 AM - 11:00 AM',
                reason: ''
            });
        } catch (error) {
            console.error(error);
            alert('Failed to book appointment');
        }
    };

    const filteredVets = vets.filter(vet => {
        const matchesLocation = filters.location === '' || vet.clinic.includes(filters.location);
        const matchesCategory = filters.category === '' || vet.category === filters.category;
        const matchesName = filters.name === '' || vet.name.toLowerCase().includes(filters.name.toLowerCase());

        return matchesLocation && matchesCategory && matchesName;
    });

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Hero Section */}
            <PageHero
                title={
                    <>
                        Expert Care for Your <br />
                        <span className="text-primary-600">Beloved Pets</span>
                    </>
                }
                subtitle="Connect with top-rated veterinarians for checkups, vaccinations, and emergencies."
                image="https://images.unsplash.com/photo-1623366302587-b38b1ddaefd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            >
                <div
                    className="bg-white p-4 rounded-3xl shadow-2xl border border-secondary-100 max-w-4xl mx-auto mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Location Filter */}
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <select
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-800 appearance-none cursor-pointer"
                            >
                                <option value="">All Locations</option>
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <FaStethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-800 appearance-none cursor-pointer"
                            >
                                <option value="">All Categories</option>
                                <option value="Small Animal">Small Animal</option>
                                <option value="Large Animal">Large Animal</option>
                                <option value="Mixed">Mixed</option>
                                <option value="Exotic Animal">Exotic Animal</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Name Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search by doctor name..."
                                className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-800 placeholder-neutral-400"
                                value={filters.name}
                                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap justify-center items-start gap-8 md:gap-12 text-neutral-600 mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-primary-500" />
                            <span className="font-extrabold tracking-widest uppercase text-xs text-primary-700">Certified Vets</span>
                        </div>
                        <span className="w-8 h-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full"></span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <FaShieldAlt className="text-primary-500" />
                            <span className="font-extrabold tracking-widest uppercase text-xs text-primary-700">Verified Clinics</span>
                        </div>
                        <span className="w-8 h-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full"></span>
                    </div>
                </div>
            </PageHero>

            {/* Vets Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredVets.map((vet) => (
                        <div
                            key={vet.id}
                            className="bg-white border border-secondary-100 p-6 rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                        >
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-primary-100 group-hover:border-primary-300 transition-colors relative">
                                    <img
                                        src={vet.image}
                                        alt={vet.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white text-[10px] py-1 text-center font-medium">
                                        {vet.experience} Years Exp.
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-neutral-900 leading-tight mb-1">{vet.name}</h3>
                                            <p className="text-primary-600 font-medium text-sm mb-2">{vet.category} • {vet.specialization}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                            <span className="text-yellow-500 text-sm">★</span>
                                            <span className="text-neutral-900 font-bold text-sm">
                                                {vet.rating > 0 ? vet.rating : 'New'}
                                            </span>
                                            <span className="text-neutral-400 text-xs">
                                                ({vet.reviews} reviews)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                                        <FaMapMarkerAlt className="text-neutral-400" />
                                        <span className="line-clamp-1">{vet.clinic}</span>
                                    </div>

                                    <div className="flex items-center gap-3 mt-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${vet.availability === 'Available Today' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                            {vet.availability}
                                        </span>
                                        <span className="text-xs font-medium text-neutral-500 bg-secondary-50 px-2 py-1 rounded-full">
                                            {vet.patients} Patients
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-secondary-100 pt-4 mt-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-neutral-500 text-sm">Consultation Fee</span>
                                    <span className="text-primary-700 font-bold text-lg">Rs. {vet.fee}</span>
                                </div>
                                <button
                                    onClick={() => handleBookAppointment(vet)}
                                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <FaCalendar className="text-sm" />
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredVets.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-500 text-lg">No veterinarians found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {showBooking && (
                <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fadeIn border border-secondary-100">
                        <div className="flex justify-between items-center mb-8 border-b border-secondary-100 pb-4">
                            <div>
                                <h3 className="text-2xl font-display font-bold text-neutral-900">Book Appointment</h3>
                                <p className="text-neutral-500 text-sm mt-1">Schedule a visit with {selectedVet?.name}</p>
                            </div>
                            <button
                                onClick={() => setShowBooking(false)}
                                className="p-2 hover:bg-secondary-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitBooking} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-neutral-700 font-semibold mb-2 text-sm">I am booking for:</label>
                                    <div className="flex gap-4 mb-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="bookingType"
                                                checked={!booking.isGuestPet}
                                                onChange={() => setBooking({ ...booking, isGuestPet: false })}
                                                className="text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-neutral-700">My Registered Pet</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="bookingType"
                                                checked={booking.isGuestPet}
                                                onChange={() => setBooking({ ...booking, isGuestPet: true })}
                                                className="text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-neutral-700">Someone Else / New Pet</span>
                                        </label>
                                    </div>

                                    {!booking.isGuestPet ? (
                                        <>
                                            <label className="block text-neutral-700 font-semibold mb-2 text-sm">Select Pet</label>
                                            <div className="relative">
                                                <FaPaw className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                                <select
                                                    value={booking.petId}
                                                    onChange={(e) => setBooking({ ...booking, petId: e.target.value })}
                                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all appearance-none"
                                                    required={!booking.isGuestPet}
                                                >
                                                    <option value="">Choose a pet...</option>
                                                    {compatiblePets.map((pet) => (
                                                        <option key={pet._id} value={pet._id}>{pet.name} ({pet.type})</option>
                                                    ))}
                                                    {compatiblePets.length === 0 && (
                                                        <option disabled>No {selectedVet?.category || ''} pets found. Please add a pet.</option>
                                                    )}
                                                </select>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-neutral-700 font-semibold mb-2 text-sm">Pet Name</label>
                                                <input
                                                    type="text"
                                                    value={booking.petName}
                                                    onChange={(e) => setBooking({ ...booking, petName: e.target.value })}
                                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                                    placeholder="e.g., Fluffy"
                                                    required={booking.isGuestPet}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-neutral-700 font-semibold mb-2 text-sm">Pet Species</label>
                                                <div className="relative">
                                                    <FaPaw className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                                    <select
                                                        value={booking.petSpecies}
                                                        onChange={(e) => setBooking({ ...booking, petSpecies: e.target.value })}
                                                        className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all appearance-none"
                                                        required={booking.isGuestPet}
                                                    >
                                                        <option value="">Select Species...</option>
                                                        {selectedVet?.supportedSpecies?.length > 0 ? (
                                                            selectedVet.supportedSpecies.map((species) => (
                                                                <option key={species} value={species}>{species}</option>
                                                            ))
                                                        ) : (
                                                            // Fallback to category map if no specific species listed
                                                            (categoryMap[selectedVet?.category] || ['Dog', 'Cat', 'Bird', 'Other']).map((type) => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))
                                                        )}
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-neutral-700 font-semibold mb-2 text-sm">Date</label>
                                        <div className="relative">
                                            <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                            <input
                                                type="date"
                                                value={booking.date}
                                                onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-neutral-700 font-semibold mb-2 text-sm">Time</label>
                                        <div className="relative">
                                            <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                            <select
                                                value={booking.timeSlot}
                                                onChange={(e) => setBooking({ ...booking, timeSlot: e.target.value })}
                                                className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all appearance-none"
                                            >
                                                <option>10:00 AM - 11:00 AM</option>
                                                <option>11:00 AM - 12:00 PM</option>
                                                <option>02:00 PM - 03:00 PM</option>
                                                <option>03:00 PM - 04:00 PM</option>
                                                <option>04:00 PM - 05:00 PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-neutral-700 font-semibold mb-2 text-sm">Reason for Visit</label>
                                    <textarea
                                        value={booking.reason}
                                        onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
                                        placeholder="Briefly describe the issue..."
                                        className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-4 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vets;
