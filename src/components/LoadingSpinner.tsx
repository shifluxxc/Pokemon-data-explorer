
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-pokedex-red border-r-pokedex-red border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute top-4 left-4 w-8 h-8 bg-white dark:bg-gray-800 border-4 border-pokedex-darkGray rounded-full">
          <div className="w-4 h-4 bg-pokedex-red rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
      <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">Loading Pokémon...</p>
    </div>
  );
};

export default LoadingSpinner;
