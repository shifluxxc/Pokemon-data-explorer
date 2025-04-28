
import React from 'react';
import { cn } from "@/lib/utils";

interface TypeBadgeProps {
  type: string;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  return (
    <span 
      className={cn(
        "inline-block px-2 py-1 text-xs font-semibold rounded-full text-white capitalize",
        `bg-pokemonType-${type}`
      )}
      style={{ 
        // Fallback if the Tailwind class doesn't work
        backgroundColor: `var(--pokemon-type-${type}, #A8A77A)` 
      }}
    >
      {type}
    </span>
  );
};

export default TypeBadge;
