import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TypeFilterMultiProps {
  selectedTypes: string[];
  types: string[];
  onTypeToggle: (type: string) => void;
  onClearTypes: () => void;
}

const TypeFilterMulti: React.FC<TypeFilterMultiProps> = ({ 
  selectedTypes, 
  types, 
  onTypeToggle,
  onClearTypes
}) => {
  return (
    <div className="w-full space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full bg-white dark:bg-gray-800 border-2 border-pokedex-mediumGray dark:border-gray-700">
            Filter by Types
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800">
          <DropdownMenuLabel>Pokemon Types</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {types.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => onTypeToggle(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTypes.map(type => (
            <Badge 
              key={type} 
              variant="secondary" 
              className="capitalize flex items-center gap-1 cursor-pointer"
              onClick={() => onTypeToggle(type)}
            >
              {type}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearTypes} 
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default TypeFilterMulti;