import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaWeight, FaSyringe, FaCalendarAlt, FaHistory } from 'react-icons/fa';

const PetDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [pet, setPet] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [weight, setWeight] = useState('');
    const [vaccineName, setVaccineName] = useState('');
    const [vaccineDate, setVaccineDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                // Fetch Pet Details
                const petRes = await axios.get(`${import.meta.env.VITE_API_URL}/pets/${id}`, config);
                setPet(petRes.data);

                // Fetch Appointments
                const apptRes = await axios.get(`${import.meta.env.VITE_API_URL}/appointments`, config);
                // Filter appointments for this pet
                const petAppointments = apptRes.data.filter(appt => appt.pet && appt.pet._id === id);
                setAppointments(petAppointments);
            } catch (error) {
                console.error(error);
            }
        };
        if (user) fetchData();
    }, [id, user]);

    const handleAddWeight = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL}/pets/${id}/health`, { weight }, config);
            setWeight('');
            // Refresh data
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/pets/${id}`, config);
            setPet(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddVaccination = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL}/pets/${id}/health`, {
                vaccination: { name: vaccineName, date: vaccineDate }
            }, config);
            setVaccineName('');
            setVaccineDate('');
            // Refresh data
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/pets/${id}`, config);
            setPet(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!pet) return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
            <div className="text-xl text-neutral-600 font-semibold animate-pulse">Loading pet details...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
                        {pet.name}
                    </h1>
                    <p className="text-xl text-neutral-600">
                        {pet.type} • {pet.breed} • {pet.age} years old
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Weight History */}
                    <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-xl">
                                <FaWeight />
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-900">Weight History</h2>
                        </div>

                        <div className="mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {pet.weightHistory.length === 0 ? (
                                <p className="text-neutral-500 italic">No weight records yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {pet.weightHistory.map((entry, index) => (
                                        <li key={index} className="flex justify-between items-center p-3 bg-secondary-50 rounded-xl border border-secondary-100">
                                            <span className="text-neutral-600 flex items-center gap-2">
                                                <FaCalendarAlt className="text-neutral-400" />
                                                {new Date(entry.date).toLocaleDateString()}
                                            </span>
                                            <span className="font-bold text-primary-700">{entry.weight} kg</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <form onSubmit={handleAddWeight} className="flex gap-3">
                            <input
                                type="number"
                                placeholder="New Weight (kg)"
                                className="flex-grow bg-secondary-50 border border-secondary-200 text-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                            >
                                Add
                            </button>
                        </form>
                    </div>

                    {/* Vaccinations */}
                    <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600 text-xl">
                                <FaSyringe />
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-900">Vaccinations</h2>
                        </div>

                        {pet.vaccinations.length === 0 ? (
                            <div className="text-center py-10 bg-secondary-50 rounded-2xl border border-dashed border-secondary-200 mb-6">
                                <p className="text-neutral-500 italic">No vaccination records.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4 mb-6">
                                {pet.vaccinations.map((vax, index) => (
                                    <li key={index} className="p-4 bg-secondary-50 rounded-xl border border-secondary-100 hover:border-accent-200 transition-colors">
                                        <p className="font-bold text-neutral-900 text-lg mb-1">{vax.name}</p>
                                        <p className="text-sm text-neutral-600 flex items-center gap-2">
                                            <FaHistory className="text-neutral-400" />
                                            Date: {new Date(vax.date).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <form onSubmit={handleAddVaccination} className="grid grid-cols-1 gap-3">
                            <input
                                type="text"
                                placeholder="Vaccine Name"
                                className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
                                value={vaccineName}
                                onChange={(e) => setVaccineName(e.target.value)}
                                required
                            />
                            <div className="flex gap-3">
                                <input
                                    type="date"
                                    className="flex-grow bg-secondary-50 border border-secondary-200 text-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
                                    value={vaccineDate}
                                    onChange={(e) => setVaccineDate(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Appointments Section */}
                <div className="max-w-5xl mx-auto mt-8">
                    <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl">
                                    <FaCalendarAlt />
                                </div>
                                <h2 className="text-2xl font-bold text-neutral-900">Appointments</h2>
                            </div>
                            <Link
                                to="/vets"
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                            >
                                Book Appointment
                            </Link>
                        </div>

                        {appointments.length === 0 ? (
                            <div className="text-center py-10 bg-secondary-50 rounded-2xl border border-dashed border-secondary-200">
                                <p className="text-neutral-500 italic">No appointments scheduled for {pet.name}.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {appointments.map((appt) => (
                                    <div key={appt._id} className="p-5 bg-secondary-50 rounded-2xl border border-secondary-100 flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-neutral-900 text-lg mb-1">
                                                {new Date(appt.date).toLocaleDateString()}
                                            </p>
                                            <p className="text-neutral-600 font-medium mb-1">
                                                Vet: {appt.vet?.name || 'Unknown'}
                                            </p>
                                            <p className="text-sm text-neutral-500">{appt.timeSlot}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            appt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetails;
