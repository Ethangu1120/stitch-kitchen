import React, { useState } from 'react';
import { SHOPPING_ITEMS } from '../data';
import { ShoppingItem } from '../types';
import { Plus, Check, ChevronDown } from 'lucide-react';

const ShoppingListScreen: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>(SHOPPING_ITEMS);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="flex-1 flex flex-col bg-app-bg">
      {/* Header */}
      <div className="flex items-center bg-app-bg p-4 pb-2 justify-between sticky top-0 z-10">
        <div className="w-12"></div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          购物单
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex items-center justify-center rounded-lg h-12 bg-transparent text-white p-0">
             <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4 pb-20">
        {Object.entries(groupedItems).map(([category, catItems]) => (
          <div key={category}>
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">
              {category}
            </h3>
            <div className="space-y-2">
              {catItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-[#1A2C21] px-4 min-h-14 justify-between rounded-lg">
                  <p className={`text-base font-normal leading-normal flex-1 truncate transition-colors ${item.checked ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {item.name}
                  </p>
                  <div className="shrink-0">
                    <div className="flex size-7 items-center justify-center relative">
                      <input 
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                        className="peer h-5 w-5 appearance-none rounded border-2 border-[#326744] bg-transparent checked:border-app-accent checked:bg-app-accent focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
                      />
                      <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#112217] opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={4} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-2">
          <button className="flex items-center justify-center w-full gap-2 text-[#647C6C] font-semibold text-sm py-3 rounded-lg hover:bg-[#1A2C21] transition-colors">
            <span>查看更多</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListScreen;