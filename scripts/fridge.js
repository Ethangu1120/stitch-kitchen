import React from 'react';
import ReactDOM from 'react-dom/client';
import { Plus } from 'lucide-react';
import { Page, PageHeader } from './components.js';
import { FRIDGE_ITEMS } from './data.js';

const h = React.createElement;

const categories = ['蔬菜', '水果', '肉类'];

const FridgeScreen = () =>
  h(
    Page,
    { current: 'fridge' },
    h(PageHeader, {
      title: '冰箱',
      rightSlot: h(
        'button',
        { className: 'flex items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-white gap-2 min-w-0 p-0' },
        h(Plus, { size: 24 })
      )
    }),
    h(
      'div',
      { className: 'flex-1 pb-20' },
      categories.map((cat) => {
        const items = FRIDGE_ITEMS.filter((item) => item.category === cat);
        if (items.length === 0) return null;

        return h(
          'div',
          { key: cat },
          h(
            'div',
            { className: 'px-4 pt-4 pb-2' },
            h('p', { className: 'text-lg font-bold text-white leading-tight tracking-[-0.015em]' }, cat)
          ),
          items.map((item) =>
            h(
              'div',
              {
                key: item.id,
                className: 'flex items-center gap-4 bg-app-bg px-4 min-h-[72px] py-2 border-b border-app-card last:border-0'
              },
              h('div', {
                className: 'bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14 bg-gray-700',
                style: { backgroundImage: `url("${item.image}")` }
              }),
              h(
                'div',
                { className: 'flex flex-col justify-center flex-grow' },
                h('p', { className: 'text-white text-base font-medium leading-normal line-clamp-1' }, item.name),
                h('p', { className: 'text-app-textSub text-sm font-normal leading-normal line-clamp-2' }, item.quantity)
              )
            )
          )
        );
      }),
      h('div', { className: 'pb-4' })
    )
  );

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(h(React.StrictMode, null, h(FridgeScreen)));
}
