import { Link } from 'react-router-dom';
import { FaDog, FaCat, FaDove, FaPaw, FaHandHoldingHeart } from 'react-icons/fa';

const categories = [
    { name: 'Dogs', icon: FaDog, color: 'text-blue-500 bg-blue-50', link: '/market/search?category=Dog' },
    { name: 'Cats', icon: FaCat, color: 'text-orange-500 bg-orange-50', link: '/market/search?category=Cat' },
    { name: 'Birds', icon: FaDove, color: 'text-green-500 bg-green-50', link: '/market/search?category=Bird' },
    { name: 'Small Pets', icon: FaPaw, color: 'text-purple-500 bg-purple-50', link: '/market/search?category=SmallPet' },
    { name: 'Adoption', icon: FaHandHoldingHeart, color: 'text-red-500 bg-red-50', link: '/market/search?type=adoption' },
];

const CategoryTiles = () => {
    return (
        <div className="bg-white border-b border-secondary-100 sticky top-0 z-20 shadow-sm/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 overflow-x-auto py-4 no-scrollbar">
                    <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-2">Quick Browse:</span>
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            to={cat.link}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 border border-secondary-200 hover:border-primary-300 hover:bg-white hover:shadow-md transition-all duration-300 shrink-0 group"
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${cat.color} group-hover:scale-110 transition-transform`}>
                                <cat.icon />
                            </div>
                            <span className="text-sm font-semibold text-neutral-600 group-hover:text-primary-700">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryTiles;
