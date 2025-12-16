import { FaCheck, FaTimes, FaCrown, FaUser, FaStore } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PricingCard = ({ title, price, features, icon: Icon, recommended = false, buttonText = "Get Started", link = "/contact" }) => (
    <div className={`relative bg-white rounded-2xl shadow-xl border ${recommended ? 'border-primary-500 ring-4 ring-primary-100' : 'border-secondary-200'} p-8 flex flex-col h-full transform transition-all hover:-translate-y-2`}>
        {recommended && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                Most Popular
            </div>
        )}

        <div className="flex items-center justify-center w-16 h-16 bg-secondary-50 rounded-2xl mb-6 mx-auto text-3xl text-primary-600">
            <Icon />
        </div>

        <h3 className="text-2xl font-bold text-neutral-900 text-center mb-2">{title}</h3>
        <div className="text-center mb-8">
            <span className="text-4xl font-extrabold text-neutral-900">{price}</span>
            {price !== 'Free' && <span className="text-neutral-500">/month</span>}
        </div>

        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                    {feature.included ? (
                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                        <FaTimes className="text-neutral-300 mt-1 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-neutral-700' : 'text-neutral-400'}`}>
                        {feature.text}
                    </span>
                </li>
            ))}
        </ul>

        <Link
            to={link}
            className={`block w-full py-3 rounded-xl font-bold text-center transition-all ${recommended
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-primary-500/30'
                    : 'bg-secondary-100 text-neutral-900 hover:bg-secondary-200'
                }`}
        >
            {buttonText}
        </Link>
    </div>
);

const Pricing = () => {
    const tiers = [
        {
            title: "Basic",
            price: "Free",
            icon: FaUser,
            features: [
                { text: "1 Active Listing", included: true },
                { text: "Standard Visibility", included: true },
                { text: "Basic Support", included: true },
                { text: "Featured Badge", included: false },
                { text: "Top of Search Results", included: false },
                { text: "Verified Seller Badge", included: false },
            ]
        },
        {
            title: "Premium",
            price: "PKR 1,000",
            icon: FaCrown,
            recommended: true,
            features: [
                { text: "5 Active Listings", included: true },
                { text: "High Visibility", included: true },
                { text: "Priority Support", included: true },
                { text: "Featured Badge", included: true },
                { text: "Top of Search Results", included: true },
                { text: "Verified Seller Badge", included: false },
            ]
        },
        {
            title: "Breeder Pro",
            price: "PKR 5,000",
            icon: FaStore,
            features: [
                { text: "Unlimited Listings", included: true },
                { text: "Maximum Visibility", included: true },
                { text: "Dedicated Support", included: true },
                { text: "Featured Badge", included: true },
                { text: "Top of Search Results", included: true },
                { text: "Verified Seller Badge", included: true },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-secondary-50 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-6">
                        Choose the Perfect Plan
                    </h1>
                    <p className="text-xl text-neutral-600">
                        Whether you're rehoming a single pet or running a professional breeding business, we have a plan for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, index) => (
                        <PricingCard key={index} {...tier} />
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-neutral-500 mb-4">Have questions about our plans?</p>
                    <Link to="/contact" className="text-primary-600 font-bold hover:underline">
                        Contact our support team
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
