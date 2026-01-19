import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  Clock, Users, ChefHat, Heart, Share2, 
  ArrowLeft, Star, CheckCircle, Play, BarChart3
} from 'lucide-react';
import { recipeApi } from '@/lib/api';
import { useRecipeStore } from '@/store/recipeStore';
import { Recipe } from '@/types/recipe';
import CookingMode from '@/components/CookingMode';
import RecipeComparison from '@/components/RecipeComparison';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite, addToRecentRecipes } = useRecipeStore();
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const { data: recipe, isLoading, error } = useQuery(
    ['recipe', id],
    () => recipeApi.getRecipeById(id!),
    {
      enabled: !!id,
      onSuccess: (data: Recipe) => {
        addToRecentRecipes(data);
      },
    }
  ) as { data: Recipe | undefined; isLoading: boolean; error: any };

  const handleFavoriteToggle = () => {
    if (!recipe) return;
    
    if (isFavorite(recipe.id)) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share && recipe) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this amazing recipe: ${recipe.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <h2 className="text-2xl font-bold mb-4">Recipe not found</h2>
        <p className="text-muted-foreground mb-6">
          The recipe you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/search')}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Browse Recipes
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFavoriteToggle}
            className="p-2 rounded-lg border hover:bg-accent"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite(recipe.id) ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-lg border hover:bg-accent"
          >
            <Share2 className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowCookingMode(true)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-accent"
          >
            <Play className="h-4 w-4" />
            Cooking Mode
          </button>
          
          <button
            onClick={() => setShowComparison(true)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-accent"
          >
            <BarChart3 className="h-4 w-4" />
            Compare
          </button>
        </div>
      </div>

      {/* Recipe Header */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="aspect-video rounded-xl overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>
            
            {recipe.summary && (
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            )}
          </div>

          {/* Recipe Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card rounded-lg border">
              <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="font-semibold">{recipe.readyInMinutes || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            
            <div className="text-center p-4 bg-card rounded-lg border">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="font-semibold">{recipe.servings || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Servings</div>
            </div>
            
            <div className="text-center p-4 bg-card rounded-lg border">
              <ChefHat className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="font-semibold">{recipe.extendedIngredients?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Ingredients</div>
            </div>
            
            <div className="text-center p-4 bg-card rounded-lg border">
              <Star className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="font-semibold">{recipe.spoonacularScore || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>

          {/* Diets and Tags */}
          <div className="space-y-3">
            {recipe.diets && recipe.diets.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Diets</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.diets.map((diet) => (
                    <span
                      key={diet}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {diet}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {recipe.dishTypes && recipe.dishTypes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Dish Types</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.dishTypes.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Ingredients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-xl border p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {recipe.extendedIngredients?.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <span>{ingredient.original}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Instructions */}
      {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Instructions</h2>
          <div className="space-y-6">
            {recipe.analyzedInstructions.map((instruction, instructionIndex) => (
              <div key={instructionIndex}>
                {instruction.name && (
                  <h3 className="text-lg font-semibold mb-4">{instruction.name}</h3>
                )}
                <div className="space-y-4">
                  {instruction.steps.map((step, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="flex gap-4 p-4 rounded-lg bg-secondary/50"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <p className="leading-relaxed">{step.step}</p>
                        {step.ingredients && step.ingredients.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {step.ingredients.map((ingredient) => (
                              <span
                                key={ingredient.id}
                                className="text-xs px-2 py-1 bg-background rounded"
                              >
                                {ingredient.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Nutrition Information */}
      {recipe.nutrition && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-xl border p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Nutrition Information</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipe.nutrition.nutrients.map((nutrient) => (
              <div
                key={nutrient.name}
                className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg"
              >
                <span className="font-medium">{nutrient.name}</span>
                <span className="text-sm text-muted-foreground">
                  {nutrient.amount} {nutrient.unit}
                  {nutrient.percentOfDailyNeeds && (
                    <span className="ml-2">({nutrient.percentOfDailyNeeds}%)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Source Link */}
      {recipe.sourceUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            View Original Recipe
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </a>
        </motion.div>
      )}

      {/* Cooking Mode Modal */}
      {showCookingMode && recipe && (
        <CookingMode
          recipe={recipe}
          onClose={() => setShowCookingMode(false)}
        />
      )}

      {/* Comparison Modal */}
      {showComparison && recipe && (
        <RecipeComparison
          recipes={[recipe]}
          onClose={() => setShowComparison(false)}
        />
      )}
    </motion.div>
  );
};

export default RecipeDetailPage;
