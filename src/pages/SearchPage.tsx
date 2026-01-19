import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Search, Grid, List, ArrowUpDown } from 'lucide-react';
import { recipeApi } from '@/lib/api';
import RecipeCard from '@/components/RecipeCard';
import AdvancedSearch from '@/components/AdvancedSearch';
import { SearchFilters, SearchResult } from '@/types/recipe';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('random');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    addRecipeInformation: true,
    addRecipeInstructions: true,
    addRecipeNutrition: false,
    number: 24,
    offset: 0,
    sort: 'random',
    sortDirection: 'desc',
  });

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
    } else if (location.search) {
      const params = new URLSearchParams(location.search);
      const query = params.get('q');
      if (query) {
        setFilters(prev => ({ ...prev, query }));
      }
    }
  }, [location]);

  const { data: searchResults, isLoading, error } = useQuery(
    ['searchRecipes', filters],
    () => recipeApi.searchRecipes(filters),
    {
      enabled: !!filters.query || Object.keys(filters).some(key => 
        key !== 'query' && key !== 'addRecipeInformation' && 
        key !== 'addRecipeInstructions' && key !== 'addRecipeNutrition' &&
        key !== 'number' && key !== 'offset' && key !== 'sort' && 
        key !== 'sortDirection' && filters[key as keyof SearchFilters]
      ),
      keepPreviousData: true,
    }
  ) as { data: SearchResult[] | undefined; isLoading: boolean; error: any };

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters({ ...newFilters, offset: 0 });
    setCurrentPage(1);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    setFilters(prev => ({ ...prev, sort, offset: 0 }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * (filters.number || 24);
    setFilters(prev => ({ ...prev, offset }));
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = searchResults ? Math.ceil(searchResults.length / (filters.number || 24)) : 0;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-bold">Search Recipes</h1>
        <AdvancedSearch onSearch={handleSearch} loading={isLoading} />
      </motion.div>

      {/* Results Header */}
      {searchResults && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <p className="text-lg font-medium">
              {searchResults.length} recipes found
            </p>
            {filters.query && (
              <p className="text-sm text-muted-foreground">
                for "{filters.query}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="bg-transparent outline-none text-sm"
              >
                <option value="random">Random</option>
                <option value="meta-score">Meta Score</option>
                <option value="popularity">Popularity</option>
                <option value="healthiness">Healthiness</option>
                <option value="price">Price</option>
                <option value="time">Cooking Time</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-red-500 mb-4">Error loading recipes</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* No Results */}
      {!isLoading && !error && searchResults && searchResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => setFilters({
              addRecipeInformation: true,
              addRecipeInstructions: true,
              addRecipeNutrition: false,
              number: 24,
              offset: 0,
              sort: 'random',
              sortDirection: 'desc',
            })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Clear Filters
          </button>
        </motion.div>
      )}

      {/* Results Grid/List */}
      {searchResults && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {searchResults.map((recipe: SearchResult) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1 }}
            >
              <RecipeCard
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className={viewMode === 'list' ? 'flex flex-row' : ''}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center items-center gap-2 mt-8"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-primary text-primary-foreground'
                      : 'border hover:bg-accent'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            Next
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SearchPage;
