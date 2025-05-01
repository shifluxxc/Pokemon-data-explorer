
import React, { memo, useCallback } from 'react';
import { PokemonWithDetails } from "@/types/pokemon";
import PokemonCard from './PokemonCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PokemonListProps {
  pokemonList: PokemonWithDetails[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageNumbers: number[];
  enableComparison?: boolean;
}

// Memoize the empty state component
const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <img 
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" 
      alt="Psyduck" 
      className="w-32 h-32 mb-4 opacity-60"
    />
    <p className="text-xl font-semibold text-gray-500">No Pokémon found!</p>
    <p className="text-gray-400">Try changing your search or filter.</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

// Memoize the pagination component
const PaginationComponent = memo(({
  currentPage,
  totalPages,
  pageNumbers,
  onPageChange
}: {
  currentPage: number, 
  totalPages: number, 
  pageNumbers: number[], 
  onPageChange: (page: number) => void
}) => {
  const handlePrevious = useCallback(() => {
    onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);
  
  const handleNext = useCallback(() => {
    onPageChange(currentPage + 1);
  }, [currentPage, onPageChange]);

  if (totalPages <= 1) return null;
  
  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={handlePrevious}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {pageNumbers.map((pageNumber, index) => (
          <PaginationItem key={`${pageNumber}-${index}`}>
            {pageNumber < 0 ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber)}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={handleNext}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
});

PaginationComponent.displayName = 'PaginationComponent';

const PokemonList: React.FC<PokemonListProps> = memo(({ 
  pokemonList, 
  currentPage, 
  totalPages,
  onPageChange,
  pageNumbers,
  enableComparison = false
}) => {
  if (pokemonList.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {pokemonList.map((pokemon) => (
          <PokemonCard 
            key={pokemon.id} 
            pokemon={pokemon} 
            enableComparison={enableComparison}
          />
        ))}
      </div>
      
      <PaginationComponent 
        currentPage={currentPage}
        totalPages={totalPages}
        pageNumbers={pageNumbers}
        onPageChange={onPageChange}
      />
    </div>
  );
});

PokemonList.displayName = 'PokemonList';

export default PokemonList;