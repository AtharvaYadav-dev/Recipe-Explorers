# Recipe Explorer 🍳

A modern, feature-rich recipe discovery and meal planning application built with React, TypeScript, and Tailwind CSS. Powered by the Spoonacular API, this app helps you discover amazing recipes, plan your meals, and manage your shopping lists efficiently.

## ✨ Features

### 🔍 Advanced Search & Discovery
- **Smart Search**: Find recipes by name, ingredients, cuisine, diet, and more
- **Advanced Filters**: Filter by dietary restrictions, intolerances, cooking time, servings
- **Ingredient-based Search**: Find recipes using ingredients you already have
- **Similar Recipes**: Discover recipes similar to your favorites

### ❤️ Personalization
- **Favorites System**: Save and organize your favorite recipes
- **Recent History**: Track recently viewed recipes
- **User Preferences**: Set dietary restrictions and preferred cuisines
- **Search History**: Quick access to your recent searches

### 📅 Meal Planning
- **Weekly Planner**: Plan your meals for the entire week
- **Visual Calendar**: Intuitive drag-and-drop meal scheduling
- **Meal Types**: Plan breakfast, lunch, dinner, and snacks
- **Quick Add**: Easily add recipes to your meal plan

### 🛒 Shopping Lists
- **Auto-generation**: Create shopping lists from your meal plans
- **Smart Organization**: Items grouped by recipe and category
- **Progress Tracking**: Check off items as you shop
- **Export Options**: Download lists for offline use

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Progressive Web App**: Installable on mobile devices
- **Touch-Friendly**: Intuitive gestures and interactions
- **Offline Support**: Core functionality works offline

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state management and caching
- **Local Storage** - Persistent user data

### UI Components
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form handling with validation
- **React Hot Toast** - Elegant notifications

### API & Data
- **Spoonacular API** - Comprehensive recipe database
- **Axios** - HTTP client with interceptors

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd recipe-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Spoonacular API key:
   ```
   VITE_SPOONACULAR_API_KEY=your_actual_api_key_here
   ```
   
   📝 **Get your API key**: Visit [Spoonacular Food API](https://spoonacular.com/food-api) and sign up for a free account to get your API key.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run type-check   # Run TypeScript type checking

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🏗️ Project Structure

```
recipe-explorer/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/           # Base UI components (Button, Card, Input)
│   │   ├── RecipeCard.tsx
│   │   ├── AdvancedSearch.tsx
│   │   └── Layout.tsx
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── RecipeDetailPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── MealPlanPage.tsx
│   │   ├── ShoppingListPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── lib/              # Utilities and API
│   │   ├── api.ts        # API client and endpoints
│   │   └── utils.ts      # Helper functions
│   ├── store/            # State management
│   │   └── recipeStore.ts # Zustand store
│   ├── types/            # TypeScript type definitions
│   │   └── recipe.ts
│   ├── styles/           # Global styles
│   │   └── globals.css
│   ├── App.tsx           # Main app component
│   └── main.tsx          # App entry point
├── package.json
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── vercel.json          # Vercel deployment config
```

## 🎯 Core Features Explained

### Advanced Search System
- **Multi-criteria filtering**: Search by cuisine, diet, intolerances, meal type
- **Smart sorting**: Sort by popularity, health score, cooking time, price
- **Pagination**: Efficiently browse through thousands of recipes
- **Real-time suggestions**: Autocomplete for ingredients and recipe names

### Recipe Details
- **Comprehensive information**: Ingredients, instructions, nutrition, equipment
- **Step-by-step guide**: Visual recipe instructions with timing
- **Nutritional data**: Detailed macronutrient and micronutrient information
- **Similar recommendations**: Discover related recipes

### Meal Planning
- **Weekly view**: Visual calendar with drag-and-drop functionality
- **Meal type organization**: Separate planning for different meal times
- **Quick recipe addition**: Add recipes directly from search or favorites
- **Progress tracking**: See your meal planning progress

### Shopping Lists
- **Smart aggregation**: Combine ingredients from multiple recipes
- **Categorization**: Items organized by store sections
- **Check-off functionality**: Track shopping progress
- **Export capabilities**: Download lists for offline use

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Environment Variables**
   Set your `VITE_SPOONACULAR_API_KEY` in the Vercel dashboard

3. **Automatic Deployment**
   - Push to your main branch
   - Vercel automatically builds and deploys

### Manual Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

## 🔧 Configuration

### API Configuration
The app uses the Spoonacular API for recipe data. The free tier includes:
- 150 requests/day
- Access to recipes, ingredients, and meal planning
- Comprehensive recipe information

### Customization
- **Theme**: Modify Tailwind CSS configuration in `tailwind.config.js`
- **API Endpoints**: Add new endpoints in `src/lib/api.ts`
- **State Management**: Extend the Zustand store in `src/store/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

### Code Style
- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Configured for React and TypeScript best practices
- **Prettier**: Consistent code formatting (recommended)

### Performance
- **Code Splitting**: Automatic with React.lazy()
- **Image Optimization**: Lazy loading with proper placeholders
- **Caching**: React Query for API response caching
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Core functionality works everywhere

## 🐛 Troubleshooting

### Common Issues

**API Key Not Working**
- Verify your Spoonacular API key is correctly set in `.env`
- Check if you've exceeded your daily API limit
- Ensure the key has the correct permissions

**Build Errors**
- Run `npm run type-check` to identify TypeScript issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing environment variables

**Performance Issues**
- Check browser console for warnings
- Verify images are properly optimized
- Monitor API usage and implement caching

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spoonacular** for providing the amazing recipe API
- **React Team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for beautiful animations

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](../../issues)
3. Create a new issue with detailed information
4. Join our community discussions

---

**Happy Cooking! 🍳✨**
#   R e c i p e - E x p l o r e r s  
 