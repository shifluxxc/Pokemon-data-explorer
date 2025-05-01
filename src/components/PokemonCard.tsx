
import React, { useCallback, memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PokemonWithDetails } from "@/types/pokemon";
import TypeBadge from './TypeBadge';
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePokemonContext } from '@/contexts/PokemonContext';
import { Link } from 'react-router-dom';

interface PokemonCardProps {
  pokemon: PokemonWithDetails;
  enableComparison?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = memo(({ pokemon, enableComparison = false }) => {
  const { toggleFavorite, isFavorite, toggleComparison, isInComparison } = usePokemonContext();
  
  const isFav = isFavorite(pokemon.id);
  const inComparison = isInComparison(pokemon.id);
  
  const handleFavoriteToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  }, [toggleFavorite, pokemon.id]);
  
  const handleComparisonToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleComparison(pokemon.id);
  }, [toggleComparison, pokemon.id]);
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-gray-800 border-2 border-pokedex-mediumGray dark:border-gray-700 relative group">
      {/* Favorite button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-70 hover:opacity-100 z-10"
        onClick={handleFavoriteToggle}
      >
        <Heart 
          className={`h-5 w-5 transition-all ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
        />
      </Button>
      
      <Link to={`/pokemon/${pokemon.id}`} className="block">
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
          
          {enableComparison && (
            <Button 
              variant={inComparison ? "default" : "outline"} 
              size="sm" 
              className="w-full mt-3"
              onClick={handleComparisonToggle}
            >
              {inComparison ? "Remove from Compare" : "Add to Compare"}
            </Button>
          )}
        </CardContent>
      </Link>
    </Card>
  );
});

PokemonCard.displayName = 'PokemonCard';

export default PokemonCard;