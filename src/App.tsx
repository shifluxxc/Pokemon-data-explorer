
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { PokemonProvider } from "./contexts/PokemonContext";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const DetailPage = lazy(() => import("./pages/DetailPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const ComparisonPage = lazy(() => import("./pages/ComparisonPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <ThemeProvider defaultTheme="system" attribute="class">
      <QueryClientProvider client={queryClient}>
        <PokemonProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/pokemon/:id" element={<DetailPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/compare" element={<ComparisonPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </PokemonProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;