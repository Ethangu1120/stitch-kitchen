import React from 'react';
import { FRIDGE_ITEMS } from '../data';
import { Plus } from 'lucide-react';

const FridgeScreen: React.FC = () => {
  const categories = ['蔬菜', '水果', '肉类'];

  return (
    <div className="flex-1 flex flex-col bg-app-bg">
      {/* Header */}
      <div className="flex items-center bg-app-bg p-4 pb-2 justify-between sticky top-0 z-10">
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
          冰箱
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-white gap-2 min-w-0 p-0">
             <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {categories.map((cat) => {
          const items = FRIDGE_ITEMS.filter((item) => item.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat}>
              <div className="px-4 pt-4 pb-2">
                <p className="text-lg font-bold text-white leading-tight tracking-[-0.015em]">{cat}</p>
              </div>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-app-bg px-4 min-h-[72px] py-2 border-b border-app-card last:border-0">
                   <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14 bg-gray-700"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  ></div>
                  <div className="flex flex-col justify-center flex-grow">
                    <p className="text-white text-base font-medium leading-normal line-clamp-1">{item.name}</p>
                    <p className="text-app-textSub text-sm font-normal leading-normal line-clamp-2">{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        <div className="pb-4"></div>
      </div>
    </div>
  );
};

export default FridgeScreen;