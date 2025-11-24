import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PetDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [pet, setPet] = useState(null);
    const [weight, setWeight] = useState('');

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/pets/${id}`, config);
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
            await axios.put(`http://localhost:5000/api/pets/${id}/health`, { weight }, config);
            setWeight('');
            // Refresh data
            const { data } = await axios.get(`http://localhost:5000/api/pets/${id}`, config);
            setPet(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!pet) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{pet.name}</h1>
            <p className="text-gray-600 mb-8">{pet.type} - {pet.breed} - {pet.age} years old</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Weight History */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Weight History</h2>
                    <ul className="mb-4 space-y-2">
                        {pet.weightHistory.map((entry, index) => (
                            <li key={index} className="flex justify-between border-b pb-2">
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                                <span className="font-bold">{entry.weight} kg</span>
                            </li>
                        ))}
                    </ul>
                    <form onSubmit={handleAddWeight} className="flex gap-2">
                        <input
                            type="number"
                            placeholder="New Weight (kg)"
                            className="border p-2 rounded flex-grow"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-teal-700">Add</button>
                    </form>
                </div>

                {/* Vaccinations */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Vaccinations</h2>
                    {pet.vaccinations.length === 0 ? (
                        <p>No vaccination records.</p>
                    ) : (
                        <ul className="space-y-2">
                            {pet.vaccinations.map((vax, index) => (
                                <li key={index} className="border-b pb-2">
                                    <p className="font-bold">{vax.name}</p>
                                    <p className="text-sm text-gray-600">Date: {new Date(vax.date).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PetDetails;
