
import { useQuery } from '@tanstack/react-query';
import { getPokemonList } from '@/services/pokemonService';
import { PokemonWithDetails } from '@/types/pokemon';
import { useMemo } from 'react';

interface UsePokemonOptions {
  sortBy: 'id' | 'name';
  sortOrder: 'asc' | 'desc';
  selectedTypes: string[];
  searchTerm: string;
}

export const usePokemon = ({ 
  sortBy = 'id', 
  sortOrder = 'asc', 
  selectedTypes = [], 
  searchTerm = '' 
}: Partial<UsePokemonOptions> = {}) => {
  
  // Fetch all Pokémon
  const { 
    data: allPokemon = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['allPokemon'],
    queryFn: () => getPokemonList(150),
  });
  
  // Filter and sort Pokémon
  const filteredPokemon = useMemo(() => {
    let filtered = [...allPokemon];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchLower) || 
        pokemon.id.toString() === searchTerm
      );
    }
    
    // Filter by selected types (AND logic - must have ALL selected types)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(pokemon => 
        selectedTypes.every(type => pokemon.types.includes(type))
      );
    }
    
    // Sort results
    filtered.sort((a, b) => {
      if (sortBy === 'id') {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      } else { // sortBy === 'name'
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
    });
    
    return filtered;
  }, [allPokemon, searchTerm, selectedTypes, sortBy, sortOrder]);
  
  // Extract all types from the Pokémon data
  const allTypes = useMemo(() => {
    const typesSet = new Set<string>();
    allPokemon.forEach(pokemon => {
      pokemon.types.forEach(type => {
        typesSet.add(type);
      });
    });
    return Array.from(typesSet).sort();
  }, [allPokemon]);
  
  return {
    allPokemon,
    filteredPokemon, 
    isLoading,
    error,
    refetch,
    allTypes
  };
};