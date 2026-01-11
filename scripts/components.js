import React from 'react';
import { Thermometer, Utensils, List, User } from 'lucide-react';

const h = React.createElement;

export const Page = ({ current, children }) =>
  h(
    'div',
    { className: 'flex flex-col min-h-screen bg-app-bg text-white font-sans' },
    h('div', { className: 'flex-grow flex flex-col' }, children),
    h(BottomNav, { current })
  );

export const PageHeader = ({ title, leftSlot, rightSlot }) =>
  h(
    'div',
    { className: 'flex items-center bg-app-bg p-4 pb-2 justify-between sticky top-0 z-20' },
    h('div', { className: 'flex size-12 shrink-0 items-center justify-start' }, leftSlot || null),
    h(
      'h2',
      { className: 'text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center' },
      title
    ),
    h('div', { className: 'flex w-12 items-center justify-end' }, rightSlot || null)
  );

export function BottomNav({ current }) {
  const links = [
    { id: 'fridge', label: '冰箱', href: './fridge.html', icon: Thermometer },
    { id: 'home', label: '菜谱', href: './index.html', icon: Utensils },
    { id: 'shopping', label: '购物单', href: './shopping.html', icon: List },
    { id: 'profile', label: '我的', href: './profile.html', icon: User }
  ];

  return h(
    'div',
    { className: 'sticky bottom-0 w-full z-50' },
    h(
      'div',
      { className: 'flex gap-2 border-t border-app-secondary bg-app-card px-4 pb-3 pt-2' },
      links.map(({ id, label, href, icon: Icon }) => {
        const isActive = current === id;
        return h(
          'a',
          {
            key: id,
            href,
            className: `flex flex-1 flex-col items-center justify-end gap-1 transition-colors ${
              isActive ? 'text-white' : 'text-app-textSub hover:text-white'
            }`
          },
          h(
            'div',
            { className: `flex h-8 items-center justify-center ${isActive ? 'bg-transparent rounded-full' : ''}` },
            h(Icon, {
              size: 24,
              fill: isActive ? 'currentColor' : 'none',
              stroke: 'currentColor',
              strokeWidth: isActive ? 2 : 2,
              className: isActive ? 'text-white' : 'text-app-textSub'
            })
          ),
          h('p', { className: 'text-xs font-medium leading-normal tracking-[0.015em]' }, label)
        );
      })
    ),
    h('div', { className: 'h-5 bg-app-card' })
  );
}
