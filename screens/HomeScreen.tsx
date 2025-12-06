import React from 'react';
import { Recipe } from '../types';
import { RECIPES } from '../data';
import { Check, Plus, ArrowLeft } from 'lucide-react';

interface HomeScreenProps {
  onRecipeClick: (recipe: Recipe) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onRecipeClick }) => {
  const categories = [
    { id: 'all', label: '所有', active: true },
    { id: 'breakfast', label: '早餐', active: false },
    { id: 'lunch', label: '午餐', active: false },
    { id: 'dinner', label: '晚餐', active: false },
  ];

  const renderRecipeCard = (recipe: Recipe) => (
    <div 
      key={recipe.id} 
      className="flex items-start justify-between gap-4 cursor-pointer"
      onClick={() => onRecipeClick(recipe)}
    >
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-white text-base font-bold leading-tight">{recipe.title}</p>
        <div className="flex items-center gap-1.5">
           {/* Logic to determine if ingredients are available - simplified for demo */}
          {recipe.ingredients.some(i => i.available === false) ? (
             <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-black">
               <Plus size={12} strokeWidth={4} />
             </div>
          ) : (
            <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-app-accent text-white">
              <Check size={12} strokeWidth={4} />
            </div>
          )}
          <p className="text-app-textSub text-sm font-normal leading-normal truncate">
            {recipe.tags.join(', ')}
            {recipe.ingredients.some(i => i.available === false) && 
             `, 需购买: ${recipe.ingredients.filter(i => i.available === false).map(i => i.name).join(', ')}`}
          </p>
        </div>
      </div>
      <div 
        className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 bg-gray-700"
        style={{ backgroundImage: `url("${recipe.image}")` }}
      ></div>
    </div>
  );

  const dinners = RECIPES.filter(r => r.category === 'Dinner');
  const breakfasts = RECIPES.filter(r => r.category === 'Breakfast');

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center bg-app-bg p-4 pb-2 justify-between sticky top-0 z-10">
        <div className="text-white flex size-12 shrink-0 items-center -ml-4 pl-4">
          <ArrowLeft size={24} />
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-8">
          智能菜谱推荐
        </h2>
      </div>

      {/* Categories */}
      <div className="flex gap-3 px-4 py-3 overflow-x-auto whitespace-nowrap sticky top-[60px] bg-app-bg z-10 no-scrollbar">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 cursor-pointer transition-colors ${
              cat.active ? 'bg-app-accentDark' : 'bg-app-secondary'
            }`}
          >
            <p className="text-white text-sm font-medium leading-normal">{cat.label}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 pb-20">
        <div className="flex flex-col gap-4 rounded-lg bg-app-card p-4">
          <h3 className="text-white text-lg font-bold leading-tight">经典家常晚餐</h3>
          {dinners.map((recipe, idx) => (
            <React.Fragment key={recipe.id}>
              {renderRecipeCard(recipe)}
              {idx < dinners.length - 1 && (
                <div className="border-t border-dashed border-app-secondary"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-app-card p-4">
          <h3 className="text-white text-lg font-bold leading-tight">活力满满早餐</h3>
          {breakfasts.map((recipe, idx) => (
            <React.Fragment key={recipe.id}>
              {renderRecipeCard(recipe)}
              {idx < breakfasts.length - 1 && (
                <div className="border-t border-dashed border-app-secondary"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;