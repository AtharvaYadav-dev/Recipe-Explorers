import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Heart, ArrowLeft } from 'lucide-react';
import { recipeApi } from '@/lib/api';
import { useRecipeStore } from '@/store/recipeStore';
import RecipeCard from '@/components/RecipeCard';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useRecipeStore();

  const { data: favoriteRecipes, isLoading } = useQuery(
    ['favoriteRecipes', favorites],
    async () => {
      if (favorites.length === 0) return [];
      const recipes = await Promise.all(
        favorites.map(id => recipeApi.getRecipeById(id))
      );
      return recipes;
    },
    {
      enabled: favorites.length > 0,
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <div>
            <h1 className="text-3xl font-bold">Favorite Recipes</h1>
            <p className="text-muted-foreground">
              {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved
            </p>
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      {favorites.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring and save your favorite recipes to see them here.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Explore Recipes
          </button>
        </motion.div>
      )}

      {/* Favorites Grid */}
      {favoriteRecipes && favoriteRecipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {favoriteRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <RecipeCard
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesPage;
