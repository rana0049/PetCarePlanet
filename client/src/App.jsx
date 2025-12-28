import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import MarketplaceListings from './pages/MarketplaceListings';
import Vets from './pages/Vets';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import PetDetails from './pages/PetDetails';
import CreateListing from './pages/CreateListing';
import AdminDashboard from './pages/admin/AdminDashboard';
import VetManagement from './pages/admin/VetManagement';
import BlogManagement from './pages/admin/BlogManagement';
import ListingManagement from './pages/admin/ListingManagement';
import ListingDetails from './pages/ListingDetails';
import Pricing from './pages/Pricing';
import EditListing from './pages/EditListing';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ChatBot from './components/ChatBot';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <ErrorBoundary>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/market" element={<Marketplace />} />
                                <Route path="/market/search" element={<MarketplaceListings />} />
                                <Route path="/market/new" element={<CreateListing />} />
                                <Route path="/edit-listing/:id" element={<EditListing />} />
                                <Route path="/market/:id" element={<ListingDetails />} />
                                <Route path="/pricing" element={<Pricing />} />
                                <Route path="/create-listing" element={<CreateListing />} />
                                <Route path="/vets" element={<Vets />} />
                                <Route path="/blogs" element={<Blogs />} />
                                <Route path="/blogs/:id" element={<BlogDetail />} />
                                <Route path="/pets/:id" element={<PetDetails />} />

                                {/* Admin Routes */}
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/admin/vets" element={<VetManagement />} />
                                <Route path="/admin/blogs" element={<BlogManagement />} />
                                <Route path="/admin/listings" element={<ListingManagement />} />
                            </Routes>
                        </ErrorBoundary>
                    </main>
                    <Footer />
                    <ChatBot />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
