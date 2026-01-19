import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { SearchFilters } from '@/types/recipe';
import { cuisineOptions, dietOptions, intoleranceOptions, mealTypeOptions } from '@/lib/api';
import { cn } from '@/lib/utils';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, loading, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    addRecipeInformation: true,
    addRecipeInstructions: true,
    addRecipeNutrition: false,
    number: 24,
    sort: 'random',
    sortDirection: 'desc',
  });

  const handleSearch = () => {
    onSearch({ ...filters, query });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      addRecipeInformation: true,
      addRecipeInstructions: true,
      addRecipeNutrition: false,
      number: 24,
      sort: 'random',
      sortDirection: 'desc',
    });
    setQuery('');
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="space-y-4">
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search recipes, ingredients, or cuisines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {(query || Object.entries(filters).some(([key, value]) => 
            key !== 'addRecipeInformation' && key !== 'addRecipeInstructions' && 
            key !== 'addRecipeNutrition' && key !== 'number' && key !== 'sort' && 
            key !== 'sortDirection' && value
          )) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="rounded-lg border border-border bg-card p-6 space-y-6">
                {/* Cuisine */}
                <div>
                  <label className="block text-sm font-medium mb-2">Cuisine</label>
                  <select
                    value={filters.cuisine || ''}
                    onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">All Cuisines</option>
                    {cuisineOptions.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                {/* Diet */}
                <div>
                  <label className="block text-sm font-medium mb-2">Diet</label>
                  <select
                    value={filters.diet || ''}
                    onChange={(e) => handleFilterChange('diet', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">No Diet Restriction</option>
                    {dietOptions.map(diet => (
                      <option key={diet} value={diet}>{diet}</option>
                    ))}
                  </select>
                </div>

                {/* Meal Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Meal Type</label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">All Meal Types</option>
                    {mealTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Intolerances */}
                <div>
                  <label className="block text-sm font-medium mb-2">Intolerances</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {intoleranceOptions.map(intolerance => (
                      <label key={intolerance} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.intolerances?.includes(intolerance) || false}
                          onChange={(e) => {
                            const current = filters.intolerances || [];
                            if (e.target.checked) {
                              handleFilterChange('intolerances', [...current, intolerance]);
                            } else {
                              handleFilterChange('intolerances', current.filter(i => i !== intolerance));
                            }
                          }}
                          className="rounded border-input"
                        />
                        <span className="text-sm">{intolerance}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time and Servings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Ready Time (minutes)</label>
                    <input
                      type="number"
                      min="5"
                      max="240"
                      value={filters.maxReadyTime || ''}
                      onChange={(e) => handleFilterChange('maxReadyTime', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Any"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Servings</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={filters.minServings || ''}
                      onChange={(e) => handleFilterChange('minServings', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Any"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <select
                      value={filters.sort || 'random'}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="random">Random</option>
                      <option value="meta-score">Meta Score</option>
                      <option value="popularity">Popularity</option>
                      <option value="healthiness">Healthiness</option>
                      <option value="price">Price</option>
                      <option value="time">Cooking Time</option>
                      <option value="random">Random</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort Direction</label>
                    <select
                      value={filters.sortDirection || 'desc'}
                      onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdvancedSearch;
