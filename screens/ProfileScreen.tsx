import React from 'react';
import { Settings } from 'lucide-react';
import { RECIPES } from '../data';

const ProfileScreen: React.FC = () => {
  const favorites = [RECIPES[0], RECIPES[5]]; // Just pick 2 for demo

  return (
    <div className="flex-1 flex flex-col bg-app-bg">
      {/* Top App Bar */}
      <header className="flex items-center bg-app-bg p-4 pb-2 justify-between sticky top-0 z-10">
        <div className="flex size-12 shrink-0 items-center"></div>
        <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            我的
        </h1>
        <div className="flex w-12 items-center justify-end">
          <button className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-transparent text-white">
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* Profile Header */}
      <div className="flex p-4">
        <div className="flex w-full flex-row gap-4 items-center">
            <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 bg-gray-700" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2o13CQYCHpQLOY39llo3oPcs7zoFocCCOkvpwGaLC-aWuziOxGqWAIrR_BuK9vu_LT0Y5pv_J9zJMucXRLy_leRyEL2yaEXyiA8cmNclHXCgnnqqxIL2Ppza-YqAdIbriBXK4aJk6-guQx6TzqLz-kWbdzpFR9UGRlcY6-zbfsdXkRqiIO0A0xLTRTSVd9QInI3toCB74NtvLxAA2UQFkFhnJxwA7t2yzFs32Md7phKWyHfBlw50gYwPHHRzbKnad81zThVjTIRY")' }}
            ></div>
            <div className="flex flex-col justify-center">
                <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">美食家小王</p>
                <p className="text-zinc-400 text-base font-normal leading-normal">查看并编辑个人资料</p>
            </div>
        </div>
      </div>

      {/* Section Header */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        我的收藏
      </h2>

      {/* Card List */}
      <div className="flex flex-col gap-4 px-4 pb-20">
        {favorites.map((recipe) => (
             <div key={recipe.id} className="flex items-stretch justify-between gap-4 rounded-xl bg-app-card p-4 shadow-sm">
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                    <p className="text-white text-base font-bold leading-tight">{recipe.title}</p>
                    <p className="text-zinc-400 text-sm font-normal leading-normal">15分钟快手菜</p>
                </div>
                <div 
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1 bg-gray-700" 
                    style={{ backgroundImage: `url("${recipe.image}")` }}
                ></div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileScreen;