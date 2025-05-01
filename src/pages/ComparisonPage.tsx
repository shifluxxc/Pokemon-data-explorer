import { useQuery } from '@tanstack/react-query';
import { getPokemonDetails } from '@/services/pokemonService';
import { usePokemonContext } from '@/contexts/PokemonContext';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import TypeBadge from '@/components/TypeBadge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ComparisonPage = () => {
  const { comparisonList, clearComparison } = usePokemonContext();

  // Fetch data for the comparison Pokémon
  const { 
    data: pokemon1, 
    isLoading: isLoading1, 
    error: error1 
  } = useQuery({
    queryKey: ['pokemon', comparisonList[0]],
    queryFn: () => getPokemonDetails(comparisonList[0]),
    enabled: comparisonList.length > 0,
  });

  const { 
    data: pokemon2, 
    isLoading: isLoading2, 
    error: error2 
  } = useQuery({
    queryKey: ['pokemon', comparisonList[1]],
    queryFn: () => getPokemonDetails(comparisonList[1]),
    enabled: comparisonList.length > 1,
  });

  const isLoading = isLoading1 || isLoading2;
  const error = error1 || error2;


  // Find the higher stat for comparison
  const getHigherStat = (stat1: number | undefined, stat2: number | undefined) => {
    if (stat1 === undefined || stat2 === undefined) return null;
    if (stat1 > stat2) return 'left';
    if (stat2 > stat1) return 'right';
    return 'equal';
  };

  if (comparisonList.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container py-6">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link to="/">← Back to All Pokémon</Link>
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-pokedex-mediumGray dark:border-gray-700 text-center">
            <h2 className="text-xl font-semibold mb-4">Pokémon Comparison</h2>
            <p className="mb-6">Select two Pokémon to compare their stats side by side.</p>
            <p className="text-sm text-gray-500">
              You've selected {comparisonList.length} of 2 required Pokémon.
            </p>
            <Button asChild className="mt-4">
              <Link to="/">Select Pokémon</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

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

  if (error || !pokemon1 || !pokemon2) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container py-6">
          <ErrorDisplay 
            message={error instanceof Error ? error.message : "Failed to load comparison data"} 
            onRetry={() => window.location.reload()}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container py-6">
        <div className="mb-6 flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/">← Back to All Pokémon</Link>
          </Button>
          <Button variant="destructive" onClick={clearComparison}>
            Clear Comparison
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-pokedex-mediumGray dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-center mb-6">Pokémon Comparison</h2>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Left Pokemon */}
            <div className="col-span-1 flex flex-col items-center">
              <Link to={`/pokemon/${pokemon1.id}`} className="block text-center">
                <div className="bg-pokedex-lightGray dark:bg-gray-700 rounded-lg p-4 mb-3">
                  <img 
                    src={pokemon1.image} 
                    alt={pokemon1.name}
                    className="h-48 w-48 mx-auto object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold capitalize mb-1">{pokemon1.name}</h3>
                <p className="text-sm mb-3">#{pokemon1.id.toString().padStart(3, '0')}</p>
              </Link>
              <div className="flex flex-wrap gap-2 justify-center">
                {pokemon1.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </div>
            
          {/* Stats Comparison (Middle) */}
<div className="col-span-1 flex flex-col justify-center">
  <h3 className="text-lg font-semibold text-center mb-4">Base Stats</h3>
  
  {pokemon1.stats && pokemon2.stats && pokemon1.stats.map((stat, index) => {
    const stat2 = pokemon2.stats?.[index];
    const higherStat = getHigherStat(stat.value, stat2?.value);
    const totalStat = stat.value + (stat2?.value || 0);
    const stat1Percentage = totalStat > 0 ? (stat.value / totalStat) * 100 : 0;
    const stat2Percentage = totalStat > 0 ? ((stat2?.value || 0) / totalStat) * 100 : 0;
    const color1 = "bg-slate-950";
    const color2 = "bg-gray-100";
    return (
      <div key={stat.name} className="mb-4 px-2">
        <div className="text-center text-sm font-medium capitalize mb-2">{stat.name.replace('-', ' ')}</div>
        <div className="flex items-center">
          <div className={`text-right w-8 font-semibold ${higherStat === 'left' ? 'text-green-600 dark:text-green-400' : ''}`}>
            {stat.value}
          </div>
          <div className="w-full mx-2 flex relative">
            <div 
              className={`h-3 ${color1}`} 
              style={{ width: `${stat1Percentage}%` }}
            ></div>
            <div 
              className={`h-3 ${color2}`} 
              style={{ width: `${stat2Percentage}%` }}
            ></div>
          </div>
          <div className={`w-8 font-semibold ${higherStat === 'right' ? 'text-green-600 dark:text-green-400' : ''}`}>
            {stat2?.value || 0}
          </div>
        </div>
      </div>
    );
  })}
</div>
            
            {/* Right Pokemon */}
            <div className="col-span-1 flex flex-col items-center">
              <Link to={`/pokemon/${pokemon2.id}`} className="block text-center">
                <div className="bg-pokedex-lightGray dark:bg-gray-700 rounded-lg p-4 mb-3">
                  <img 
                    src={pokemon2.image} 
                    alt={pokemon2.name}
                    className="h-48 w-48 mx-auto object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold capitalize mb-1">{pokemon2.name}</h3>
                <p className="text-sm mb-3">#{pokemon2.id.toString().padStart(3, '0')}</p>
              </Link>
              <div className="flex flex-wrap gap-2 justify-center">
                {pokemon2.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Abilities Comparison */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="col-span-1 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2">Abilities</h3>
              <ul className="list-disc pl-5">
                {pokemon1.abilities?.map((ability) => (
                  <li key={ability} className="mb-1 capitalize">{ability.replace('-', ' ')}</li>
                ))}
              </ul>
            </div>
            
            <div className="col-span-1 flex items-center justify-center">
              <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
            </div>
            
            <div className="col-span-1 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2">Abilities</h3>
              <ul className="list-disc pl-5">
                {pokemon2.abilities?.map((ability) => (
                  <li key={ability} className="mb-1 capitalize">{ability.replace('-', ' ')}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComparisonPage;