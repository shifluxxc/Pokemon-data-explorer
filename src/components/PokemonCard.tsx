
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PokemonWithDetails } from "@/types/pokemon";
import TypeBadge from './TypeBadge';

interface PokemonCardProps {
  pokemon: PokemonWithDetails;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-gray-800 border-2 border-pokedex-mediumGray dark:border-gray-700">
      <CardContent className="p-4">
        <div className="bg-pokedex-lightGray dark:bg-gray-700 rounded-lg p-2 mb-3 flex justify-center items-center transition-colors duration-300">
          <img 
            src={pokemon.image} 
            alt={pokemon.name}
            className="h-32 w-32 object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg capitalize dark:text-white">{pokemon.name}</h3>
          <span className="text-pokedex-darkGray dark:text-gray-400 text-sm font-semibold">#{pokemon.id.toString().padStart(3, '0')}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PokemonCard;
