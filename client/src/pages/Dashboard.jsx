import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus, FaTimes, FaPaw, FaCalendar } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const [pets, setPets] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [showAddPet, setShowAddPet] = useState(false);
    const [newPet, setNewPet] = useState({
        name: '',
        type: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };

                if (user.role === 'pet_owner') {
                    const petsRes = await axios.get(`${import.meta.env.VITE_API_URL}/pets`, config);
                    setPets(petsRes.data);
                }

                const apptRes = await axios.get(`${import.meta.env.VITE_API_URL}/appointments`, config);
                setAppointments(apptRes.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (user) fetchData();
    }, [user]);

    const handleAddPet = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/pets`, newPet, config);
            setPets([...pets, data]);
            setShowAddPet(false);
            setNewPet({ name: '', type: 'Dog', breed: '', age: '', gender: 'Male' });
        } catch (error) {
            console.error(error);
            alert('Failed to add pet');
        }
    };

    if (!user) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-gray-800">Please log in.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                        Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-xl text-gray-600">Manage your pets and appointments</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pets Section */}
                    {user.role === 'pet_owner' && (
                        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-purple-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-2">
                                    <FaPaw className="text-purple-500" />
                                    My Pets
                                </h2>
                                <button
                                    onClick={() => setShowAddPet(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                >
                                    <FaPlus /> Add Pet
                                </button>
                            </div>
                            {pets.length === 0 ? (
                                <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                                    <FaPaw className="text-6xl text-purple-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No pets added yet. Add your first pet!</p>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {pets.map((pet) => (
                                        <li key={pet._id} className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 p-5 rounded-2xl flex justify-between items-center hover:shadow-lg transition-all">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-xl">{pet.name}</h3>
                                                <p className="text-gray-600">{pet.type} • {pet.breed}</p>
                                            </div>
                                            <Link
                                                to={`/pets/${pet._id}`}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                            >
                                                View Health →
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Appointments Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-blue-100">
                        <h2 className="text-3xl font-display font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaCalendar className="text-blue-500" />
                            Appointments
                        </h2>
                        {appointments.length === 0 ? (
                            <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                                <FaCalendar className="text-6xl text-blue-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No appointments scheduled.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {appointments.map((appt) => (
                                    <li key={appt._id} className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 p-5 rounded-2xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-gray-800 text-lg">{new Date(appt.date).toLocaleDateString()}</span>
                                            <span className={`px-4 py-1 rounded-full text-sm font-bold ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            {user.role === 'pet_owner' ? `Vet: ${appt.vet?.name || 'Unknown'}` : `Pet: ${appt.pet?.name || 'Unknown'}`}
                                        </p>
                                        <p className="text-gray-500">{appt.timeSlot}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Pet Modal */}
            {showAddPet && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-purple-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Add New Pet</h3>
                            <button onClick={() => setShowAddPet(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddPet} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Pet Name</label>
                                <input
                                    type="text"
                                    value={newPet.name}
                                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-purple-200 text-gray-800 p-3 rounded-xl focus:outline-none focus:border-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Type</label>
                                <select
                                    value={newPet.type}
                                    onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-purple-200 text-gray-800 p-3 rounded-xl focus:outline-none focus:border-purple-500"
                                >
                                    <option>Dog</option>
                                    <option>Cat</option>
                                    <option>Bird</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Breed</label>
                                <input
                                    type="text"
                                    value={newPet.breed}
                                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-purple-200 text-gray-800 p-3 rounded-xl focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Age (years)</label>
                                <input
                                    type="number"
                                    value={newPet.age}
                                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-purple-200 text-gray-800 p-3 rounded-xl focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Gender</label>
                                <select
                                    value={newPet.gender}
                                    onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-purple-200 text-gray-800 p-3 rounded-xl focus:outline-none focus:border-purple-500"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                Add Pet
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
