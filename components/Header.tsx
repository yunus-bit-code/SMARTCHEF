
import React from 'react';

interface HeaderProps {
    language: string;
    onLanguageChange: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'];

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 lg:px-8 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-green" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-5H8l4-6v5h3l-4 6z" />
                    </svg>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">SmartChef</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <p className="hidden md:block text-gray-500">What’s cooking today?</p>
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-green text-gray-700"
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
