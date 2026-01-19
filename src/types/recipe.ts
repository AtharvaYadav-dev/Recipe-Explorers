export interface Recipe {
  id: string;
  title: string;
  image: string;
  imageType: string;
  servings: number;
  readyInMinutes: number;
  sourceUrl?: string;
  sourceName?: string;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  instructions?: string;
  analyzedInstructions?: AnalyzedInstruction[];
  extendedIngredients: ExtendedIngredient[];
  nutrition?: Nutrition;
  cheap?: boolean;
  dairyFree?: boolean;
  glutenFree?: boolean;
  ketogenic?: boolean;
  lowFodmap?: boolean;
  sustainable?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  veryHealthy?: boolean;
  veryPopular?: boolean;
  whole30?: boolean;
  weightWatcherSmartPoints?: number;
  aggregateLikes?: number;
  spoonacularScore?: number;
  healthScore?: number;
}

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface InstructionStep {
  number: number;
  step: string;
  ingredients?: { id: number; name: string; image: string }[];
  equipment?: { id: number; name: string; image: string }[];
  length?: { number: number; unit: string };
}

export interface ExtendedIngredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: {
    us: { amount: number; unitShort: string; unitLong: string };
    metric: { amount: number; unitShort: string; unitLong: string };
  };
}

export interface Nutrition {
  nutrients: Nutrient[];
  properties: Property[];
  flavonoids: Flavonoid[];
  caloricBreakdown: CaloricBreakdown;
  weightPerServing: { amount: number; unit: string };
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

export interface Property {
  name: string;
  amount: number;
  unit: string;
}

export interface Flavonoid {
  name: string;
  amount: number;
  unit: string;
}

export interface CaloricBreakdown {
  percentProtein: number;
  percentFat: number;
  percentCarbs: number;
}

export interface SearchResult {
  id: string;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  missedIngredients?: ExtendedIngredient[];
  unusedIngredients?: ExtendedIngredient[];
  likes?: number;
}

export interface SearchFilters {
  query?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string[];
  type?: string;
  maxReadyTime?: number;
  minServings?: number;
  maxServings?: number;
  addRecipeInformation?: boolean;
  addRecipeInstructions?: boolean;
  addRecipeNutrition?: boolean;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
  number?: number;
  offset?: number;
}

export interface MealPlan {
  id: string;
  date: string;
  meals: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snack?: Recipe;
  };
}

export interface ShoppingListItem {
  id: string;
  ingredient: ExtendedIngredient;
  recipeId: string;
  recipeTitle: string;
  checked: boolean;
  quantity: number;
  unit: string;
}

export interface UserPreferences {
  favoriteRecipes: string[];
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
  intolerances: string[];
  mealPlanPreferences: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snack: boolean;
  };
}
