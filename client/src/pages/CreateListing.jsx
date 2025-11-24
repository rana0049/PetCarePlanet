import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUpload, FaImage, FaPaw, FaTag, FaMapMarkerAlt, FaInfoCircle, FaDollarSign } from 'react-icons/fa';

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
        image: '',
        location: '',
    });
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary or similar service
        // For now, we'll use a placeholder service (imgbb, cloudinary, etc.)
        // Since we don't have API keys, we'll use the base64 data URL
        setFormData({ ...formData, image: reader.result });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/market`, formData, config);
            navigate('/market');
        } catch (error) {
            console.error(error);
            alert('Failed to create listing');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                            List Your Pet
                        </h1>
                        <p className="text-xl text-gray-600">Find a loving new home for your pet</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                        {/* Image Upload */}
                        <div className="mb-8">
                            <label className="block text-gray-700 font-bold mb-4 text-lg">Pet Photo</label>
                            <div className="relative group">
                                {imagePreview ? (
                                    <div className="relative overflow-hidden rounded-2xl shadow-md">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => { setImagePreview(''); setFormData({ ...formData, image: '' }); }}
                                                className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transform hover:scale-105 transition-all shadow-lg"
                                            >
                                                Remove Photo
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-72 border-3 border-dashed border-purple-200 rounded-2xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 bg-gray-50">
                                        <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <FaImage className="text-4xl text-purple-500" />
                                        </div>
                                        <span className="text-gray-600 font-semibold text-lg mb-1">Click to upload photo</span>
                                        <span className="text-gray-400 text-sm">JPG, PNG up to 10MB</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="mt-4 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUpload className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="Or paste image URL here..."
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Title</label>
                                <div className="relative">
                                    <FaPaw className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="title"
                                        onChange={handleChange}
                                        placeholder="e.g., Golden Retriever Puppy"
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Price (PKR)</label>
                                <div className="relative">
                                    <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        name="price"
                                        onChange={handleChange}
                                        placeholder="25000"
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Description</label>
                            <div className="relative">
                                <FaInfoCircle className="absolute left-4 top-5 text-gray-400" />
                                <textarea
                                    name="description"
                                    onChange={handleChange}
                                    placeholder="Describe your pet's personality, health, and any special features..."
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Category</label>
                                <div className="relative">
                                    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        name="category"
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all appearance-none"
                                    >
                                        <option>Dog</option>
                                        <option>Cat</option>
                                        <option>Bird</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Breed</label>
                                <div className="relative">
                                    <FaPaw className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="breed"
                                        onChange={handleChange}
                                        placeholder="e.g., Persian"
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Age (Years)</label>
                                <input
                                    type="number"
                                    name="age"
                                    onChange={handleChange}
                                    placeholder="2"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Location</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        onChange={handleChange}
                                        placeholder="Lahore, Pakistan"
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
