import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { SearchResult } from '@/types/recipe';
import { useRecipeStore } from '@/store/recipeStore';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: SearchResult;
  onClick?: () => void;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, className }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useRecipeStore();
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(recipe.id)) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group cursor-pointer overflow-hidden rounded-xl border bg-card shadow-md transition-all duration-300 hover:shadow-xl',
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <button
          onClick={handleFavoriteToggle}
          className="absolute right-2 top-2 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110"
          aria-label="Toggle favorite"
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors duration-200',
              isFavorite(recipe.id)
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600'
            )}
          />
        </button>

        {recipe.usedIngredientCount !== undefined && (
          <div className="absolute left-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
            {recipe.usedIngredientCount} ingredients
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold text-lg leading-tight">
          {recipe.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            {recipe.likes && (
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{recipe.likes}</span>
              </div>
            )}
          </div>
        </div>

        {recipe.usedIngredientCount !== undefined && (
          <div className="mt-2 text-xs text-muted-foreground">
            {recipe.missedIngredientCount === 0
              ? 'You have all ingredients!'
              : `Missing ${recipe.missedIngredientCount} ingredients`}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecipeCard;