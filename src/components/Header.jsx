// /frontend/src/components/Header.jsx

import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';

const Header = ({ title, onHistoryClick, onThemeToggle, theme }) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-10">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onHistoryClick} 
                    className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden" // Only show on smaller screens
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold truncate" title={title}>
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onThemeToggle}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </div>
    );
};

export default Header;
