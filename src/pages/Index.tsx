import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import TypeFilter from '@/components/TypeFilter';
import PokemonList from '@/components/PokemonList';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useAllPokemon, getAllPokemonTypes } from '@/services/pokemonService';
import { useToast } from "@/components/ui/use-toast";
import { usePagination } from '@/hooks/usePagination';

const Index = () => {
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [types, setTypes] = useState([]);
  const { toast } = useToast();

  // Use React Query for fetching data
  const { 
    data: allPokemon = [], 
    isLoading, 
    error, 
    refetch 
  } = useAllPokemon(150);
  
  // Add pagination for filtered Pokémon
  const {
    currentPage,
    totalPages,
    currentData: paginatedPokemon,
    goToPage,
    pageNumbers
  } = usePagination({
    data: filteredPokemon,
    itemsPerPage: 12
  });

  // Update types when data is loaded
  useEffect(() => {
    if (allPokemon.length > 0) {
      const allTypes = getAllPokemonTypes(allPokemon);
      setTypes(allTypes);
      
      toast({
        title: "Data loaded successfully",
        description: `Loaded ${allPokemon.length} Pokémon`,
        duration: 3000,
      });
    }
  }, [allPokemon, toast]);

  // Apply filters when search term, selected type, or data changes
  useEffect(() => {
    if (allPokemon.length === 0) return;
    
    let filtered = allPokemon;
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchLower) || 
        pokemon.id.toString() === searchTerm
      );
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(pokemon => 
        pokemon.types.includes(selectedType)
      );
    }
    
    setFilteredPokemon(filtered);
  }, [searchTerm, selectedType, allPokemon]);

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    goToPage(1); // Reset to first page on search
  };
  
  // Handle type filter change
  const handleTypeChange = (type) => {
    setSelectedType(type);
    goToPage(1); // Reset to first page on filter change
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container py-6">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container py-6">
          <ErrorDisplay 
            message={error instanceof Error ? error.message : "Unknown error"} 
            onRetry={refetch} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          <TypeFilter 
            selectedType={selectedType} 
            types={types}
            onTypeChange={handleTypeChange}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-pokedex-mediumGray dark:border-gray-700 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-pokedex-darkGray dark:text-white">
              {filteredPokemon.length} Pokémon Found
            </h2>
          </div>
          <PokemonList 
            pokemonList={paginatedPokemon}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            pageNumbers={pageNumbers}
          />
        </div>
      </main>
      <footer className="bg-pokedex-darkGray dark:bg-gray-800 text-white text-center py-4 mt-8 transition-colors duration-300">
        <p className="text-sm">Powered by PokéAPI - Data for the first 150 Pokémon</p>
      </footer>
    </div>
  );
};

export default Index;