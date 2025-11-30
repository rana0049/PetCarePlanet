import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUpload, FaImage, FaPaw, FaTag, FaMapMarkerAlt, FaInfoCircle, FaDollarSign, FaTimes } from 'react-icons/fa';

const CreateListing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Dog',
        breed: '',
        age: '',
        gender: 'Unknown',
        isVaccinated: false,
        isTrained: false,
        isPedigree: false,
        images: [],
        location: '',
    });
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        setError(''); // Clear error on change
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Check if adding these files exceeds the limit
        if (formData.images.length + files.length > 5) {
            setError('You can only upload a maximum of 5 images');
            return;
        }

        const newImages = [];
        for (const file of files) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setError(`Image ${file.name} is too large (max 5MB)`);
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise((resolve) => {
                reader.onloadend = () => {
                    newImages.push(reader.result);
                    resolve();
                };
            });
        }

        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/market`, formData, config);
            navigate('/market');
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to create listing. Please check your inputs.');
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
                            List Your Pet
                        </h1>
                        <p className="text-xl text-neutral-600">Find a loving new home for your pet</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 animate-fade-in">
                            <FaInfoCircle />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-card border border-secondary-100">
                        {/* Image Upload */}
                        <div className="mb-8">
                            <label className="block text-neutral-700 font-bold mb-4 text-lg">Pet Photos (Max 5)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {formData.images && formData.images.map((img, index) => (
                                    <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden shadow-md">
                                        <img
                                            src={img}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newImages = formData.images.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, images: newImages });
                                                }}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {(!formData.images || formData.images.length < 5) && (
                                    <label className="flex flex-col items-center justify-center aspect-square border-3 border-dashed border-secondary-200 rounded-2xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 bg-secondary-50">
                                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <FaImage className="text-xl text-primary-400" />
                                        </div>
                                        <span className="text-neutral-600 font-semibold text-sm text-center px-2">Add Photo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <p className="text-neutral-500 text-sm">Supported formats: JPG, PNG. Max size: 5MB per image.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-neutral-700 font-bold mb-2">Title</label>
                                <div className="relative">
                                    <FaPaw className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                    <input
                                        type="text"
                                        name="title"
                                        onChange={handleChange}
                                        placeholder="e.g., Golden Retriever Puppy"
                                        className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-neutral-700 font-bold mb-2">Price (PKR)</label>
                                <div className="relative">
                                    <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                    <input
                                        type="number"
                                        name="price"
                                        onChange={handleChange}
                                        placeholder="25000"
                                        className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-neutral-700 font-bold mb-2">Description</label>
                            <div className="relative">
                                <FaInfoCircle className="absolute left-4 top-5 text-neutral-400" />
                                <textarea
                                    name="description"
                                    onChange={handleChange}
                                    placeholder="Describe your pet's personality, health, and any special features..."
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-neutral-700 font-bold mb-2">Category</label>
                                <div className="relative">
                                    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                    <select
                                        name="category"
                                        onChange={handleChange}
                                        className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all appearance-none"
                                    >
                                        <option>Dog</option>
                                        <option>Cat</option>
                                        <option>Bird</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-neutral-700 font-bold mb-2">Breed</label>
                                <div className="relative">
                                    <FaPaw className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                    <input
                                        type="text"
                                        name="breed"
                                        onChange={handleChange}
                                        placeholder="e.g., Persian"
                                        className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-neutral-700 font-bold mb-2">Age (Years)</label>
                                <input
                                    type="number"
                                    name="age"
                                    onChange={handleChange}
                                    placeholder="2"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-neutral-700 font-bold mb-2">Gender</label>
                                <select
                                    name="gender"
                                    onChange={handleChange}
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all appearance-none"
                                >
                                    <option value="Unknown">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Pair">Pair</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-neutral-700 font-bold mb-2">Location</label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    name="location"
                                    onChange={handleChange}
                                    placeholder="Lahore, Pakistan"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-neutral-700 font-bold mb-4">Additional Features</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-xl cursor-pointer hover:bg-secondary-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="isVaccinated"
                                        checked={formData.isVaccinated}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-neutral-700 font-medium">Vaccinated</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-xl cursor-pointer hover:bg-secondary-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="isTrained"
                                        checked={formData.isTrained}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-neutral-700 font-medium">Trained</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-xl cursor-pointer hover:bg-secondary-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="isPedigree"
                                        checked={formData.isPedigree}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-neutral-700 font-medium">Pedigree</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            Post Listing
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;
