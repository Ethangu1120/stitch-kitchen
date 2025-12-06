import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { Page } from './components.js';
import { RECIPES } from './data.js';

const h = React.createElement;

const getRecipeFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return RECIPES.find((recipe) => recipe.id === id);
};

const RecipeDetail = () => {
  const recipe = getRecipeFromQuery();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = './index.html';
    }
  };

  if (!recipe) {
    return h(
      Page,
      { current: 'home' },
      h(
        'div',
        { className: 'flex flex-col items-center justify-center flex-1 gap-4 text-center px-6' },
        h('p', { className: 'text-white text-lg font-semibold' }, '未找到该菜谱'),
        h('a', { className: 'text-app-accent underline', href: './index.html' }, '返回推荐列表')
      )
    );
  }

  return h(
    Page,
    { current: 'home' },
    h(
      'div',
      { className: 'flex flex-col bg-app-bg min-h-screen pb-20' },
      h(
        'div',
        { className: 'flex items-center bg-app-bg p-4 pb-2 justify-between sticky top-0 z-20' },
        h(
          'button',
          { onClick: handleBack, className: 'text-white flex size-12 shrink-0 items-center -ml-3 cursor-pointer' },
          h(ArrowLeft, { size: 24 })
        ),
        h(
          'h2',
          { className: 'text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center' },
          '菜谱'
        ),
        h('div', { className: 'text-white flex size-12 shrink-0 items-center justify-end -mr-3' }, h(Star, { size: 24 }))
      ),
      h('div', {
        className:
          'w-full aspect-[4/3] sm:aspect-video bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-app-bg sm:rounded-lg sm:mx-4 sm:w-auto',
        style: { backgroundImage: `url("${recipe.image}")` }
      }),
      h(
        'h1',
        { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5' },
        recipe.title
      ),
      h(
        'p',
        { className: 'text-white text-base font-normal leading-normal pb-3 pt-1 px-4' },
        `一道简单又美味的${recipe.title}，适合快速${
          recipe.category === 'Breakfast' ? '早餐' : recipe.category === 'Lunch' ? '午餐' : '晚餐'
        }。`
      ),
      h(
        'div',
        { className: 'px-4' },
        h(
          'div',
          { className: 'flex justify-between gap-x-6 py-2' },
          h('p', { className: 'text-app-textSub text-sm font-normal leading-normal' }, '准备时间'),
          h('p', { className: 'text-white text-sm font-normal leading-normal text-right' }, recipe.prepTime)
        ),
        h(
          'div',
          { className: 'flex justify-between gap-x-6 py-2' },
          h('p', { className: 'text-app-textSub text-sm font-normal leading-normal' }, '烹饪时间'),
          h('p', { className: 'text-white text-sm font-normal leading-normal text-right' }, recipe.cookTime)
        ),
        h(
          'div',
          { className: 'flex justify-between gap-x-6 py-2' },
          h('p', { className: 'text-app-textSub text-sm font-normal leading-normal' }, '总时间'),
          h('p', { className: 'text-white text-sm font-normal leading-normal text-right' }, recipe.totalTime)
        )
      ),
      h(
        'h2',
        { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5' },
        '所需材料'
      ),
      h(
        'div',
        { className: 'px-4' },
        recipe.ingredients.map((ing, idx) =>
          h(
            'label',
            {
              key: `${ing.name}-${idx}`,
              className: 'flex gap-x-3 py-3 flex-row items-center cursor-pointer group'
            },
            h(
              'div',
              { className: 'relative flex items-center' },
              h('input', {
                type: 'checkbox',
                defaultChecked: idx < 2,
                className:
                  'peer h-5 w-5 appearance-none rounded border-2 border-[#326744] bg-transparent checked:border-app-accent checked:bg-app-accent focus:ring-0 focus:ring-offset-0 transition-all'
              }),
              h(Check, {
                className:
                  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#112217] opacity-0 peer-checked:opacity-100 pointer-events-none',
                strokeWidth: 4
              })
            ),
            h('p', { className: 'text-white text-base font-normal leading-normal select-none' }, `${ing.name} ${ing.amount || ''}`)
          )
        )
      ),
      h(
        'h2',
        { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5' },
        '步骤'
      ),
      h(
        'div',
        { className: 'space-y-1' },
        recipe.steps.map((step) =>
          h(
            'div',
            { key: step.id, className: 'flex items-center gap-4 bg-app-bg px-4 min-h-[72px] py-2' },
            h(
              'div',
              { className: 'flex flex-col justify-center' },
              h('p', { className: 'text-white text-base font-medium leading-normal line-clamp-1' }, `步骤 ${step.id}`),
              h('p', { className: 'text-app-textSub text-sm font-normal leading-normal' }, step.instruction)
            )
          )
        )
      )
    )
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(h(React.StrictMode, null, h(RecipeDetail)));
}
