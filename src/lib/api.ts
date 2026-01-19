import axios from 'axios';
import { Recipe, SearchResult, SearchFilters } from '@/types/recipe';

const API_BASE_URL = 'https://api.spoonacular.com';
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || 'demo-key';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      apiKey: API_KEY,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 402) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your configuration.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    throw error;
  }
);

export const recipeApi = {
  searchRecipes: async (filters: SearchFilters = {}): Promise<SearchResult[]> => {
    const params = {
      query: filters.query || '',
      cuisine: filters.cuisine || '',
      diet: filters.diet || '',
      intolerances: filters.intolerances?.join(',') || '',
      type: filters.type || '',
      maxReadyTime: filters.maxReadyTime || undefined,
      minServings: filters.minServings || undefined,
      maxServings: filters.maxServings || undefined,
      addRecipeInformation: filters.addRecipeInformation ?? true,
      addRecipeInstructions: filters.addRecipeInstructions ?? true,
      addRecipeNutrition: filters.addRecipeNutrition ?? false,
      sort: filters.sort || 'random',
      sortDirection: filters.sortDirection || 'desc',
      number: filters.number || 24,
      offset: filters.offset || 0,
    };

    const response = await apiClient.get('/recipes/complexSearch', { params });
    return response.data.results;
  },

  getRecipeById: async (id: string): Promise<Recipe> => {
    const response = await apiClient.get(`/recipes/${id}/information`, {
      params: {
        includeNutrition: true,
      },
    });
    return response.data;
  },

  getRandomRecipes: async (number: number = 10): Promise<Recipe[]> => {
    const response = await apiClient.get('/recipes/random', {
      params: {
        number,
        limitLicense: true,
      },
    });
    return response.data.recipes;
  },

  searchByIngredients: async (ingredients: string[], number: number = 10): Promise<SearchResult[]> => {
    const response = await apiClient.get('/recipes/findByIngredients', {
      params: {
        ingredients: ingredients.join(','),
        number,
        ranking: 1,
        ignorePantry: false,
      },
    });
    return response.data;
  },

  getSimilarRecipes: async (id: string, number: number = 5): Promise<Recipe[]> => {
    const response = await apiClient.get(`/recipes/${id}/similar`, {
      params: {
        number,
        limitLicense: true,
      },
    });
    return response.data;
  },

  autocompleteRecipeSearch: async (query: string, number: number = 10): Promise<string[]> => {
    const response = await apiClient.get('/recipes/autocomplete', {
      params: {
        query,
        number,
        metaInformation: false,
      },
    });
    return response.data.map((item: any) => item.title);
  },

  getRecipeNutritionWidget: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/recipes/${id}/nutritionWidget`);
    return response.data;
  },

  getRecipePriceBreakdownWidget: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/recipes/${id}/priceBreakdownWidget`);
    return response.data;
  },

  getRecipeEquipmentWidget: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/recipes/${id}/equipmentWidget`);
    return response.data;
  },
};

export const cuisineOptions = [
  'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European',
  'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese',
  'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern',
  'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
];

export const dietOptions = [
  'Gluten Free', 'Ketogenic', 'Vegetarian', 'Vegan', 'Pescetarian', 'Paleo',
  'Primal', 'Low FODMAP', 'Whole30'
];

export const intoleranceOptions = [
  'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 'Shellfish',
  'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
];

export const mealTypeOptions = [
  'Main Course', 'Side Dish', 'Dessert', 'Appetizer', 'Salad', 'Bread', 'Breakfast',
  'Soup', 'Beverage', 'Sauce', 'Marinade', 'Fingerfood', 'Snack', 'Drink'
];
