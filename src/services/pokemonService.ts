
import { PokemonDetail, PokemonListResponse, PokemonWithDetails } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemonList(limit: number = 150): Promise<PokemonWithDetails[]> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon list');
    }
    
    const data: PokemonListResponse = await response.json();
    
    // Fetch details for each Pokémon
    const pokemonPromises = data.results.map(pokemon => getPokemonDetails(pokemon.name));
    const pokemonDetails = await Promise.all(pokemonPromises);
    
    return pokemonDetails;
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    throw error;
  }
}

export async function getPokemonDetails(nameOrId: string | number): Promise<PokemonWithDetails> {
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
      // Use official artwork if available, fall back to front_default sprite
      image: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default
    };
  } catch (error) {
    console.error(`Error fetching Pokémon details for ${nameOrId}:`, error);
    throw error;
  }
}

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
