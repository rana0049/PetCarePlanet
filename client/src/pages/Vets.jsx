import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaStethoscope, FaTimes, FaCalendar, FaClock, FaMapMarkerAlt, FaGraduationCap, FaPaw } from 'react-icons/fa';

const Vets = () => {
    const { user } = useAuth();
    const [vets] = useState([
        { id: 1, name: 'Dr. Ali Khan', clinic: 'Pet Care Clinic, Lahore', experience: 10, specialization: 'Surgeon' },
        { id: 2, name: 'Dr. Sara Ahmed', clinic: 'Happy Pets, Karachi', experience: 5, specialization: 'General Physician' },
        { id: 3, name: 'Dr. Bilal Raza', clinic: 'Vet World, Islamabad', experience: 8, specialization: 'Dermatologist' },
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

    useEffect(() => {
        const fetchPets = async () => {
            if (user && user.role === 'pet_owner') {
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
        if (user.role !== 'pet_owner') {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                        Find Expert Veterinarians
                    </h1>
                    <p className="text-xl text-gray-600">Book appointments with certified professionals</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {vets.map((vet) => (
                        <div
                            key={vet.id}
                            className="bg-white border border-gray-100 p-6 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                                    <FaStethoscope className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{vet.name}</h3>
                                    <p className="text-purple-600 font-medium text-sm">{vet.specialization}</p>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <p className="text-gray-600 flex items-center gap-3 text-sm">
                                    <FaMapMarkerAlt className="text-gray-400 text-lg" />
                                    {vet.clinic}
                                </p>
                                <p className="text-gray-600 flex items-center gap-3 text-sm">
                                    <FaGraduationCap className="text-gray-400 text-lg" />
                                    {vet.experience} Years Experience
                                </p>
                            </div>
                            <button
                                onClick={() => handleBookAppointment(vet)}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Modal */}
            {showBooking && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fadeIn">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-2xl font-display font-bold text-gray-800">Book Appointment</h3>
                                <p className="text-gray-500 text-sm mt-1">Schedule a visit with {selectedVet?.name}</p>
                            </div>
                            <button
                                onClick={() => setShowBooking(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitBooking} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Select Pet</label>
                                    <div className="relative">
                                        <FaPaw className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select
                                            value={booking.petId}
                                            onChange={(e) => setBooking({ ...booking, petId: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all appearance-none"
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
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Date</label>
                                        <div className="relative">
                                            <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="date"
                                                value={booking.date}
                                                onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Time</label>
                                        <div className="relative">
                                            <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <select
                                                value={booking.timeSlot}
                                                onChange={(e) => setBooking({ ...booking, timeSlot: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all appearance-none"
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
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Reason for Visit</label>
                                    <textarea
                                        value={booking.reason}
                                        onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
                                        placeholder="Briefly describe the issue..."
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-4 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
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
