import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePokemonDetails, useSpeciesDetails, useEvolutionChain, processEvolutionChain } from '@/services/pokemonService';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import TypeBadge from '@/components/TypeBadge';
import { usePokemonContext } from '@/contexts/PokemonContext';
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = usePokemonContext();
  
  const numericId = parseInt(id || '0', 10);
  const isFav = isFavorite(numericId);
  
  // Fetch Pokemon details using React Query hooks
  const { 
    data: pokemon, 
    isLoading: isLoadingPokemon, 
    error: pokemonError,
    refetch: refetchPokemon
  } = usePokemonDetails(id || '');
  
  // Fetch species data when Pokemon data is available
  const {
    data: species,
    isLoading: isLoadingSpecies,
    error: speciesError
  } = useSpeciesDetails(pokemon?.speciesUrl);
  
  // Fetch evolution chain when species data is available
  const {
    data: evolutionData,
    isLoading: isLoadingEvolution,
    error: evolutionError
  } = useEvolutionChain(species?.evolution_chain?.url);
  
  const isLoading = isLoadingPokemon || isLoadingSpecies || isLoadingEvolution;
  const error = pokemonError || speciesError || evolutionError;
  
  const evolutions = evolutionData ? processEvolutionChain(evolutionData.chain) : [];
  
  // Navigation to previous/next Pokémon
  const goToPrevious = () => {
    const prevId = numericId - 1;
    if (prevId >= 1) {
      navigate(`/pokemon/${prevId}`);
    }
  };
  
  const goToNext = () => {
    const nextId = numericId + 1;
    if (nextId <= 150) {
      navigate(`/pokemon/${nextId}`);
    }
  };
  
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
  
  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container py-6">
          <ErrorDisplay 
            message={error instanceof Error ? error.message : "Failed to load Pokémon details"} 
            onRetry={refetchPokemon} 
          />
        </main>
      </div>
    );
  }
  
  // Stats color mapping for visual representation
  const getStatColor = (value: number) => {
    if (value < 50) return "bg-red-500";
    if (value < 70) return "bg-orange-500";
    if (value < 90) return "bg-yellow-500";
    if (value < 110) return "bg-green-500";
    if (value < 130) return "bg-blue-500";
    return "bg-purple-500";
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container py-6">
        <div className="mb-4 flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/">← Back to List</Link>
          </Button>
          
          {numericId > 1 && (
            <Button variant="ghost" onClick={goToPrevious}>
              Previous Pokémon
            </Button>
          )}
          
          {numericId < 150 && (
            <Button variant="ghost" onClick={goToNext}>
              Next Pokémon
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pokemon image and basic info */}
          <Card className="col-span-1 bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl capitalize">{pokemon.name}</CardTitle>
                <CardDescription>#{pokemon.id.toString().padStart(3, '0')}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(pokemon.id)}
                className="hover:bg-transparent"
              >
                <Heart 
                  className={`h-6 w-6 transition-all ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-pokedex-lightGray dark:bg-gray-700 rounded-lg p-4 mb-4 w-full flex justify-center">
                <img 
                  src={pokemon.image} 
                  alt={pokemon.name}
                  className="h-64 w-64 object-contain"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Pokemon stats */}
          <Card className="col-span-1 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Base Stats</CardTitle>
            </CardHeader>
            <CardContent>
              {pokemon.stats && pokemon.stats.map((stat) => (
                <div key={stat.name} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{stat.name.replace('-', ' ')}</span>
                    <span className="text-sm font-medium">{stat.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className={`${getStatColor(stat.value)} h-2.5 rounded-full`} 
                      style={{ width: `${Math.min(100, (stat.value / 255) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Pokemon abilities and moves */}
          <Card className="col-span-1 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Abilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 mb-6">
                {pokemon.abilities && pokemon.abilities.map((ability) => (
                  <li key={ability} className="mb-1 capitalize">{ability.replace('-', ' ')}</li>
                ))}
              </ul>
              
              <CardTitle className="mb-3">Moves</CardTitle>
              <div className="max-h-60 overflow-y-auto pr-2">
                <div className="flex flex-wrap gap-2">
                  {pokemon.moves && pokemon.moves.slice(0, 20).map((move) => (
                    <span 
                      key={move} 
                      className="bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full text-xs capitalize"
                    >
                      {move.replace('-', ' ')}
                    </span>
                  ))}
                  {pokemon.moves && pokemon.moves.length > 20 && (
                    <span className="text-sm text-gray-500">
                      +{pokemon.moves.length - 20} more moves
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Evolution chain */}
        {evolutions.length > 0 && (
          <Card className="mt-6 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Evolution Chain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {evolutions.map((evolution, index) => (
                  <React.Fragment key={evolution.id}>
                    <Link to={`/pokemon/${evolution.id}`} className="text-center">
                      <div 
                        className={`p-4 rounded-lg ${evolution.id === pokemon.id ? 'bg-pokedex-lightGray dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-700/50'}`}
                      >
                        <img 
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`} 
                          alt={evolution.name}
                          className="h-24 w-24 mx-auto"
                        />
                      </div>
                      <p className="mt-2 capitalize">{evolution.name}</p>
                    </Link>
                    
                    {/* Add arrow between evolutions */}
                    {index < evolutions.length - 1 && (
                      <div className="text-xl font-bold">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DetailPage;