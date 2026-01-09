import { useRef } from 'react';

const PageHero = ({ title, subtitle, image, children, height = "min-h-[60vh]" }) => {
    return (
        <div className={`relative ${height} flex items-center overflow-hidden bg-secondary-50`}>
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={image}
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-r from-secondary-50/30 via-secondary-50/15 to-secondary-50/5"
                ></div>
            </div>

            <div className="relative container mx-auto px-4 z-10 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-neutral-900 mb-4 leading-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PageHero;
