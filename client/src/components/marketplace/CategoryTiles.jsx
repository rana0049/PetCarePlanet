import { Link } from 'react-router-dom';
import { FaDog, FaCat, FaCrow, FaPaw, FaHeart } from 'react-icons/fa';

const categories = [
    { name: 'Dogs', icon: FaDog, color: 'bg-blue-100 text-blue-600', link: '/market/search?category=Dog' },
    { name: 'Cats', icon: FaCat, color: 'bg-orange-100 text-orange-600', link: '/market/search?category=Cat' },
    { name: 'Birds', icon: FaCrow, color: 'bg-green-100 text-green-600', link: '/market/search?category=Bird' },
    { name: 'Small Pets', icon: FaPaw, color: 'bg-purple-100 text-purple-600', link: '/market/search?category=SmallPet' },
    { name: 'Adoption', icon: FaHeart, color: 'bg-red-100 text-red-600', link: '/market/search?type=adoption' },
];

const CategoryTiles = () => {
    return (
        <div className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-display font-bold text-neutral-900 mb-8 text-center">Browse by Category</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            to={cat.link}
                            className="flex flex-col items-center justify-center w-32 h-32 rounded-3xl bg-white border border-secondary-100 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3 ${cat.color} group-hover:scale-110 transition-transform`}>
                                <cat.icon />
                            </div>
                            <span className="font-semibold text-neutral-700 group-hover:text-primary-600 transition-colors">
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
