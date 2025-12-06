import React, { useState } from 'react';
import { ViewState, Recipe } from './types';
import HomeScreen from './screens/HomeScreen';
import FridgeScreen from './screens/FridgeScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import ProfileScreen from './screens/ProfileScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewState>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBack = () => {
    setSelectedRecipe(null);
  };

  // If a recipe is selected, show detail screen covering everything
  if (selectedRecipe) {
    return (
      <RecipeDetailScreen recipe={selectedRecipe} onBack={handleBack} />
    );
  }

  // Otherwise show the tabbed views
  return (
    <div className="flex flex-col min-h-screen bg-app-bg text-white font-sans">
      <div className="flex-grow flex flex-col">
        {activeTab === 'home' && <HomeScreen onRecipeClick={handleRecipeClick} />}
        {activeTab === 'fridge' && <FridgeScreen />}
        {activeTab === 'shopping' && <ShoppingListScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>
      
      <BottomNav current={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default App;