
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 lg:px-8 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-green" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-5H8l4-6v5h3l-4 6z" />
                    </svg>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">SmartChef</h1>
                </div>
                <p className="hidden md:block text-gray-500">What’s cooking today?</p>
            </div>
        </header>
    );
};

export default Header;
