
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 bg-white dark:bg-gray-800 border-2 border-pokedex-mediumGray dark:border-gray-700 focus:border-pokedex-red dark:focus:border-pokedex-red"
      />
    </div>
  );
};

export default SearchBar;
