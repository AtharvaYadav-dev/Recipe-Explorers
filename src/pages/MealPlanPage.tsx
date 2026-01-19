import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import { MealPlan } from '@/types/recipe';

const MealPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { mealPlans, addMealPlan, deleteMealPlan } = useRecipeStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddMeal, setShowAddMeal] = useState(false);

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getMealPlanForDate = (date: string) => {
    return mealPlans.find(mp => mp.date === date);
  };

  const handleAddMeal = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    // This would open a modal to select a recipe
    // For now, we'll just show a placeholder
    console.log(`Add ${mealType} for ${date}`);
  };

  const handleDeleteMeal = (mealPlanId: string) => {
    deleteMealPlan(mealPlanId);
  };

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
            <h1 className="text-3xl font-bold">Meal Planner</h1>
            <p className="text-muted-foreground">Plan your meals for the week</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
      </motion.div>

      {/* Week View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-7 gap-4"
      >
        {weekDates.map((date, index) => {
          const mealPlan = getMealPlanForDate(date);
          const dateObj = new Date(date);
          const isToday = date === new Date().toISOString().split('T')[0];

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`bg-card border rounded-xl p-4 space-y-3 ${
                isToday ? 'ring-2 ring-primary' : ''
              }`}
            >
              {/* Date Header */}
              <div className="text-center">
                <div className="font-semibold">{weekDays[index]}</div>
                <div className={`text-sm ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                  {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Meals */}
              <div className="space-y-2">
                {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                  <div key={mealType} className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground capitalize">
                      {mealType}
                    </div>
                    
                    {mealPlan?.meals[mealType] ? (
                      <div className="group relative">
                        <div
                          onClick={() => navigate(`/recipe/${mealPlan.meals[mealType]!.id}`)}
                          className="p-2 bg-secondary/50 rounded-lg text-xs cursor-pointer hover:bg-secondary transition-colors"
                        >
                          <div className="font-medium truncate">
                            {mealPlan.meals[mealType]!.title}
                          </div>
                          <div className="text-muted-foreground">
                            {mealPlan.meals[mealType]!.readyInMinutes} min
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteMeal(mealPlan.id)}
                          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-destructive text-destructive-foreground rounded-full"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddMeal(date, mealType)}
                        className="w-full p-2 border border-dashed border-muted-foreground/25 rounded-lg text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus className="h-3 w-3 mx-auto mb-1" />
                        Add {mealType}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {mealPlans.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No meal plans yet</h2>
          <p className="text-muted-foreground mb-6">
            Start planning your meals by adding recipes to your weekly schedule.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Browse Recipes
          </button>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <button
          onClick={() => navigate('/shopping-list')}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80"
        >
          <Clock className="h-4 w-4" />
          Generate Shopping List
        </button>
      </motion.div>
    </div>
  );
};

export default MealPlanPage;
