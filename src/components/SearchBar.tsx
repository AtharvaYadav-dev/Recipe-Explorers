import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import { recipeApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search recipes...",
  className,
  showSuggestions = true,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const { searchHistory, addToSearchHistory } = useRecipeStore();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length >= 2 && showSuggestions) {
        try {
          const results = await recipeApi.autocompleteRecipeSearch(value, 5);
          setSuggestions(results);
          setShowSuggestionsList(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestionsList(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [value, showSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      addToSearchHistory(value.trim());
      onSearch(value.trim());
      setShowSuggestionsList(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    addToSearchHistory(suggestion);
    onSearch(suggestion);
    setShowSuggestionsList(false);
  };

  const handleHistoryClick = (query: string) => {
    onChange(query);
    onSearch(query);
    setShowSuggestionsList(false);
  };

  const clearInput = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestionsList(false);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => value.length >= 2 && setShowSuggestionsList(true)}
            placeholder={placeholder}
            className={cn(
              "w-full pl-10 pr-10 input-field",
              "focus:ring-2 focus:ring-primary focus:border-transparent"
            )}
          />
          {value && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {showSuggestionsList && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && suggestions.length === 0 && (
              <div className="p-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                  Recent Searches
                </div>
                {searchHistory.slice(0, 5).map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(query)}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{query}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
