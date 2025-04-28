
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="w-16 h-16 text-pokedex-red mb-4" />
      <h2 className="text-xl font-bold text-pokedex-darkGray mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-500 mb-6 max-w-md">{message}</p>
      <Button onClick={onRetry} className="bg-pokedex-red hover:bg-pokedex-darkRed">
        Try Again
      </Button>
    </div>
  );
};

export default ErrorDisplay;
