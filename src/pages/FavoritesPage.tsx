
import React, { useMemo } from 'react';
import Header from '@/components/Header';
import PokemonList from '@/components/PokemonList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { usePokemon } from '@/hooks/usePokemon';
import { usePagination } from '@/hooks/usePagination';
import { usePokemonContext } from '@/contexts/PokemonContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FavoritesPage = () => {
  const { favorites } = usePokemonContext();
  const { allPokemon, isLoading, error } = usePokemon();
  
  // Filter for favorites only
  const favoritePokemon = useMemo(() => {
    return allPokemon.filter(pokemon => favorites.includes(pokemon.id));
  }, [allPokemon, favorites]);
  
  const {
    currentPage,
    totalPages,
    currentData: paginatedPokemon,
    goToPage,
    pageNumbers
  } = usePagination({
    data: favoritePokemon,
    itemsPerPage: 12
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container py-6">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container py-6">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/">← Back to All Pokémon</Link>
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-pokedex-mediumGray dark:border-gray-700 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-pokedex-darkGray dark:text-white">
              Your Favorites ({favoritePokemon.length})
            </h2>
          </div>
          
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" 
                alt="Snorlax" 
                className="w-32 h-32 mb-4 opacity-60"
              />
              <p className="text-xl font-semibold text-gray-500">No favorites yet!</p>
              <p className="text-gray-400 mb-4">Click the heart icon on any Pokémon to add it to your favorites.</p>
              <Button asChild>
                <Link to="/">Browse Pokémon</Link>
              </Button>
            </div>
          ) : (
            <PokemonList 
              pokemonList={paginatedPokemon} 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              pageNumbers={pageNumbers}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default FavoritesPage;