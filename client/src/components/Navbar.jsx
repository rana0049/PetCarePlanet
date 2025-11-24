import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPaw, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-gradient-to-r from-blue-500 to-purple-500">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                            <FaPaw className="text-2xl text-white" />
                        </div>
                        <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            PetCarePlanet
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/market">Marketplace</NavLink>
                        <NavLink to="/vets">Veterinarians</NavLink>
                        <NavLink to="/blogs">Blog</NavLink>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                                >
                                    <FaUserCircle className="text-xl" />
                                    <span className="font-medium">{user.name}</span>
                                    <FaChevronDown className="text-sm" />
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-purple-200 rounded-xl shadow-xl overflow-hidden">
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors font-medium"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => { handleLogout(); setShowDropdown(false); }}
                                            className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-purple-600 font-semibold transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children }) => (
    <Link
        to={to}
        className="text-gray-700 hover:text-purple-600 font-semibold transition-colors relative group"
    >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
    </Link>
);

export default Navbar;
