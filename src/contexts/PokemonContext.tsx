
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { PokemonWithDetails } from '@/types/pokemon';
import { toast } from 'sonner';

interface PokemonContextType {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  comparisonList: number[];
  toggleComparison: (id: number) => void;
  isInComparison: (id: number) => boolean;
  clearComparison: () => void;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider = ({ children }: { children: ReactNode }) => {
  // Load favorites from localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('pokemon-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // State for comparison feature
  const [comparisonList, setComparisonList] = useState<number[]>([]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokemon-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        toast(`Removed #${id} from favorites`);
        return prev.filter(favId => favId !== id);
      } else {
        toast(`Added #${id} to favorites`);
        return [...prev, id];
      }
    });
  }, []);

  // Check if a Pokémon is in favorites
  const isFavorite = useCallback((id: number) => {
    return favorites.includes(id);
  }, [favorites]);

  // Toggle comparison list (max 2 Pokémon)
  const toggleComparison = useCallback((id: number) => {
    setComparisonList(prev => {
      if (prev.includes(id)) {
        return prev.filter(compId => compId !== id);
      } else {
        if (prev.length >= 2) {
          toast.warning("You can only compare two Pokémon. Remove one first.", {
            duration: 3000,
          });
          return prev;
        }
        return [...prev, id];
      }
    });
  }, []);

  // Check if a Pokémon is in comparison list
  const isInComparison = useCallback((id: number) => {
    return comparisonList.includes(id);
  }, [comparisonList]);

  // Clear comparison list
  const clearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  const contextValue = useMemo(() => ({
    favorites,
    toggleFavorite,
    isFavorite,
    comparisonList,
    toggleComparison,
    isInComparison,
    clearComparison
  }), [
    favorites,
    toggleFavorite,
    isFavorite,
    comparisonList,
    toggleComparison,
    isInComparison,
    clearComparison
  ]);

  return (
    <PokemonContext.Provider value={contextValue}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemonContext = () => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
};