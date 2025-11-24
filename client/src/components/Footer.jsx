import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-8 mt-auto">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-primary">PetCarePlanet</h3>
                    <p className="text-gray-400">
                        Your one-stop solution for all pet care needs in Pakistan.
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="/market" className="hover:text-secondary">Marketplace</a></li>
                        <li><a href="/vets" className="hover:text-secondary">Find a Vet</a></li>
                        <li><a href="/blogs" className="hover:text-secondary">Pet Care Tips</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
                    <div className="flex space-x-4">
                        <a href="#" className="text-2xl hover:text-blue-500"><FaFacebook /></a>
                        <a href="#" className="text-2xl hover:text-blue-400"><FaTwitter /></a>
                        <a href="#" className="text-2xl hover:text-pink-500"><FaInstagram /></a>
                    </div>
                </div>
            </div>
            <div className="text-center mt-8 border-t border-gray-700 pt-4 text-gray-500">
                &copy; {new Date().getFullYear()} PetCarePlanet. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
