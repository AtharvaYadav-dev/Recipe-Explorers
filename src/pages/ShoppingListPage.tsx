import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Plus, Trash2, Check, ArrowLeft, 
  Download, Filter 
} from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';

const ShoppingListPage: React.FC = () => {
  const navigate = useNavigate();
  const { shoppingList, addToShoppingList, updateShoppingListItem, removeShoppingListItem, toggleShoppingListItem, clearShoppingList } = useRecipeStore();
  const [newItem, setNewItem] = useState('');
  const [filter, setFilter] = useState<'all' | 'checked' | 'unchecked'>('all');

  const filteredItems = shoppingList.filter(item => {
    if (filter === 'checked') return item.checked;
    if (filter === 'unchecked') return !item.checked;
    return true;
  });

  const checkedCount = shoppingList.filter(item => item.checked).length;
  const uncheckedCount = shoppingList.length - checkedCount;

  const handleAddItem = () => {
    if (newItem.trim()) {
      addToShoppingList({
        ingredient: {
          id: Date.now(),
          name: newItem.trim(),
          amount: 1,
          unit: 'item',
          aisle: 'other',
          image: '',
          consistency: 'solid',
          nameClean: newItem.trim(),
          original: newItem.trim(),
          originalName: newItem.trim(),
          meta: [],
          measures: {
            us: { amount: 1, unitShort: 'item', unitLong: 'item' },
            metric: { amount: 1, unitShort: 'item', unitLong: 'item' }
          }
        },
        recipeId: 'manual',
        recipeTitle: 'Manual Entry',
        quantity: 1,
        unit: 'item'
      });
      setNewItem('');
    }
  };

  const handleExportList = () => {
    const text = shoppingList
      .filter(item => !item.checked)
      .map(item => `${item.ingredient.original}`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <h1 className="text-3xl font-bold">Shopping List</h1>
            <p className="text-muted-foreground">
              {uncheckedCount} items to buy • {checkedCount} completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {shoppingList.length > 0 && (
            <>
              <button
                onClick={handleExportList}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              
              <button
                onClick={clearShoppingList}
                className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Add Item */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Add item to shopping list..."
          className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 border-b"
      >
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            filter === 'all' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          All ({shoppingList.length})
        </button>
        <button
          onClick={() => setFilter('unchecked')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            filter === 'unchecked' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          To Buy ({uncheckedCount})
        </button>
        <button
          onClick={() => setFilter('checked')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            filter === 'checked' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Completed ({checkedCount})
        </button>
      </motion.div>

      {/* Shopping List Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {filter === 'all' ? 'Your shopping list is empty' : `No ${filter} items`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'all' 
                ? 'Add items manually or generate from your meal plans.'
                : 'Try changing the filter or add new items.'
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/meal-plan')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Generate from Meal Plan
              </button>
            )}
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-center gap-3 p-4 bg-card border rounded-lg ${
                item.checked ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleShoppingListItem(item.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.checked
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-muted-foreground hover:border-primary'
                }`}
              >
                {item.checked && <Check className="h-3 w-3" />}
              </button>

              <div className="flex-1">
                <div className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                  {item.ingredient.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.quantity} {item.unit}
                  {item.recipeTitle && ` • ${item.recipeTitle}`}
                </div>
              </div>

              <button
                onClick={() => removeShoppingListItem(item.id)}
                className="flex-shrink-0 p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Summary */}
      {shoppingList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Shopping Progress</h3>
              <p className="text-sm text-muted-foreground">
                {checkedCount} of {shoppingList.length} items completed
              </p>
            </div>
            <div className="text-2xl font-bold">
              {Math.round((checkedCount / shoppingList.length) * 100)}%
            </div>
          </div>
          <div className="mt-3 bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(checkedCount / shoppingList.length) * 100}%` }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ShoppingListPage;
