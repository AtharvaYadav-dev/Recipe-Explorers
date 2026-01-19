import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}

export function formatCalories(calories: number): string {
  return `${Math.round(calories)} cal`;
}

export function formatServings(servings: number): string {
  return servings === 1 ? '1 serving' : `${servings} servings`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

export function removeLocalStorageItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function getImageUrl(url: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  if (!url) return '';
  
  const sizeMap = {
    small: '240x150',
    medium: '480x360', 
    large: '636x393'
  };
  
  if (url.includes('spoonacular.com')) {
    return url.replace(/\/\d+x\d+\//, `/${sizeMap[size]}/`);
  }
  
  return url;
}

export function calculateRecipeCost(ingredients: any[]): number {
  return ingredients.reduce((total, ingredient) => {
    return total + (ingredient.amount * ingredient.estimatedCost?.value || 0);
  }, 0);
}

export function getHealthScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getDifficultyColor(readyInMinutes: number): string {
  if (readyInMinutes <= 15) return 'text-green-600';
  if (readyInMinutes <= 30) return 'text-yellow-600';
  if (readyInMinutes <= 60) return 'text-orange-600';
  return 'text-red-600';
}

export function getDifficultyLabel(readyInMinutes: number): string {
  if (readyInMinutes <= 15) return 'Easy';
  if (readyInMinutes <= 30) return 'Medium';
  if (readyInMinutes <= 60) return 'Hard';
  return 'Very Hard';
}
