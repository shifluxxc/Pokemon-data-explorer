
import React from 'react';
import { PokemonWithDetails } from "@/types/pokemon";
import PokemonCard from './PokemonCard';

interface PokemonListProps {
  pokemonList: PokemonWithDetails[];
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemonList }) => {
  if (pokemonList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" 
          alt="Psyduck" 
          className="w-32 h-32 mb-4 opacity-60"
        />
        <p className="text-xl font-semibold text-gray-500">No Pokémon found!</p>
        <p className="text-gray-400">Try changing your search or filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonList;
