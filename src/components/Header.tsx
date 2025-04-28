
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-pokedex-red dark:bg-gray-800 py-4 shadow-md transition-colors duration-300">
      <div className="container flex items-center justify-center">
        <h1 className="text-2xl md:text-4xl font-bold text-white tracking-wider">Pokédex</h1>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-4">
          <ThemeToggle />
          <div className="bg-white dark:bg-gray-600 rounded-full w-10 h-10 border-4 border-pokedex-darkGray flex items-center justify-center">
            <div className="bg-pokedex-lightGray dark:bg-gray-400 rounded-full w-6 h-6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
