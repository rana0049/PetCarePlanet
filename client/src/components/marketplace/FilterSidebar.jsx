import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa';

const FilterSection = ({ title, children, isOpen, onToggle }) => (
    <div className="border-b border-secondary-200 py-4">
        <button
            className="flex justify-between items-center w-full text-left font-bold text-neutral-800 hover:text-primary-600 transition-colors"
            onClick={onToggle}
        >
            {title}
            {isOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </button>
        {isOpen && <div className="mt-4 space-y-2">{children}</div>}
    </div>
);

const FilterSidebar = ({ filters, onFilterChange }) => {
    const [sections, setSections] = useState({
        category: true,
        location: true,
        price: true,
        features: true,
    });

    const toggleSection = (section) => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onFilterChange(name, type === 'checkbox' ? checked : value);
    };

    return (
        <div className="bg-white p-5 rounded-3xl shadow-card border border-secondary-100 h-full">
            <div className="flex items-center gap-2 mb-6 text-primary-700 font-bold text-lg">
                <FaFilter /> Filters
            </div>

            <FilterSection title="Category" isOpen={sections.category} onToggle={() => toggleSection('category')}>
                {['Dog', 'Cat', 'Bird', 'SmallPet'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={filters.category === cat}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                        />
                        <span className="text-neutral-600 group-hover:text-primary-600 transition-colors">{cat}</span>
                    </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="radio"
                        name="category"
                        value=""
                        checked={filters.category === ''}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="text-neutral-600 group-hover:text-primary-600 transition-colors">All Categories</span>
                </label>
            </FilterSection>

            <FilterSection title="Location" isOpen={sections.location} onToggle={() => toggleSection('location')}>
                <select
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    className="w-full p-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                >
                    <option value="">All Cities</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                </select>
            </FilterSection>

            <FilterSection title="Price Range (PKR)" isOpen={sections.price} onToggle={() => toggleSection('price')}>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleChange}
                        className="w-full p-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm"
                    />
                    <span className="text-neutral-400">-</span>
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        className="w-full p-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm"
                    />
                </div>
            </FilterSection>

            <FilterSection title="Features" isOpen={sections.features} onToggle={() => toggleSection('features')}>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="isVaccinated"
                        checked={filters.isVaccinated}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="text-neutral-600 group-hover:text-primary-600 transition-colors">Vaccinated</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="isTrained"
                        checked={filters.isTrained}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="text-neutral-600 group-hover:text-primary-600 transition-colors">Trained</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="isPedigree"
                        checked={filters.isPedigree}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="text-neutral-600 group-hover:text-primary-600 transition-colors">Pedigree</span>
                </label>
            </FilterSection>
        </div>
    );
};

export default FilterSidebar;
