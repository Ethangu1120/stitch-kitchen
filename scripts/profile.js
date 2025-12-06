import React from 'react';
import ReactDOM from 'react-dom/client';
import { Settings } from 'lucide-react';
import { Page, PageHeader } from './components.js';
import { RECIPES } from './data.js';

const h = React.createElement;

const favorites = [RECIPES[0], RECIPES[5]];

const ProfileScreen = () =>
  h(
    Page,
    { current: 'profile' },
    h(PageHeader, {
      title: '我的',
      rightSlot: h(
        'button',
        { className: 'flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-transparent text-white' },
        h(Settings, { size: 24 })
      )
    }),
    h(
      'div',
      { className: 'flex p-4' },
      h(
        'div',
        { className: 'flex w-full flex-row gap-4 items-center' },
        h('div', {
          className: 'bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 bg-gray-700',
          style: {
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2o13CQYCHpQLOY39llo3oPcs7zoFocCCOkvpwGaLC-aWuziOxGqWAIrR_BuK9vu_LT0Y5pv_J9zJMucXRLy_leRyEL2yaEXyiA8cmNclHXCgnnqqxIL2Ppza-YqAdIbriBXK4aJk6-guQx6TzqLz-kWbdzpFR9UGRlcY6-zbfsdXkRqiIO0A0xLTRTSVd9QInI3toCB74NtvLxAA2UQFkFhnJxwA7t2yzFs32Md7phKWyHfBlw50gYwPHHRzbKnad81zThVjTIRY")'
          }
        }),
        h(
          'div',
          { className: 'flex flex-col justify-center' },
          h('p', { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em]' }, '美食家小王'),
          h('p', { className: 'text-zinc-400 text-base font-normal leading-normal' }, '查看并编辑个人资料')
        )
      )
    ),
    h(
      'h2',
      { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5' },
      '我的收藏'
    ),
    h(
      'div',
      { className: 'flex flex-col gap-4 px-4 pb-20' },
      favorites.map((recipe) =>
        h(
          'div',
          { key: recipe.id, className: 'flex items-stretch justify-between gap-4 rounded-xl bg-app-card p-4 shadow-sm' },
          h(
            'div',
            { className: 'flex flex-col gap-1 flex-[2_2_0px]' },
            h('p', { className: 'text-white text-base font-bold leading-tight' }, recipe.title),
            h('p', { className: 'text-zinc-400 text-sm font-normal leading-normal' }, '15分钟快手菜')
          ),
          h('div', {
            className: 'w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1 bg-gray-700',
            style: { backgroundImage: `url("${recipe.image}")` }
          })
        )
      )
    )
  );

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(h(React.StrictMode, null, h(ProfileScreen)));
}
