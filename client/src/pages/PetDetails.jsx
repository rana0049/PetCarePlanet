import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaWeight, FaSyringe, FaCalendarAlt, FaHistory } from 'react-icons/fa';

const PetDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [pet, setPet] = useState(null);
    const [weight, setWeight] = useState('');

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/pets/${id}`, config);
                setPet(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (user) fetchPet();
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
                            <div className="text-center py-10 bg-secondary-50 rounded-2xl border border-dashed border-secondary-200">
                                <p className="text-neutral-500 italic">No vaccination records.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetails;
