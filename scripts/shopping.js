import React, { useMemo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Plus, Check, ChevronDown } from 'lucide-react';
import { Page, PageHeader } from './components.js';

const h = React.createElement;

const ShoppingListScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShoppingItems = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/shopping');
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch shopping items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShoppingItems();
  }, []);

  const toggleItem = async (id) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );

    try {
      const response = await fetch(`http://localhost:8001/api/shopping/toggle/${id}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to toggle item');
      }
    } catch (err) {
      console.error('Failed to toggle item:', err);
      // Revert if failed
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
      );
    }
  };

  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [items]);

  return h(
    Page,
    { current: 'shopping' },
    h(PageHeader, {
      title: '购物单',
      rightSlot: h(
        'button',
        { className: 'flex items-center justify-center rounded-lg h-12 bg-transparent text-white p-0' },
        h(Plus, { size: 24 })
      )
    }),
    loading
      ? h(
          'div',
          { className: 'flex flex-col items-center justify-center flex-1 gap-4 text-center px-6' },
          h('div', { className: 'w-8 h-8 border-4 border-app-accent border-t-transparent rounded-full animate-spin' }),
          h('p', { className: 'text-white text-lg font-semibold' }, '正在加载...')
        )
      : h(
          'div',
          { className: 'px-4 space-y-4 pb-20' },
      Object.entries(groupedItems).map(([category, catItems]) =>
        h(
          'div',
          { key: category },
          h(
            'h3',
            { className: 'text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4' },
            category
          ),
          h(
            'div',
            { className: 'space-y-2' },
            catItems.map((item) =>
              h(
                'div',
                {
                  key: item.id,
                  className: 'flex items-center gap-4 bg-[#1A2C21] px-4 min-h-14 justify-between rounded-lg'
                },
                h(
                  'p',
                  {
                    className: `text-base font-normal leading-normal flex-1 truncate transition-colors ${
                      item.checked ? 'text-gray-500 line-through' : 'text-white'
                    }`
                  },
                  item.name
                ),
                h(
                  'div',
                  { className: 'shrink-0' },
                  h(
                    'div',
                    { className: 'flex size-7 items-center justify-center relative' },
                    h('input', {
                      type: 'checkbox',
                      checked: item.checked,
                      onChange: () => toggleItem(item.id),
                      className:
                        'peer h-5 w-5 appearance-none rounded border-2 border-[#326744] bg-transparent checked:border-app-accent checked:bg-app-accent focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer'
                    }),
                    h(Check, {
                      className:
                        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#112217] opacity-0 peer-checked:opacity-100 pointer-events-none',
                      strokeWidth: 4
                    })
                  )
                )
              )
            )
          )
        )
      ),
      h(
        'div',
        { className: 'pt-2' },
        h(
          'button',
          {
            className:
              'flex items-center justify-center w-full gap-2 text-[#647C6C] font-semibold text-sm py-3 rounded-lg hover:bg-[#1A2C21] transition-colors'
          },
          h('span', null, '查看更多'),
          h(ChevronDown, { size: 16 })
        )
      )
    )
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(h(React.StrictMode, null, h(ShoppingListScreen)));
}
