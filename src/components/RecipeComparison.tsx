import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, BarChart3, Clock, Users, Flame, Scale 
} from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { cn } from '@/lib/utils';

interface RecipeComparisonProps {
  recipes: Recipe[];
  onClose: () => void;
}

const RecipeComparison: React.FC<RecipeComparisonProps> = ({ recipes, onClose }) => {
  const [selectedMetrics, setSelectedMetrics] = useState([
    'readyTime', 'servings', 'calories', 'cost'
  ]);

  if (recipes.length === 0) return null;

  const getMetricValue = (recipe: Recipe, metric: string) => {
    switch (metric) {
      case 'readyTime':
        return recipe.readyInMinutes || 0;
      case 'servings':
        return recipe.servings || 0;
      case 'calories':
        return recipe.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount || 0;
      case 'cost':
        return 0; // Cost calculation would need price data from API
      case 'healthScore':
        return recipe.healthScore || 0;
      case 'spoonacularScore':
        return recipe.spoonacularScore || 0;
      default:
        return 0;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'readyTime': return 'Cooking Time';
      case 'servings': return 'Servings';
      case 'calories': return 'Calories';
      case 'cost': return 'Est. Cost';
      case 'healthScore': return 'Health Score';
      case 'spoonacularScore': return 'Spoonacular Score';
      default: return metric;
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'readyTime': return Clock;
      case 'servings': return Users;
      case 'calories': return Flame;
      case 'cost': return Scale;
      default: return BarChart3;
    }
  };

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'readyTime': return 'min';
      case 'servings': return '';
      case 'calories': return 'kcal';
      case 'cost': return '$';
      case 'healthScore': return '';
      case 'spoonacularScore': return '';
      default: return '';
    }
  };

  const getBestRecipe = (metric: string) => {
    const values = recipes.map(r => getMetricValue(r, metric));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // For time and cost, lower is better
    if (metric === 'readyTime' || metric === 'cost') {
      return recipes.findIndex(r => getMetricValue(r, metric) === minValue);
    }
    // For scores and servings, higher is better
    return recipes.findIndex(r => getMetricValue(r, metric) === maxValue);
  };

  const availableMetrics = [
    { id: 'readyTime', label: 'Cooking Time', icon: Clock },
    { id: 'servings', label: 'Servings', icon: Users },
    { id: 'calories', label: 'Calories', icon: Flame },
    { id: 'cost', label: 'Est. Cost', icon: Scale },
    { id: 'healthScore', label: 'Health Score', icon: BarChart3 },
    { id: 'spoonacularScore', label: 'Spoonacular Score', icon: BarChart3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Recipe Comparison</h2>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-accent"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Metrics Selector */}
      <div className="p-4 border-b">
        <h3 className="font-medium mb-3">Compare by:</h3>
        <div className="flex flex-wrap gap-2">
          {availableMetrics.map(metric => {
            const Icon = metric.icon;
            return (
              <button
                key={metric.id}
                onClick={() => {
                  if (selectedMetrics.includes(metric.id)) {
                    setSelectedMetrics(prev => prev.filter(m => m !== metric.id));
                  } else if (selectedMetrics.length < 4) {
                    setSelectedMetrics(prev => [...prev, metric.id]);
                  }
                }}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
                  selectedMetrics.includes(metric.id)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                {metric.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="min-w-max">
          {/* Recipe Headers */}
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(${recipes.length}, 1fr)` }}>
            <div className="font-medium">Recipe</div>
            {recipes.map((recipe, index) => (
              <div key={recipe.id} className="text-center">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-20 h-20 object-cover rounded-lg mx-auto mb-2"
                />
                <div className="font-medium text-sm">{recipe.title}</div>
              </div>
            ))}
          </div>

          {/* Metrics Rows */}
          {selectedMetrics.map(metric => {
            const Icon = getMetricIcon(metric);
            const bestRecipeIndex = getBestRecipe(metric);
            
            return (
              <div key={metric} className="grid gap-4 py-3 border-b" style={{ gridTemplateColumns: `200px repeat(${recipes.length}, 1fr)` }}>
                <div className="flex items-center gap-2 font-medium">
                  <Icon className="h-4 w-4" />
                  {getMetricLabel(metric)}
                </div>
                
                {recipes.map((recipe, index) => {
                  const value = getMetricValue(recipe, metric);
                  const isBest = index === bestRecipeIndex;
                  const unit = getMetricUnit(metric);
                  
                  return (
                    <div
                      key={recipe.id}
                      className={cn(
                        'text-center p-2 rounded-lg',
                        isBest ? 'bg-green-50 border border-green-200' : 'bg-secondary/50'
                      )}
                    >
                      <div className="text-lg font-semibold">
                        {value.toFixed(metric === 'cost' ? 2 : 0)}{unit}
                      </div>
                      {isBest && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          Best Value
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 border-t bg-card">
        <h3 className="font-medium mb-3">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedMetrics.map(metric => {
            const bestRecipeIndex = getBestRecipe(metric);
            const bestRecipe = recipes[bestRecipeIndex];
            const Icon = getMetricIcon(metric);
            
            return (
              <div key={metric} className="p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{getMetricLabel(metric)}</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{bestRecipe.title}</div>
                  <div className="text-muted-foreground">
                    {getMetricValue(bestRecipe, metric).toFixed(metric === 'cost' ? 2 : 0)}
                    {getMetricUnit(metric)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeComparison;
