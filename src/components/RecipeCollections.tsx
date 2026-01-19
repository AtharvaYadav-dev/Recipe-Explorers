import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderPlus, FolderOpen, Plus, X, Edit2, 
  Trash2, Heart, Grid3x3 
} from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import { Recipe } from '@/types/recipe';
import { cn } from '@/lib/utils';

interface Collection {
  id: string;
  name: string;
  description: string;
  recipeIds: string[];
  color: string;
  icon: string;
  createdAt: string;
}

interface RecipeCollectionsProps {
  onClose?: () => void;
}

const RecipeCollections: React.FC<RecipeCollectionsProps> = ({ onClose }) => {
  const { favorites } = useRecipeStore();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: 'folder'
  });

  const defaultCollections: Collection[] = [
    {
      id: 'favorites',
      name: 'Favorites',
      description: 'Your favorite recipes',
      recipeIds: favorites,
      color: '#ef4444',
      icon: 'heart',
      createdAt: new Date().toISOString()
    }
  ];

  const allCollections = [...defaultCollections, ...collections];

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) return;

    const collection: Collection = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCollection.name,
      description: newCollection.description,
      recipeIds: [],
      color: newCollection.color,
      icon: newCollection.icon,
      createdAt: new Date().toISOString()
    };

    setCollections(prev => [...prev, collection]);
    setNewCollection({ name: '', description: '', color: '#3b82f6', icon: 'folder' });
    setShowCreateModal(false);
  };

  const handleDeleteCollection = (id: string) => {
    if (id === 'favorites') return; // Don't allow deleting favorites
    setCollections(prev => prev.filter(c => c.id !== id));
    if (selectedCollection === id) {
      setSelectedCollection(null);
    }
  };

  const handleAddToCollection = (recipeId: string, collectionId: string) => {
    if (collectionId === 'favorites') return; // Favorites are handled separately

    setCollections(prev => prev.map(collection => 
      collection.id === collectionId
        ? { ...collection, recipeIds: [...collection.recipeIds, recipeId] }
        : collection
    ));
  };

  const handleRemoveFromCollection = (recipeId: string, collectionId: string) => {
    if (collectionId === 'favorites') return; // Favorites are handled separately

    setCollections(prev => prev.map(collection => 
      collection.id === collectionId
        ? { ...collection, recipeIds: collection.recipeIds.filter(id => id !== recipeId) }
        : collection
    ));
  };

  const getCollectionIcon = (icon: string) => {
    switch (icon) {
      case 'heart': return Heart;
      case 'folder': return FolderOpen;
      default: return Grid3x3;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recipe Collections</h1>
          <p className="text-muted-foreground">Organize your recipes into custom collections</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <FolderPlus className="h-4 w-4" />
            New Collection
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCollections.map((collection, index) => {
          const Icon = getCollectionIcon(collection.icon);
          const recipeCount = collection.recipeIds.length;
          
          return (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <div
                className={cn(
                  'bg-card border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg',
                  selectedCollection === collection.id ? 'ring-2 ring-primary' : ''
                )}
                onClick={() => setSelectedCollection(
                  selectedCollection === collection.id ? null : collection.id
                )}
              >
                {/* Collection Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: collection.color }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{collection.name}</h3>
                      <p className="text-sm text-muted-foreground">{collection.description}</p>
                    </div>
                  </div>
                  
                  {collection.id !== 'favorites' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit functionality would go here
                        }}
                        className="p-1 rounded hover:bg-accent"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(collection.id);
                        }}
                        className="p-1 rounded hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Recipe Count */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Grid3x3 className="h-4 w-4" />
                  <span>{recipeCount} recipe{recipeCount !== 1 ? 's' : ''}</span>
                </div>

                {/* Preview Recipes */}
                {selectedCollection === collection.id && recipeCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-2"
                  >
                    {collection.recipeIds.slice(0, 3).map(recipeId => (
                      <div
                        key={recipeId}
                        className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-muted rounded"></div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Recipe {recipeId}</div>
                          <div className="text-xs text-muted-foreground">Click to view</div>
                        </div>
                      </div>
                    ))}
                    
                    {recipeCount > 3 && (
                      <div className="text-center text-sm text-muted-foreground pt-2">
                        And {recipeCount - 3} more recipes...
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-card border rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create New Collection</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Collection Name</label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Collection"
                  className="w-full px-3 py-2 border rounded-lg"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your collection..."
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewCollection(prev => ({ ...prev, color }))}
                      className={cn(
                        'w-8 h-8 rounded-lg border-2',
                        newCollection.color === color ? 'border-primary' : 'border-transparent'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-accent"
              >
                Cancel
              </button>
              
              <button
                onClick={handleCreateCollection}
                disabled={!newCollection.name.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Collection
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default RecipeCollections;
