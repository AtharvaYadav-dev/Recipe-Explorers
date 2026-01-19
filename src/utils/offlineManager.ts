import { Recipe, SearchResult } from '@/types/recipe';

interface OfflineRecipe extends Recipe {
  cachedAt: string;
  isOffline: boolean;
}

interface OfflineSearchResult extends SearchResult {
  cachedAt: string;
  isOffline: boolean;
}

class OfflineManager {
  private static instance: OfflineManager;
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'RecipeExplorerDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'recipes';

  private constructor() {}

  public static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  public async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }

  public async cacheRecipe(recipe: Recipe): Promise<void> {
    if (!this.db) await this.initDB();
    
    const offlineRecipe: OfflineRecipe = {
      ...recipe,
      cachedAt: new Date().toISOString(),
      isOffline: true
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(offlineRecipe);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async cacheSearchResults(query: string, results: SearchResult[]): Promise<void> {
    if (!this.db) await this.initDB();
    
    const cacheKey = `search_${query}`;
    const offlineResults: OfflineSearchResult[] = results.map(result => ({
      ...result,
      cachedAt: new Date().toISOString(),
      isOffline: true
    }));

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(offlineResults, cacheKey);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getCachedRecipe(id: string): Promise<OfflineRecipe | null> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  public async getCachedSearchResults(query: string): Promise<OfflineSearchResult[] | null> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(`search_${query}`);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  public async getAllCachedRecipes(): Promise<OfflineRecipe[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const all = request.result;
        const recipes = all.filter((item: any) => item.cachedAt && !item.id.toString().startsWith('search_'));
        resolve(recipes);
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async clearOldCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const item = cursor.value;
          const age = Date.now() - new Date(item.cachedAt).getTime();
          
          if (age > maxAge) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  public async isOnline(): Promise<boolean> {
    if (!navigator.onLine) return true;
    
    try {
      const response = await fetch('https://httpbin.org/get', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  public setupSyncListener(): void {
    window.addEventListener('online', () => {
      console.log('App is online - syncing offline changes');
      this.syncOfflineChanges();
    });

    window.addEventListener('offline', () => {
      console.log('App is offline - enabling offline mode');
    });
  }

  private async syncOfflineChanges(): Promise<void> {
    // This would sync any offline changes when back online
    // Implementation depends on your backend API
    console.log('Syncing offline changes...');
  }

  public getStorageUsage(): Promise<{ used: number; available: number }> {
    return new Promise((resolve) => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then((estimate) => {
          resolve({
            used: estimate.usage || 0,
            available: (estimate.quota || 0) - (estimate.usage || 0)
          });
        });
      } else {
        resolve({ used: 0, available: 0 });
      }
    });
  }
}

export default OfflineManager.getInstance();
