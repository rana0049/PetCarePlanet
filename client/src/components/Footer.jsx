import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-primary-900 text-primary-100 py-12 mt-auto">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <h3 className="text-2xl font-display font-bold mb-4 text-white">PetCarePlanet</h3>
                    <p className="text-primary-200 max-w-sm leading-relaxed">
                        Nurturing the bond between you and your pet. Your trusted partner in pet health and happiness.
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                    <ul className="space-y-3">
                        <li><a href="/market" className="hover:text-white transition-colors">Marketplace</a></li>
                        <li><a href="/vets" className="hover:text-white transition-colors">Find a Vet</a></li>
                        <li><a href="/blogs" className="hover:text-white transition-colors">Pet Care Tips</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
                    <div className="flex space-x-4">
                        <a href="#" className="text-2xl hover:text-white transition-colors"><FaFacebook /></a>
                        <a href="#" className="text-2xl hover:text-white transition-colors"><FaTwitter /></a>
                        <a href="#" className="text-2xl hover:text-white transition-colors"><FaInstagram /></a>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-primary-800 text-center text-primary-400 text-sm">
                &copy; {new Date().getFullYear()} PetCarePlanet. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
