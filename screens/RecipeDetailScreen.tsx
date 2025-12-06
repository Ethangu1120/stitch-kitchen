import React from 'react';
import { Recipe } from '../types';
import { ArrowLeft, Star, Check } from 'lucide-react';

interface RecipeDetailScreenProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ recipe, onBack }) => {
  return (
    <div className="flex flex-col bg-app-bg min-h-screen pb-10">
      {/* Header */}
      <div className="flex items-center bg-app-bg p-4 pb-2 justify-between sticky top-0 z-20">
        <button onClick={onBack} className="text-white flex size-12 shrink-0 items-center -ml-3 cursor-pointer">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          菜谱
        </h2>
        <div className="text-white flex size-12 shrink-0 items-center justify-end -mr-3">
          <Star size={24} />
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-[4/3] sm:aspect-video bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-app-bg sm:rounded-lg sm:mx-4 sm:w-auto" style={{ backgroundImage: `url("${recipe.image}")` }}>
      </div>

      {/* Title & Desc */}
      <h1 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
        {recipe.title}
      </h1>
      <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
        一道简单又美味的{recipe.title}，适合快速{recipe.category === 'Breakfast' ? '早餐' : recipe.category === 'Lunch' ? '午餐' : '晚餐'}。
      </p>

      {/* Time Stats */}
      <div className="px-4">
        <div className="flex justify-between gap-x-6 py-2">
          <p className="text-app-textSub text-sm font-normal leading-normal">准备时间</p>
          <p className="text-white text-sm font-normal leading-normal text-right">{recipe.prepTime}</p>
        </div>
        <div className="flex justify-between gap-x-6 py-2">
          <p className="text-app-textSub text-sm font-normal leading-normal">烹饪时间</p>
          <p className="text-white text-sm font-normal leading-normal text-right">{recipe.cookTime}</p>
        </div>
        <div className="flex justify-between gap-x-6 py-2">
          <p className="text-app-textSub text-sm font-normal leading-normal">总时间</p>
          <p className="text-white text-sm font-normal leading-normal text-right">{recipe.totalTime}</p>
        </div>
      </div>

      {/* Ingredients */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        所需材料
      </h2>
      <div className="px-4">
        {recipe.ingredients.map((ing, idx) => (
          <label key={idx} className="flex gap-x-3 py-3 flex-row items-center cursor-pointer group">
            <div className="relative flex items-center">
                <input 
                    type="checkbox" 
                    defaultChecked={idx < 2} // Mock checked state
                    className="peer h-5 w-5 appearance-none rounded border-2 border-[#326744] bg-transparent checked:border-app-accent checked:bg-app-accent focus:ring-0 focus:ring-offset-0 transition-all"
                />
                 <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#112217] opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={4} />
            </div>
            <p className="text-white text-base font-normal leading-normal select-none">
              {ing.name} {ing.amount}
            </p>
          </label>
        ))}
      </div>

      {/* Steps */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        步骤
      </h2>
      <div className="space-y-1">
        {recipe.steps.map((step) => (
          <div key={step.id} className="flex items-center gap-4 bg-app-bg px-4 min-h-[72px] py-2">
            <div className="flex flex-col justify-center">
              <p className="text-white text-base font-medium leading-normal line-clamp-1">步骤 {step.id}</p>
              <p className="text-app-textSub text-sm font-normal leading-normal">
                {step.instruction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeDetailScreen;