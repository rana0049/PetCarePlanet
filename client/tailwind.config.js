/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Nature & Nurture Palette
                primary: {
                    50: '#f2fcf5',
                    100: '#e1f8e8',
                    200: '#c3eed4',
                    300: '#95deb8',
                    400: '#5fc496',
                    500: '#39a778', // Sage Green - Natural & Calming
                    600: '#28865e',
                    700: '#236b4d',
                    800: '#1f553f',
                    900: '#1a4635',
                },
                secondary: {
                    50: '#fbf9f5',
                    100: '#f5f0e6',
                    200: '#ebe0cc',
                    300: '#decba8',
                    400: '#d0b382',
                    500: '#c49a62', // Warm Beige - Comfort
                    600: '#b8834f',
                    700: '#99663d',
                    800: '#7d5235',
                    900: '#65432d',
                },
                accent: {
                    50: '#fff5f2',
                    100: '#ffe8e1',
                    200: '#ffd4c6',
                    300: '#ffb6a1',
                    400: '#ff8e70',
                    500: '#f96643', // Soft Coral - Friendly & Playful
                    600: '#e64a26',
                    700: '#c03616',
                    800: '#9f2d15',
                    900: '#832915',
                },
                neutral: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c', // Warm Gray
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'card': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04)',
                'card-hover': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 12px 24px -4px rgba(0, 0, 0, 0.08)',
                'glow': '0 0 20px rgba(57, 167, 120, 0.3)',
            },
            backgroundImage: {
                'gradient-hero': 'linear-gradient(to right bottom, #fbf9f5, #e1f8e8)',
                'gradient-primary': 'linear-gradient(135deg, #39a778 0%, #28865e 100%)',
                'gradient-warm': 'linear-gradient(135deg, #f5f0e6 0%, #ebe0cc 100%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}
