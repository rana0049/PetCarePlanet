import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPaw, FaHeart, FaStethoscope, FaShoppingCart, FaArrowRight, FaQuoteLeft, FaCheckCircle, FaUserPlus, FaHandshake, FaHome } from 'react-icons/fa';
import heroImage from '../assets/hero-pets.png';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-secondary-50 font-sans text-neutral-800">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-secondary-100">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="Happy pets in nature"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-50/50 via-secondary-50/30 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 pt-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-primary-700 font-semibold text-sm shadow-sm mb-6">
                            <FaPaw className="text-primary-500" />
                            <span>Where Pets are Family</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold text-neutral-900 mb-6 leading-tight">
                            Find Your Perfect <br />
                            <span className="text-primary-600">Companion</span> Today
                        </h1>

                        <p className="text-xl text-neutral-600 mb-10 leading-relaxed max-w-lg">
                            The most trusted marketplace for buying and selling pets. Connect with responsible breeders and loving families.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Go to Dashboard
                                    <FaArrowRight />
                                </Link>
                            ) : (
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Join Our Family
                                    <FaArrowRight />
                                </Link>
                            )}

                            <Link
                                to="/market"
                                className="px-8 py-4 bg-white hover:bg-secondary-50 text-neutral-700 border border-secondary-200 rounded-full font-semibold text-lg shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <FaPaw className="text-primary-500" />
                                Find a Pet
                            </Link>

                            <Link
                                to="/vets"
                                className="px-8 py-4 bg-white hover:bg-secondary-50 text-neutral-700 border border-secondary-200 rounded-full font-semibold text-lg shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <FaStethoscope className="text-primary-500" />
                                Find a Vet
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section - "Everything They Need" */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
                            More Than Just a Marketplace
                        </h2>
                        <p className="text-lg text-neutral-500">
                            We ensure a safe and loving journey for every pet, from finding a home to lifelong care.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<FaShoppingCart className="text-4xl text-secondary-600" />}
                            title="Buy & Sell Pets"
                            desc="A secure platform to connect with verified sellers and find your new best friend."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<FaStethoscope className="text-4xl text-primary-500" />}
                            title="Expert Vets"
                            desc="Connect with certified veterinarians for health checks and advice for your new pet."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<FaHeart className="text-4xl text-accent-500" />}
                            title="Health Monitoring"
                            desc="Keep track of vaccinations and growth milestones as your pet grows."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-gradient-to-b from-white via-primary-50/30 to-white relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">How It Works</h2>
                        <p className="text-lg text-neutral-500">Simple steps to a happier pet</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-secondary-200 -translate-y-1/2 z-0"></div>

                        <StepCard
                            number="01"
                            title="Create a Profile"
                            desc="Sign up to browse available pets or list your own for sale."
                            icon={<FaUserPlus />}
                            delay={0.1}
                        />
                        <StepCard
                            number="02"
                            title="Connect & Verify"
                            desc="Chat with sellers, verify details, and ensure a safe transaction."
                            icon={<FaHandshake />}
                            delay={0.2}
                        />
                        <StepCard
                            number="03"
                            title="Welcome Home"
                            desc="Bring your new family member home and start your journey together."
                            icon={<FaHome />}
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-secondary-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-4 text-neutral-900">Happy Tails</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <TestimonialCard
                            quote="Found my dream Golden Retriever through PetCarePlanet. The process was so safe and easy!"
                            author="Sarah & Max"
                            role="Dog Mom"
                        />
                        <TestimonialCard
                            quote="Selling my kittens to loving homes was my priority. This platform made it possible."
                            author="Ahmed"
                            role="Breeder"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-warm">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl font-display font-bold text-neutral-900 mb-6">
                            Ready to Find a Friend?
                        </h2>
                        <p className="text-xl text-neutral-600 mb-8">
                            Thousands of pets are waiting for a loving home.
                        </p>
                        {user ? (
                            <Link
                                to="/market"
                                className="inline-flex items-center gap-2 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                View Marketplace
                                <FaPaw />
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                Get Started for Free
                                <FaPaw />
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -5 }}
        className="p-8 rounded-3xl bg-secondary-50 hover:bg-white border border-transparent hover:border-primary-100 shadow-sm hover:shadow-card-hover transition-all duration-300"
    >
        <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm text-primary-600">
            {icon}
        </div>
        <h3 className="text-xl font-display font-bold text-neutral-900 mb-3">{title}</h3>
        <p className="text-neutral-500 leading-relaxed">{desc}</p>
    </motion.div>
);

const StepCard = ({ number, title, desc, icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -10 }}
        className="relative z-10 bg-gradient-to-br from-white to-primary-50 p-8 rounded-3xl shadow-card border border-primary-100 text-center group hover:shadow-xl transition-all duration-300"
    >
        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-2xl text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
            {icon}
        </div>
        <div className="absolute top-4 right-4 text-4xl font-display font-bold text-primary-100 opacity-50 group-hover:text-primary-200 transition-colors duration-300 select-none">
            {number}
        </div>
        <h3 className="text-xl font-display font-bold text-neutral-900 mb-3">{title}</h3>
        <p className="text-neutral-500 leading-relaxed">{desc}</p>
    </motion.div>
);

const TestimonialCard = ({ quote, author, role }) => (
    <div className="p-8 rounded-3xl bg-white border border-secondary-200 shadow-card">
        <FaQuoteLeft className="text-3xl text-primary-400 mb-6 opacity-50" />
        <p className="text-lg text-neutral-600 mb-6 italic leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                {author[0]}
            </div>
            <div>
                <div className="font-bold text-neutral-900">{author}</div>
                <div className="text-sm text-neutral-500">{role}</div>
            </div>
        </div>
    </div>
);

export default Home;
