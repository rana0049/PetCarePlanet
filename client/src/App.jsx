import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Vets from './pages/Vets';
import Blogs from './pages/Blogs';
import PetDetails from './pages/PetDetails';
import CreateListing from './pages/CreateListing';
import AdminDashboard from './pages/admin/AdminDashboard';
import VetManagement from './pages/admin/VetManagement';
import BlogManagement from './pages/admin/BlogManagement';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/market" element={<Marketplace />} />
                            <Route path="/create-listing" element={<CreateListing />} />
                            <Route path="/vets" element={<Vets />} />
                            <Route path="/blogs" element={<Blogs />} />
                            <Route path="/pets/:id" element={<PetDetails />} />

                            {/* Admin Routes */}
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/vets" element={<VetManagement />} />
                            <Route path="/admin/blogs" element={<BlogManagement />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
