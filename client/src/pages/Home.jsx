import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaStethoscope, FaShoppingCart, FaArrowRight, FaStar, FaPaw, FaUserMd, FaShoppingBag, FaFileMedical } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-24">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-block mb-6">
                            <span className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold text-sm border border-white/30 flex items-center gap-2 mx-auto w-fit">
                                <FaPaw className="text-yellow-300" /> Pakistan's #1 Pet Care Platform
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                            Your Pet's Health &
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">
                                Happiness Matters
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
                            Complete pet care solution with health tracking, premium marketplace, and expert veterinarians
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                to="/market"
                                className="group px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-glow hover:shadow-glow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <FaShoppingCart />
                                Explore Marketplace
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/vets"
                                className="px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <FaStethoscope />
                                Book Vet Now
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-300/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"></div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                            Everything Your Pet Needs
                        </h2>
                        <p className="text-xl text-gray-600">Comprehensive care in one beautiful platform</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            gradient="from-blue-500 to-cyan-500"
                            icon={<FaHeart className="text-5xl" />}
                            title="Health Monitoring"
                            desc="Track vaccinations, weight, and medical history with smart reminders and insights."
                            delay={0.1}
                        />
                        <FeatureCard
                            gradient="from-purple-500 to-pink-500"
                            icon={<FaShoppingCart className="text-5xl" />}
                            title="Premium Marketplace"
                            desc="Buy and sell pets through our verified, secure platform with buyer protection."
                            delay={0.2}
                        />
                        <FeatureCard
                            gradient="from-orange-500 to-red-500"
                            icon={<FaStethoscope className="text-5xl" />}
                            title="Expert Veterinarians"
                            desc="Connect with certified vets, book appointments, and get professional care."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <StatCard number="10K+" label="Happy Pets" icon={<FaPaw />} />
                        <StatCard number="500+" label="Verified Vets" icon={<FaUserMd />} />
                        <StatCard number="5K+" label="Successful Sales" icon={<FaShoppingBag />} />
                        <StatCard number="50K+" label="Health Records" icon={<FaFileMedical />} />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-orange-100 to-pink-100">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-5xl font-display font-bold text-gray-800 mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">Join thousands of pet owners who trust PetCarePlanet</p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-glow hover:shadow-glow-lg transform hover:-translate-y-1 transition-all"
                        >
                            Create Free Account
                            <FaStar className="animate-pulse" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ gradient, icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200"
    >
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${gradient} text-white mb-6 shadow-lg`}>
            {icon}
        </div>
        <h3 className="text-2xl font-display font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
    </motion.div>
);

const StatCard = ({ number, label, icon }) => (
    <div className="text-white">
        <div className="text-5xl mb-2 flex justify-center opacity-80">{icon}</div>
        <div className="text-4xl md:text-5xl font-bold mb-2">{number}</div>
        <div className="text-lg opacity-90 font-medium">{label}</div>
    </div>
);

export default Home;
