
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Link, useLocation } from 'react-router-dom';
import { usePokemonContext } from '@/contexts/PokemonContext';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const { comparisonList } = usePokemonContext();
  const location = useLocation();
  
  return (
    <header className="bg-pokedex-red dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
      <div className="container py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Pokédex</Link>
        
        <nav className="flex items-center gap-4 mt-4 sm:mt-0">
          <Button 
            variant={location.pathname === '/' ? 'secondary' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/">Home</Link>
          </Button>
          
          <Button 
            variant={location.pathname === '/favorites' ? 'secondary' : 'ghost'}
            size="sm"
            asChild
            className="gap-2"
          >
            <Link to="/favorites">
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
          </Button>
          
          {comparisonList.length > 0 && (
            <Button 
              variant={location.pathname === '/compare' ? 'secondary' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/compare">
                Compare ({comparisonList.length}/2)
              </Link>
            </Button>
          )}
          
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;