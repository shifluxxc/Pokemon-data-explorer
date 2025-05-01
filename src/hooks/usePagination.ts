
import { useState, useMemo, useCallback, useEffect } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

export const usePagination = <T>({ data, itemsPerPage = 12 }: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / itemsPerPage));
  }, [data.length, itemsPerPage]);
  
  // Ensure currentPage is always valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);
  
  // Get current page data
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, currentPage, itemsPerPage]);
  
  // Page change handlers
  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);
  
  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [goToPage, currentPage]);
  
  const goToPrevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [goToPage, currentPage]);
  
  // Generate page numbers for navigation
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust to always show 3 pages in the middle
      if (startPage === 2) endPage = Math.min(4, totalPages - 1);
      if (endPage === totalPages - 1) startPage = Math.max(2, totalPages - 3);
      
      // Add ellipsis if needed
      if (startPage > 2) pages.push(-1); // -1 represents an ellipsis
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) pages.push(-2); // -2 represents an ellipsis
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  }, [currentPage, totalPages]);
  
  return {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    goToNextPage,
    goToPrevPage,
    pageNumbers,
  };
};