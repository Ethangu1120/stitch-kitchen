import React from 'react';
import ReactDOM from 'react-dom/client';
import { Check, Plus } from 'lucide-react';
import { Page, PageHeader } from './components.js';
import { RECIPES } from './data.js';

const h = React.createElement;

const categories = [
  { id: 'all', label: '所有', active: true },
  { id: 'breakfast', label: '早餐', active: false },
  { id: 'lunch', label: '午餐', active: false },
  { id: 'dinner', label: '晚餐', active: false }
];

const RecipeCard = ({ recipe }) => {
  const needsShopping = recipe.ingredients.some((item) => item.available === false);
  const missingList = recipe.ingredients.filter((item) => item.available === false).map((item) => item.name);

  const goToDetail = () => {
    window.location.href = `./recipe.html?id=${recipe.id}`;
  };

  return h(
    'button',
    { onClick: goToDetail, className: 'flex items-start justify-between gap-4 cursor-pointer text-left w-full' },
    h(
      'div',
      { className: 'flex flex-col gap-1 flex-1' },
      h('p', { className: 'text-white text-base font-bold leading-tight' }, recipe.title),
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
          `${recipe.tags.join(', ')}${needsShopping ? `, 需购买: ${missingList.join(', ')}` : ''}`
        )
      )
    ),
    h('div', {
      className: 'w-20 h-20 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 bg-gray-700',
      style: { backgroundImage: `url("${recipe.image}")` }
    })
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
        { key: recipe.id },
        h(RecipeCard, { recipe }),
        idx < recipes.length - 1 ? h('div', { className: 'border-t border-dashed border-app-secondary' }) : null
      )
    )
  );

const HomeScreen = () => {
  const dinners = RECIPES.filter((recipe) => recipe.category === 'Dinner');
  const breakfasts = RECIPES.filter((recipe) => recipe.category === 'Breakfast');

  return h(
    Page,
    { current: 'home' },
    h(PageHeader, { title: '智能菜谱推荐' }),
    h(
      'div',
      { className: 'flex gap-3 px-4 py-3 overflow-x-auto whitespace-nowrap sticky top-[60px] bg-app-bg z-10 no-scrollbar' },
      categories.map((cat) =>
        h(
          'div',
          {
            key: cat.id,
            className: `flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 cursor-default ${
              cat.active ? 'bg-app-accentDark' : 'bg-app-secondary'
            }`
          },
          h('p', { className: 'text-white text-sm font-medium leading-normal' }, cat.label)
        )
      )
    ),
    h(
      'div',
      { className: 'p-4 space-y-6 pb-20' },
      h(Section, { title: '经典家常晚餐', recipes: dinners }),
      h(Section, { title: '活力满满早餐', recipes: breakfasts })
    )
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(h(React.StrictMode, null, h(HomeScreen)));
}
