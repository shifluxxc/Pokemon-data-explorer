
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import TypeFilter from '@/components/TypeFilter';
import PokemonList from '@/components/PokemonList';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { PokemonWithDetails } from '@/types/pokemon';
import { getPokemonList, getAllPokemonTypes } from '@/services/pokemonService';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [allPokemon, setAllPokemon] = useState<PokemonWithDetails[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fetch all Pokémon
  const fetchPokemonData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const pokemonData = await getPokemonList(150);
      setAllPokemon(pokemonData);
      setFilteredPokemon(pokemonData);
      
      // Extract all types from the fetched Pokémon
      const allTypes = getAllPokemonTypes(pokemonData);
      setTypes(allTypes);
      
      toast({
        title: "Data loaded successfully",
        description: `Loaded ${pokemonData.length} Pokémon`,
        duration: 3000,
      });
    } catch (err) {
      console.error("Error fetching Pokémon:", err);
      setError("Failed to load Pokémon data. Please check your connection and try again.");
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Failed to fetch Pokémon from the API",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPokemonData();
  }, []);

  // Apply filters when search term or selected type changes
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
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  // Handle type filter change
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  if (loading) {
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
          <ErrorDisplay message={error} onRetry={fetchPokemonData} />
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
          <PokemonList pokemonList={filteredPokemon} />
        </div>
      </main>
      <footer className="bg-pokedex-darkGray dark:bg-gray-800 text-white text-center py-4 mt-8 transition-colors duration-300">
        <p className="text-sm">Powered by PokéAPI - Data for the first 150 Pokémon</p>
      </footer>
    </div>
  );
};

export default Index;
