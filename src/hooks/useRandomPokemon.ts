
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useRandomPokemon = (
  pokemonCount: number = 150, 
  isLoading: boolean = false
) => {
  const navigate = useNavigate();
  
  const showRandomPokemon = useCallback(() => {
    if (isLoading) {
      toast.info("Loading Pokémon data...");
      return;
    }
    
    if (pokemonCount <= 0) {
      toast.error("No Pokémon available");
      return;
    }
    
    // Generate random ID between 1 and pokemonCount
    const randomId = Math.floor(Math.random() * pokemonCount) + 1;
    
    // Navigate to the detail view
    navigate(`/pokemon/${randomId}`);
    toast.success(`Random Pokémon selected!`);
  }, [pokemonCount, isLoading, navigate]);
  
  return { showRandomPokemon };
};