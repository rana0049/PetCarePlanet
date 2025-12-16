import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus, FaTimes, FaPaw, FaCalendar, FaTag } from 'react-icons/fa';
import MessagesSection from '../components/dashboard/MessagesSection';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard = () => {
    const { user } = useAuth();
    const [pets, setPets] = useState([]);
    const [listings, setListings] = useState([]);
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

                if (user.role === 'pet_owner' || user.role === 'admin') {
                    const petsRes = await axios.get(`${import.meta.env.VITE_API_URL}/pets`, config);
                    setPets(petsRes.data);
                }

                // Fetch Listings
                const listingsRes = await axios.get(`${import.meta.env.VITE_API_URL}/market/mylistings`, config);
                setListings(listingsRes.data);

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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // Note: The Dashboard currently sets 'Pets' from /pets endpoint which might be mapped to listings?
                // The task is about "Listing Management". The 'pets' state in Dashboard seems to come from `/pets` endpoint.
                // But the edit route points to `/edit-listing/:id` which updates `/market/:id`.
                // If `/pets` returns listings, then deleting should exist on `/market/:id`.
                // Let's assume the user wants to delete the *listing*. 
                // However, /pets endpoint usually implies "My Pets" (health records) vs "My Listings" (Marketplace).
                // If this dashboard shows listings, we should use /market API. 
                // Looking at Dashboard.jsx, it calls `/pets`. 
                // Let's check if `/pets` and `/market` share the same collection or if they are different.
                // Assuming "My Pets" on dashboard are the listings. 
                // I will use the /api/market endpoint for deletion as per my backend plan.

                await axios.delete(`${import.meta.env.VITE_API_URL}/market/${id}`, config);
                setListings(listings.filter(listing => listing._id !== id));
            } catch (error) {
                console.error(error);
                alert('Failed to delete listing');
            }
        }
    };

    if (!user) return <div className="min-h-screen bg-secondary-50 flex items-center justify-center text-neutral-800">Please log in.</div>;

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-neutral-900 mb-2">
                        Welcome back, <span className="text-primary-600">{user.name}</span>!
                    </h1>
                    <p className="text-lg text-neutral-600">Manage your pets and appointments</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pets Section */}
                    {/* Pets Section */}
                    {(user.role === 'pet_owner' || user.role === 'admin') && (
                        <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-display font-bold text-neutral-900 flex items-center gap-2">
                                    <FaPaw className="text-primary-500" />
                                    My Pets
                                </h2>
                                <button
                                    onClick={() => setShowAddPet(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                >
                                    <FaPlus /> Add Pet
                                </button>
                            </div>
                            {pets.length === 0 ? (
                                <div className="text-center py-12 bg-secondary-50 rounded-2xl border border-secondary-200">
                                    <FaPaw className="text-6xl text-secondary-300 mx-auto mb-4" />
                                    <p className="text-neutral-500 text-lg">No pets added yet. Add your first pet!</p>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {pets.map((pet) => (
                                        <li key={pet._id} className="bg-secondary-50 border border-secondary-200 p-5 rounded-2xl flex justify-between items-center hover:shadow-md transition-all">
                                            <div>
                                                <h3 className="font-bold text-neutral-900 text-xl">{pet.name}</h3>
                                                <p className="text-neutral-600">{pet.type} • {pet.breed}</p>
                                            </div>
                                            <Link
                                                to={`/pets/${pet._id}`}
                                                className="px-4 py-2 bg-white border border-secondary-200 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all"
                                            >
                                                View Health →
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Listings Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-display font-bold text-neutral-900 flex items-center gap-2">
                                <FaTag className="text-accent-500" />
                                My Listings
                            </h2>
                            <Link
                                to="/create-listing"
                                className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            >
                                <FaPlus /> sell Pet
                            </Link>
                        </div>
                        {listings.length === 0 ? (
                            <div className="text-center py-12 bg-secondary-50 rounded-2xl border border-secondary-200">
                                <FaTag className="text-6xl text-secondary-300 mx-auto mb-4" />
                                <p className="text-neutral-500 text-lg">No listings yet. Sell a pet!</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {listings.map((listing) => (
                                    <li key={listing._id} className="bg-secondary-50 border border-secondary-200 p-5 rounded-2xl flex justify-between items-center hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white">
                                                {listing.images && listing.images.length > 0 ? (
                                                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-secondary-200 flex items-center justify-center text-secondary-400"><FaTag /></div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-neutral-900 text-lg">{listing.title}</h3>
                                                <p className="text-primary-600 font-bold">Rs. {listing.price.toLocaleString()}</p>
                                                <p className="text-xs uppercase font-bold tracking-wider text-neutral-500">{listing.status}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/edit-listing/${listing._id}`}
                                                className="px-3 py-2 bg-white border border-secondary-200 text-primary-600 rounded-lg text-sm font-bold hover:bg-primary-50 transition-all"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(listing._id)}
                                                className="px-3 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Appointments Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-card border border-secondary-100">
                        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6 flex items-center gap-2">
                            <FaCalendar className="text-accent-500" />
                            Appointments
                        </h2>
                        {appointments.length === 0 ? (
                            <div className="text-center py-12 bg-secondary-50 rounded-2xl border border-secondary-200">
                                <FaCalendar className="text-6xl text-secondary-300 mx-auto mb-4" />
                                <p className="text-neutral-500 text-lg">No appointments scheduled.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {appointments.map((appt) => (
                                    <li key={appt._id} className="bg-secondary-50 border border-secondary-200 p-5 rounded-2xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-neutral-900 text-lg">{new Date(appt.date).toLocaleDateString()}</span>
                                            <span className={`px-4 py-1 rounded-full text-sm font-bold ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                        <p className="text-neutral-700 font-medium">
                                            {user.role === 'pet_owner' ? `Vet: ${appt.vet?.name || 'Unknown'}` : `Pet: ${appt.pet?.name || 'Unknown'}`}
                                        </p>
                                        <p className="text-neutral-500">{appt.timeSlot}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Messages Section */}
                <ErrorBoundary>
                    <MessagesSection />
                </ErrorBoundary>
            </div>

            {/* Add Pet Modal */}
            {showAddPet && (
                <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-secondary-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-display font-bold text-neutral-900">Add New Pet</h3>
                            <button onClick={() => setShowAddPet(false)} className="text-neutral-400 hover:text-neutral-600">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddPet} className="space-y-4">
                            <div>
                                <label className="block text-neutral-700 font-semibold mb-2 text-sm">Pet Name</label>
                                <input
                                    type="text"
                                    value={newPet.name}
                                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-neutral-700 font-semibold mb-2 text-sm">Type</label>
                                <select
                                    value={newPet.type}
                                    onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                >
                                    <option>Dog</option>
                                    <option>Cat</option>
                                    <option>Bird</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-neutral-700 font-semibold mb-2 text-sm">Breed</label>
                                <input
                                    type="text"
                                    value={newPet.breed}
                                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-neutral-700 font-semibold mb-2 text-sm">Age (years)</label>
                                <input
                                    type="number"
                                    value={newPet.age}
                                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-neutral-700 font-semibold mb-2 text-sm">Gender</label>
                                <select
                                    value={newPet.gender}
                                    onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
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
