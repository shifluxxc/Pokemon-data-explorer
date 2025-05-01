
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import TypeFilterMulti from '@/components/TypeFilterMulti';
import SortControl from '@/components/SortControl';
import PokemonList from '@/components/PokemonList';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { usePokemon } from '@/hooks/usePokemon';
import { usePagination } from '@/hooks/usePagination';
import { useRandomPokemon } from '@/hooks/useRandomPokemon';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'id' | 'name'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  // Use custom hooks with memoized dependencies
  const { 
    filteredPokemon, 
    isLoading, 
    error, 
    refetch,
    allTypes 
  } = usePokemon({
    sortBy,
    sortOrder,
    selectedTypes,
    searchTerm
  });
  
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
  
  const { showRandomPokemon } = useRandomPokemon(150, isLoading);

  // Handle search input change with useCallback
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    goToPage(1); // Reset to first page on search
  }, [goToPage]);
  
  // Handle type filter change with useCallback
  const handleTypeToggle = useCallback((type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
    goToPage(1); // Reset to first page on filter change
  }, [goToPage]);
  
  // Handle sort change with useCallback
  const handleSortChange = useCallback((newSortBy: 'id' | 'name', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }, []);
  
  // Clear all type filters with useCallback
  const clearTypeFilters = useCallback(() => {
    setSelectedTypes([]);
  }, []);

  // Memoize the main content section to prevent unnecessary re-renders
  const mainContent = useMemo(() => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorDisplay message={error instanceof Error ? error.message : 'Unknown error'} onRetry={refetch} />;
    }

    return (
      <>
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between mb-6">
          <div className="w-full md:w-1/3">
            <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          </div>
          
          <div className="w-full md:w-1/4">
            <TypeFilterMulti 
              selectedTypes={selectedTypes} 
              types={allTypes}
              onTypeToggle={handleTypeToggle}
              onClearTypes={clearTypeFilters}
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <SortControl 
              sortBy={sortBy} 
              sortOrder={sortOrder} 
              onSortChange={handleSortChange} 
            />
          </div>
          
          <div className="w-full md:w-auto">
            <Button onClick={showRandomPokemon}>Random Pokémon</Button>
          </div>
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
            enableComparison={true}
          />
        </div>
      </>
    );
  }, [
    isLoading, error, refetch, searchTerm, selectedTypes, allTypes, 
    sortBy, sortOrder, filteredPokemon, paginatedPokemon, 
    currentPage, totalPages, goToPage, pageNumbers,
    handleSearchChange, handleTypeToggle, handleSortChange,
    clearTypeFilters, showRandomPokemon
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container py-6">
        {mainContent}
      </main>
      <footer className="bg-pokedex-darkGray dark:bg-gray-800 text-white text-center py-4 mt-8 transition-colors duration-300">
        <p className="text-sm">Powered by PokéAPI - Data for the first 150 Pokémon</p>
      </footer>
    </div>
  );
};

export default HomePage;