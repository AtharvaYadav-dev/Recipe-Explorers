import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe, SearchResult, SearchFilters, MealPlan, ShoppingListItem, UserPreferences } from '@/types/recipe';

interface RecipeStore {
  // Favorites
  favorites: string[];
  addToFavorites: (recipeId: string) => void;
  removeFromFavorites: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  
  // Search History
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  // Recent Recipes
  recentRecipes: Recipe[];
  addToRecentRecipes: (recipe: Recipe) => void;
  clearRecentRecipes: () => void;
  
  // Meal Plans
  mealPlans: MealPlan[];
  addMealPlan: (mealPlan: MealPlan) => void;
  updateMealPlan: (id: string, mealPlan: Partial<MealPlan>) => void;
  deleteMealPlan: (id: string) => void;
  getMealPlanByDate: (date: string) => MealPlan | undefined;
  
  // Shopping List
  shoppingList: ShoppingListItem[];
  addToShoppingList: (item: Omit<ShoppingListItem, 'id' | 'checked'>) => void;
  updateShoppingListItem: (id: string, updates: Partial<ShoppingListItem>) => void;
  removeShoppingListItem: (id: string) => void;
  toggleShoppingListItem: (id: string) => void;
  clearShoppingList: () => void;
  getCheckedItems: () => ShoppingListItem[];
  getUncheckedItems: () => ShoppingListItem[];
  
  // User Preferences
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // UI State
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  clearSearchFilters: () => void;
  
  // Cache
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  clearSearchResults: () => void;
}

const defaultPreferences: UserPreferences = {
  favoriteRecipes: [],
  dietaryRestrictions: [],
  favoriteCuisines: [],
  intolerances: [],
  mealPlanPreferences: {
    breakfast: true,
    lunch: true,
    dinner: true,
    snack: false,
  },
};

const defaultFilters: SearchFilters = {
  addRecipeInformation: true,
  addRecipeInstructions: true,
  addRecipeNutrition: false,
  number: 24,
  offset: 0,
  sort: 'random',
  sortDirection: 'desc',
};

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      // Favorites
      favorites: [],
      addToFavorites: (recipeId: string) =>
        set((state) => ({
          favorites: state.favorites.includes(recipeId)
            ? state.favorites
            : [...state.favorites, recipeId],
        })),
      removeFromFavorites: (recipeId: string) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== recipeId),
        })),
      isFavorite: (recipeId: string) => {
        const state = get();
        return state.favorites.includes(recipeId);
      },
      
      // Search History
      searchHistory: [],
      addToSearchHistory: (query: string) =>
        set((state) => {
          const filtered = state.searchHistory.filter((item) => item !== query);
          return {
            searchHistory: [query, ...filtered].slice(0, 10),
          };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
      
      // Recent Recipes
      recentRecipes: [],
      addToRecentRecipes: (recipe: Recipe) =>
        set((state) => {
          const filtered = state.recentRecipes.filter((r) => r.id !== recipe.id);
          return {
            recentRecipes: [recipe, ...filtered].slice(0, 20),
          };
        }),
      clearRecentRecipes: () => set({ recentRecipes: [] }),
      
      // Meal Plans
      mealPlans: [],
      addMealPlan: (mealPlan: MealPlan) =>
        set((state) => ({
          mealPlans: [...state.mealPlans.filter((mp) => mp.date !== mealPlan.date), mealPlan],
        })),
      updateMealPlan: (id: string, updates: Partial<MealPlan>) =>
        set((state) => ({
          mealPlans: state.mealPlans.map((mp) =>
            mp.id === id ? { ...mp, ...updates } : mp
          ),
        })),
      deleteMealPlan: (id: string) =>
        set((state) => ({
          mealPlans: state.mealPlans.filter((mp) => mp.id !== id),
        })),
      getMealPlanByDate: (date: string) => {
        const state = get();
        return state.mealPlans.find((mp) => mp.date === date);
      },
      
      // Shopping List
      shoppingList: [],
      addToShoppingList: (item: Omit<ShoppingListItem, 'id' | 'checked'>) =>
        set((state) => ({
          shoppingList: [
            ...state.shoppingList,
            { ...item, id: Math.random().toString(36).substr(2, 9), checked: false },
          ],
        })),
      updateShoppingListItem: (id: string, updates: Partial<ShoppingListItem>) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      removeShoppingListItem: (id: string) =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => item.id !== id),
        })),
      toggleShoppingListItem: (id: string) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),
      clearShoppingList: () => set({ shoppingList: [] }),
      getCheckedItems: () => {
        const state = get();
        return state.shoppingList.filter((item) => item.checked);
      },
      getUncheckedItems: () => {
        const state = get();
        return state.shoppingList.filter((item) => !item.checked);
      },
      
      // User Preferences
      preferences: defaultPreferences,
      updatePreferences: (preferences: Partial<UserPreferences>) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),
      
      // UI State
      searchFilters: defaultFilters,
      setSearchFilters: (filters: SearchFilters) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        })),
      clearSearchFilters: () => set({ searchFilters: defaultFilters }),
      
      // Cache
      searchResults: [],
      setSearchResults: (results: SearchResult[]) => set({ searchResults: results }),
      clearSearchResults: () => set({ searchResults: [] }),
    }),
    {
      name: 'recipe-explorer-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        searchHistory: state.searchHistory,
        recentRecipes: state.recentRecipes,
        mealPlans: state.mealPlans,
        shoppingList: state.shoppingList,
        preferences: state.preferences,
      }),
    }
  )
);
