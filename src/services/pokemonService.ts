import { PokemonDetail, PokemonListResponse, PokemonWithDetails, PokemonEvolution, Species } from "@/types/pokemon";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://pokeapi.co/api/v2";

// Fetch functions
const fetchPokemonList = async (limit: number = 150): Promise<PokemonWithDetails[]> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon list');
    }
    
    const data: PokemonListResponse = await response.json();
    
    // Fetch details for each Pokémon
    const pokemonPromises = data.results.map(pokemon => fetchPokemonDetails(pokemon.name));
    const pokemonDetails = await Promise.all(pokemonPromises);
    
    return pokemonDetails;
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    throw error;
  }
};

const fetchPokemonDetails = async (nameOrId: string | number): Promise<PokemonWithDetails> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for Pokémon ${nameOrId}`);
    }
    
    const data: PokemonDetail = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      types: data.types.map(typeInfo => typeInfo.type.name),
      image: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
      stats: data.stats.map(stat => ({
        name: stat.stat.name,
        value: stat.base_stat
      })),
      abilities: data.abilities.map(ability => ability.ability.name),
      moves: data.moves.map(move => move.move.name),
      speciesUrl: data.species.url
    };
  } catch (error) {
    console.error(`Error fetching Pokémon details for ${nameOrId}:`, error);
    throw error;
  }
};

const fetchSpeciesDetails = async (url: string): Promise<Species> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch species details`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching species details:`, error);
    throw error;
  }
};

const fetchEvolutionChain = async (url: string): Promise<PokemonEvolution> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch evolution chain`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching evolution chain:`, error);
    throw error;
  }
};

// React Query hooks
export const useAllPokemon = (limit: number = 150) => {
  return useQuery({
    queryKey: ['allPokemon', limit],
    queryFn: () => fetchPokemonList(limit),
  });
};

export const usePokemonDetails = (nameOrId: string | number) => {
  return useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => fetchPokemonDetails(nameOrId),
    enabled: !!nameOrId,
  });
};

export const useSpeciesDetails = (url: string | undefined) => {
  return useQuery({
    queryKey: ['species', url],
    queryFn: () => fetchSpeciesDetails(url || ''),
    enabled: !!url,
  });
};

export const useEvolutionChain = (url: string | undefined) => {
  return useQuery({
    queryKey: ['evolution', url],
    queryFn: () => fetchEvolutionChain(url || ''),
    enabled: !!url,
  });
};

// Helper functions that don't require React Query
export function getAllPokemonTypes(pokemonList: PokemonWithDetails[]): string[] {
  // Extract all types and remove duplicates
  const typesSet = new Set<string>();
  
  pokemonList.forEach(pokemon => {
    pokemon.types.forEach(type => {
      typesSet.add(type);
    });
  });
  
  return Array.from(typesSet).sort();
}

export function processEvolutionChain(chain: any): { name: string; id: number }[] {
  const evolutions: { name: string; id: number }[] = [];
  
  // Extract the ID from the URL
  const extractId = (url: string): number => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
  };
  
  function processChain(chain: any): void {
    if (chain?.species) {
      evolutions.push({
        name: chain.species.name,
        id: extractId(chain.species.url)
      });
    }
    
    if (chain?.evolves_to?.length > 0) {
      chain.evolves_to.forEach((evolution: any) => {
        processChain(evolution);
      });
    }
  }
  
  processChain(chain);
  return evolutions;
}

// For backward compatibility
export const getPokemonList = fetchPokemonList;
export const getPokemonDetails = fetchPokemonDetails;
export const getSpeciesDetails = fetchSpeciesDetails;
export const getEvolutionChain = fetchEvolutionChain;