
import { useQuery } from '@tanstack/react-query';
import { useAllPokemon } from '@/services/pokemonService';
import { PokemonWithDetails } from '@/types/pokemon';
import { useMemo, useCallback } from 'react';

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
  
  // Fetch all Pokémon using React Query
  const { 
    data: allPokemon = [], 
    isLoading, 
    error,
    refetch 
  } = useAllPokemon(150);
  
  // Memoized filter function to avoid recreating on every render
  const filterPokemon = useCallback((pokemon: PokemonWithDetails[], search: string, types: string[]) => {
    let filtered = [...pokemon];
    
    // Filter by search term
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchLower) || 
        pokemon.id.toString() === search
      );
    }
    
    // Filter by selected types (AND logic - must have ALL selected types)
    if (types.length > 0) {
      filtered = filtered.filter(pokemon => 
        types.every(type => pokemon.types.includes(type))
      );
    }
    
    return filtered;
  }, []);
  
  // Memoized sort function
  const sortPokemon = useCallback((pokemon: PokemonWithDetails[], by: string, order: string) => {
    return [...pokemon].sort((a, b) => {
      if (by === 'id') {
        return order === 'asc' ? a.id - b.id : b.id - a.id;
      } else { // sortBy === 'name'
        return order === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
    });
  }, []);
  
  // Filter and sort Pokémon
  const filteredPokemon = useMemo(() => {
    const filtered = filterPokemon(allPokemon, searchTerm, selectedTypes);
    return sortPokemon(filtered, sortBy, sortOrder);
  }, [allPokemon, searchTerm, selectedTypes, sortBy, sortOrder, filterPokemon, sortPokemon]);
  
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