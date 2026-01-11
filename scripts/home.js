import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Check, Plus, Utensils } from 'lucide-react';
import { Page, PageHeader } from './components.js';

const h = React.createElement;

const categories = [
  { id: 'all', label: '所有' },
  { id: '早餐', label: '早餐' },
  { id: '中饭', label: '午餐' },
  { id: '晚饭', label: '晚餐' }
];

const RecipeCard = ({ recipe }) => {
  const needsShopping = recipe.ingredients.some((item) => item.isEnough === false);
  const missingList = recipe.ingredients.filter((item) => item.isEnough === false).map((item) => item.name);

  const goToDetail = () => {
    window.location.href = `./recipe.html?name=${encodeURIComponent(recipe.name)}`;
  };

  return h(
    'button',
    { onClick: goToDetail, className: 'flex items-start justify-between gap-4 cursor-pointer text-left w-full' },
    h(
      'div',
      { className: 'flex flex-col gap-1 flex-1' },
      h('p', { className: 'text-white text-base font-bold leading-tight' }, recipe.name),
      h(
        'div',
        { className: 'flex items-center gap-1.5' },
        needsShopping
          ? h(
              'div',
              { className: 'flex size-4 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-black' },
              h(Plus, { size: 12, strokeWidth: 4 })
            )
          : h(
              'div',
              { className: 'flex size-4 shrink-0 items-center justify-center rounded-full bg-app-accent text-white' },
              h(Check, { size: 12, strokeWidth: 4 })
            ),
        h(
          'p',
          { className: 'text-app-textSub text-sm font-normal leading-normal truncate' },
          `${recipe.type}${needsShopping ? `, 需购买: ${missingList.join(', ')}` : ', 食材充足'}`
        )
      )
    ),
    h('div', {
      className: 'w-20 h-20 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 bg-gray-700 flex items-center justify-center',
    }, h(Utensils, { size: 32, className: 'text-app-textSub opacity-50' }))
  );
};

const Section = ({ title, recipes }) =>
  h(
    'div',
    { className: 'flex flex-col gap-4 rounded-lg bg-app-card p-4' },
    h('h3', { className: 'text-white text-lg font-bold leading-tight' }, title),
    recipes.map((recipe, idx) =>
      h(
        React.Fragment,
        { key: recipe.name },
        h(RecipeCard, { recipe }),
        idx < recipes.length - 1 ? h('div', { className: 'border-t border-dashed border-app-secondary' }) : null
      )
    )
  );

const HomeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = activeTab === 'all' 
    ? recipes 
    : recipes.filter(r => r.type === activeTab);

  const breakfasts = filteredRecipes.filter(r => r.type === '早餐');
  const lunches = filteredRecipes.filter(r => r.type === '中饭');
  const dinners = filteredRecipes.filter(r => r.type === '晚饭');

  return h(
    Page,
    { current: 'home' },
    h(PageHeader, { title: '智能菜谱推荐' }),
    h(
      'div',
      { className: 'flex gap-3 px-4 py-3 overflow-x-auto whitespace-nowrap sticky top-[60px] bg-app-bg z-10 no-scrollbar' },
      categories.map((cat) =>
        h(
          'button',
          {
            key: cat.id,
            onClick: () => setActiveTab(cat.id),
            className: `flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 cursor-pointer transition-colors ${
              activeTab === cat.id ? 'bg-app-accentDark' : 'bg-app-secondary hover:bg-app-secondary/80'
            }`
          },
          h('p', { className: 'text-white text-sm font-medium leading-normal' }, cat.label)
        )
      )
    ),
    h(
      'div',
      { className: 'p-4 space-y-6 pb-20' },
      loading ? h('p', { className: 'text-app-textSub' }, '加载中...') :
      filteredRecipes.length === 0 ? h('p', { className: 'text-app-textSub text-center py-10' }, '暂无菜谱') :
      [
        breakfasts.length > 0 && h(Section, { title: '早餐推荐', recipes: breakfasts }),
        lunches.length > 0 && h(Section, { title: '午餐推荐', recipes: lunches }),
        dinners.length > 0 && h(Section, { title: '晚餐推荐', recipes: dinners }),
        activeTab === 'all' && recipes.length === 0 && h('p', { className: 'text-app-textSub' }, '暂无推荐')
      ].filter(Boolean)
    )
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(h(React.StrictMode, null, h(HomeScreen)));
}
