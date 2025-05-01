
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SortControlProps {
  sortBy: 'id' | 'name';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'id' | 'name', sortOrder: 'asc' | 'desc') => void;
}

const SortControl: React.FC<SortControlProps> = ({ sortBy, sortOrder, onSortChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full bg-white dark:bg-gray-800 border-2 border-pokedex-mediumGray dark:border-gray-700">
          Sort: {sortBy === 'id' ? 'ID' : 'Name'} ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup 
          value={sortBy} 
          onValueChange={(value) => onSortChange(value as 'id' | 'name', sortOrder)}
        >
          <DropdownMenuRadioItem value="id">ID Number</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Order</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuRadioGroup 
          value={sortOrder}
          onValueChange={(value) => onSortChange(sortBy, value as 'asc' | 'desc')}
        >
          <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortControl;