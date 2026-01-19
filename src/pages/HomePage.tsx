import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Search, Clock, Users, ChefHat, TrendingUp, Heart, Calendar, ShoppingCart } from 'lucide-react';
import { recipeApi } from '@/lib/api';
import RecipeCard from '@/components/RecipeCard';
import AdvancedSearch from '@/components/AdvancedSearch';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { data: randomRecipes } = useQuery(
    'randomRecipes',
    () => recipeApi.getRandomRecipes(8),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const features = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find recipes by ingredients, cuisine, diet, and more',
    },
    {
      icon: Heart,
      title: 'Save Favorites',
      description: 'Keep track of your favorite recipes in one place',
    },
    {
      icon: Calendar,
      title: 'Meal Planning',
      description: 'Plan your meals for the week ahead',
    },
    {
      icon: ShoppingCart,
      title: 'Shopping Lists',
      description: 'Generate shopping lists from your meal plans',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 py-12"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
          Discover Amazing Recipes
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Explore thousands of delicious recipes from around the world. 
          Search by ingredients, save favorites, and plan your meals effortlessly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <AdvancedSearch
            onSearch={(filters) => navigate('/search', { state: { filters } })}
            className="text-lg"
          />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Features</h2>
          <p className="text-muted-foreground">Everything you need for your culinary journey</p>
        </div>
        
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="recipe-card p-6 text-center space-y-4 cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Quick Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: TrendingUp, label: 'Popular Recipes', value: '1000+' },
          { icon: ChefHat, label: 'Cuisines', value: '25+' },
          { icon: Clock, label: 'Quick Meals', value: '30min' },
          { icon: Users, label: 'Happy Users', value: '10K+' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="bg-card border rounded-lg p-4 text-center space-y-2"
            >
              <Icon className="w-6 h-6 text-primary mx-auto" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Random Recipes */}
      {randomRecipes && randomRecipes.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Recipes</h2>
              <p className="text-muted-foreground">Discover something new today</p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="btn-primary"
            >
              View All Recipes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {randomRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white space-y-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Start Cooking?
        </h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Join thousands of home cooks who are discovering new recipes and 
          planning delicious meals with Recipe Explorer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/search')}
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Explore Recipes
          </button>
          <button
            onClick={() => navigate('/meal-plan')}
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
          >
            Plan Meals
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
