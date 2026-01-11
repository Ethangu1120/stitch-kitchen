import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Plus, UserCircle } from 'lucide-react';
import { Page, PageHeader } from './components.js';

const h = React.createElement;

const FridgeScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const fetchIngredients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8001/api/ingredients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch ingredients');
      }

      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/api/fridge/identify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          alert('登录已过期，请重新登录');
          window.location.href = './profile.html';
          return;
        }
        alert(data.detail || '识别失败');
        return;
      }

      alert('识别并更新成功！');
      fetchIngredients(); // 刷新列表
    } catch (err) {
      alert('上传过程中发生错误: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const categories = ['肉类', '蔬菜', '海鲜/河鲜', '水果', '配菜'];

  // 未登录状态显示
  if (!isLoggedIn) {
    return h(
      Page,
      { current: 'fridge' },
      h(PageHeader, { title: '冰箱' }),
      h(
        'div',
        { className: 'flex flex-col items-center justify-center flex-1 p-8 text-center gap-4' },
        h(UserCircle, { size: 64, className: 'text-app-textSub' }),
        h('h3', { className: 'text-white text-xl font-bold' }, '请先登录'),
        h('p', { className: 'text-app-textSub' }, '登录后即可查看和管理您的冰箱食材'),
        h(
          'a',
          {
            href: './profile.html',
            className: 'mt-4 px-8 py-3 bg-app-accent text-black font-bold rounded-lg transition-transform active:scale-95'
          },
          '去登录'
        )
      )
    );
  }

  return h(
    Page,
    { current: 'fridge' },
    h(PageHeader, {
      title: '冰箱',
      rightSlot: h(
        'div',
        null,
        h('input', {
          type: 'file',
          accept: 'image/*',
          className: 'hidden',
          ref: fileInputRef,
          onChange: handleFileChange
        }),
        h(
          'button',
          { 
            onClick: handleUploadClick,
            disabled: uploading,
            className: `flex items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-white gap-2 min-w-0 p-0 ${uploading ? 'opacity-50' : ''}` 
          },
          uploading ? h('div', { className: 'animate-spin size-5 border-2 border-white border-t-transparent rounded-full' }) : h(Plus, { size: 24 })
        )
      )
    }),
    h(
      'div',
      { className: 'flex-1 pb-20' },
      loading ? h('div', { className: 'p-4 text-app-textSub flex items-center gap-2' }, 
        h('div', { className: 'animate-spin size-4 border-2 border-app-accent border-t-transparent rounded-full' }),
        '加载中...'
      ) :
      error ? h('div', { className: 'p-4 text-red-500 bg-red-500/10 m-4 rounded-lg' }, `错误: ${error}`) :
      categories.map((cat) => {
        const catItems = items.filter((item) => item.category === cat);
        if (catItems.length === 0) return null;

        return h(
          'div',
          { key: cat },
          h(
            'div',
            { className: 'px-4 pt-4 pb-2' },
            h('p', { className: 'text-lg font-bold text-white leading-tight tracking-[-0.015em]' }, cat)
          ),
          catItems.map((item, idx) =>
            h(
              'div',
              {
                key: `${item.name}-${idx}`,
                className: 'flex items-center gap-4 bg-app-bg px-4 min-h-[56px] py-3 border-b border-app-card last:border-0'
              },
              h(
                'div',
                { className: 'flex flex-col justify-center flex-grow' },
                h('p', { className: 'text-white text-base font-medium leading-normal line-clamp-1' }, item.name)
              ),
              h(
                'div',
                { className: 'shrink-0' },
                h('p', { className: 'text-app-textSub text-sm font-normal leading-normal' }, `${item.amount}g`)
              )
            )
          )
        );
      }),
      !loading && !error && items.length === 0 && h('div', { className: 'p-8 text-center text-app-textSub' }, '冰箱里空空如也'),
      h('div', { className: 'pb-4' })
    )
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(h(React.StrictMode, null, h(FridgeScreen)));
}
