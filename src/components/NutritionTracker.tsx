import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Flame, Scale, Heart, 
  BarChart3 
} from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import { cn } from '@/lib/utils';

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface DailyNutrition {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  recipes: string[];
}

const NutritionTracker: React.FC = () => {
  const { recentRecipes } = useRecipeStore();
  const [goals, setGoals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 50,
    carbs: 300,
    fat: 65,
    fiber: 25,
    sugar: 50,
    sodium: 2300
  });
  
  const [dailyData, setDailyData] = useState<DailyNutrition[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    // Calculate nutrition from recent recipes
    const nutritionMap = new Map<string, DailyNutrition>();
    
    recentRecipes.forEach(recipe => {
      if (!recipe.nutrition?.nutrients) return;
      
      const date = new Date().toISOString().split('T')[0]; // Today for demo
      
      if (!nutritionMap.has(date)) {
        nutritionMap.set(date, {
          date,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
          recipes: []
        });
      }
      
      const daily = nutritionMap.get(date)!;
      const nutrients = recipe.nutrition.nutrients;
      
      daily.calories += nutrients.find(n => n.name === 'Calories')?.amount || 0;
      daily.protein += nutrients.find(n => n.name === 'Protein')?.amount || 0;
      daily.carbs += nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0;
      daily.fat += nutrients.find(n => n.name === 'Fat')?.amount || 0;
      daily.fiber += nutrients.find(n => n.name === 'Fiber')?.amount || 0;
      daily.sugar += nutrients.find(n => n.name === 'Sugar')?.amount || 0;
      daily.sodium += nutrients.find(n => n.name === 'Sodium')?.amount || 0;
      daily.recipes.push(recipe.id);
    });
    
    setDailyData(Array.from(nutritionMap.values()));
  }, [recentRecipes]);

  const todayData = dailyData.find(d => d.date === selectedDate) || {
    date: selectedDate,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    recipes: []
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    if (percentage >= 50) return 'text-blue-600';
    return 'text-green-600';
  };

  const nutritionItems = [
    { key: 'calories', label: 'Calories', icon: Flame, unit: 'kcal', color: 'orange' },
    { key: 'protein', label: 'Protein', icon: Heart, unit: 'g', color: 'red' },
    { key: 'carbs', label: 'Carbs', icon: BarChart3, unit: 'g', color: 'blue' },
    { key: 'fat', label: 'Fat', icon: Scale, unit: 'g', color: 'yellow' },
    { key: 'fiber', label: 'Fiber', icon: BarChart3, unit: 'g', color: 'green' },
    { key: 'sugar', label: 'Sugar', icon: Heart, unit: 'g', color: 'pink' },
    { key: 'sodium', label: 'Sodium', icon: Scale, unit: 'mg', color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nutrition Tracker</h1>
          <p className="text-muted-foreground">Track your daily nutritional intake</p>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Target className="h-4 w-4" />
            Set Goals
          </button>
        </div>
      </div>

      {/* Today's Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {nutritionItems.map(item => {
          const Icon = item.icon;
          const current = todayData[item.key as keyof DailyNutrition] as number;
          const goal = goals[item.key as keyof NutritionGoals] as number;
          const percentage = getProgressPercentage(current, goal);
          const progressColor = getProgressColor(percentage);
          
          return (
            <div key={item.key} className="bg-card border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{item.label}</h3>
                </div>
                <span className={`text-sm font-medium ${progressColor}`}>
                  {current.toFixed(1)} / {goal} {item.unit}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Daily Goal</span>
                  <span>{percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      percentage >= 90 ? 'bg-red-500' :
                      percentage >= 75 ? 'bg-yellow-500' :
                      percentage >= 50 ? 'bg-blue-500' : 'bg-green-500'
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Weekly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Weekly Trend</h2>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const date = new Date();
            date.setDate(date.getDate() - date.getDay() + index + 1);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = dailyData.find(d => d.date === dateStr);
            
            return (
              <div key={day} className="text-center p-3 bg-secondary/50 rounded-lg">
                <div className="text-xs font-medium mb-1">{day}</div>
                <div className="text-lg font-bold text-primary">
                  {dayData?.calories.toFixed(0) || '0'}
                </div>
                <div className="text-xs text-muted-foreground">kcal</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recipe Breakdown */}
      {todayData.recipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Today's Recipes</h2>
          <div className="space-y-3">
            {todayData.recipes.map(recipeId => {
              const recipe = recentRecipes.find(r => r.id === recipeId);
              if (!recipe) return null;
              
              return (
                <div key={recipeId} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{recipe.title}</h4>
                    <div className="text-sm text-muted-foreground">
                      {recipe.readyInMinutes} min • {recipe.servings} servings
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      {recipe.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount.toFixed(0) || '0'} kcal
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Goals Modal */}
      {showGoalModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-card border rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Set Nutrition Goals</h2>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-2 rounded-lg hover:bg-accent"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {nutritionItems.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.key}>
                    <label className="flex items-center gap-2 font-medium mb-2">
                      <Icon className="h-4 w-4" />
                      {item.label} ({item.unit}/day)
                    </label>
                    <input
                      type="number"
                      value={goals[item.key as keyof NutritionGoals] as number}
                      onChange={(e) => setGoals(prev => ({
                        ...prev,
                        [item.key]: parseFloat(e.target.value) || 0
                      }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={() => setShowGoalModal(false)}
              className="w-full mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Save Goals
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default NutritionTracker;
