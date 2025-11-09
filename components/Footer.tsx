
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white mt-8 py-4">
            <div className="container mx-auto px-4 lg:px-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} SmartChef. Cook smart, waste less.</p>
            </div>
        </footer>
    );
};

export default Footer;
