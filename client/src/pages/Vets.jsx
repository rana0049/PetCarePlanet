import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaStethoscope, FaTimes, FaCalendar, FaClock, FaMapMarkerAlt, FaGraduationCap, FaPaw, FaSearch, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import PageHero from '../components/PageHero';

const Vets = () => {
    const { user } = useAuth();
    const [vets] = useState([
        {
            id: 1,
            name: 'Dr. Ali Khan',
            clinic: 'Pet Care Clinic, Lahore',
            experience: 10,
            specialization: 'Surgeon',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
            rating: 4.9,
            reviews: 124,
            fee: 1500,
            availability: 'Available Today',
            patients: '1000+'
        },
        {
            id: 2,
            name: 'Dr. Sara Ahmed',
            clinic: 'Happy Pets, Karachi',
            experience: 5,
            specialization: 'General Physician',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
            rating: 4.8,
            reviews: 89,
            fee: 1200,
            availability: 'Available Tomorrow',
            patients: '500+'
        },
        {
            id: 3,
            name: 'Dr. Bilal Raza',
            clinic: 'Vet World, Islamabad',
            experience: 8,
            specialization: 'Dermatologist',
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
            rating: 4.7,
            reviews: 65,
            fee: 2000,
            availability: 'Available Today',
            patients: '750+'
        },
    ]);

    const [showBooking, setShowBooking] = useState(false);
    const [selectedVet, setSelectedVet] = useState(null);
    const [pets, setPets] = useState([]);
    const [booking, setBooking] = useState({
        petId: '',
        date: '',
        timeSlot: '10:00 AM - 11:00 AM',
        reason: '',
    });
    const [filters, setFilters] = useState({
        location: '',
        specialization: '',
        name: ''
    });

    // Extract unique locations and specializations
    const locations = [...new Set(vets.map(vet => vet.clinic.split(', ')[1] || vet.clinic))];
    const specializations = [...new Set(vets.map(vet => vet.specialization))];

    useEffect(() => {
        const fetchPets = async () => {
            if (user && (user.role === 'pet_owner' || user.role === 'admin')) {
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
        if (user.role !== 'pet_owner' && user.role !== 'admin') {
            alert('Only pet owners can book appointments');
            return;
        }
        setSelectedVet(vet);
        setShowBooking(true);
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/appointments`, {
                vetId: '507f1f77bcf86cd799439011', // Mock vet ID
                petId: booking.petId,
                date: booking.date,
                timeSlot: booking.timeSlot,
                reason: booking.reason,
            }, config);
            alert('Appointment booked successfully!');
            setShowBooking(false);
            setBooking({ petId: '', date: '', timeSlot: '10:00 AM - 11:00 AM', reason: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to book appointment');
        }
    };

    const filteredVets = vets.filter(vet => {
        const matchesLocation = filters.location === '' || vet.clinic.includes(filters.location);
        const matchesSpecialization = filters.specialization === '' || vet.specialization === filters.specialization;
        const matchesName = filters.name === '' || vet.name.toLowerCase().includes(filters.name.toLowerCase());

        return matchesLocation && matchesSpecialization && matchesName;
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

                        {/* Specialization Filter */}
                        <div className="relative">
                            <FaStethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <select
                                value={filters.specialization}
                                onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-800 appearance-none cursor-pointer"
                            >
                                <option value="">All Specializations</option>
                                {specializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
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
                <div className="flex flex-wrap justify-center gap-4 text-neutral-600 font-medium text-sm">
                    <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm border border-secondary-200 shadow-sm">
                        <FaCheckCircle className="text-primary-500" /> <span>Certified Vets</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm border border-secondary-200 shadow-sm">
                        <FaShieldAlt className="text-primary-500" /> <span>Verified Clinics</span>
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
                                            <p className="text-primary-600 font-medium text-sm mb-2">{vet.specialization}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                            <span className="text-yellow-500 text-sm">★</span>
                                            <span className="text-neutral-900 font-bold text-sm">{vet.rating}</span>
                                            <span className="text-neutral-400 text-xs">({vet.reviews})</span>
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
                                    <label className="block text-neutral-700 font-semibold mb-2 text-sm">Select Pet</label>
                                    <div className="relative">
                                        <FaPaw className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <select
                                            value={booking.petId}
                                            onChange={(e) => setBooking({ ...booking, petId: e.target.value })}
                                            className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all appearance-none"
                                            required
                                        >
                                            <option value="">Choose a pet...</option>
                                            {pets.map((pet) => (
                                                <option key={pet._id} value={pet._id}>{pet.name} ({pet.type})</option>
                                            ))}
                                        </select>
                                    </div>
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
