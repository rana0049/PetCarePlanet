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
        <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-secondary-200">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="p-2 bg-primary-50 rounded-xl group-hover:bg-primary-100 transition-colors">
                            <FaPaw className="text-2xl text-primary-600" />
                        </div>
                        <span className="text-xl font-display font-bold text-neutral-800 tracking-tight">
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
                                    className="flex items-center space-x-2 px-4 py-2 bg-secondary-50 hover:bg-secondary-100 text-neutral-700 rounded-full transition-all border border-secondary-200"
                                >
                                    <FaUserCircle className="text-xl text-primary-500" />
                                    <span className="font-medium text-sm">{user.name}</span>
                                    <FaChevronDown className={`text-xs transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-secondary-100 rounded-xl shadow-card-hover overflow-hidden animate-fade-in">
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-3 text-neutral-700 hover:bg-secondary-50 transition-colors font-medium text-sm"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-3 text-primary-600 hover:bg-primary-50 transition-colors font-medium text-sm"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { handleLogout(); setShowDropdown(false); }}
                                            className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
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
                                    className="text-neutral-600 hover:text-primary-600 font-medium transition-colors text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all text-sm"
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
        className="text-neutral-600 hover:text-primary-600 font-medium transition-colors text-sm relative group"
    >
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
    </Link>
);

export default Navbar;
