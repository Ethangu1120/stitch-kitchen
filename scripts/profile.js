import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Settings, UserCircle, Upload } from 'lucide-react';
import { Page, PageHeader } from './components.js';
import { RECIPES } from './data.js';

const h = React.createElement;

const API_BASE = 'http://localhost:8001/api';

const getAuthHeaders = (token) => ({ Authorization: `Bearer ${token}` });
// Add backend origin and avatar URL resolver so images load from port 8001 instead of 8000
const BACKEND_ORIGIN = API_BASE.replace(/\/api$/, '');
const resolveAvatarUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return `${BACKEND_ORIGIN}${url}`;
};

const AuthSection = ({ onLoggedIn }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const submit = async () => {
    const username = usernameRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();
    setError('');
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    setLoading(true);
    try {
      const url = `${API_BASE}/auth/${mode}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || '请求失败');
      if (mode === 'login') {
        localStorage.setItem('token', data.token);
        onLoggedIn({ username: data.user.username, avatar_url: resolveAvatarUrl(data.user.avatar_url) });
      } else {
        setMode('login');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return h(
    'div',
    { className: 'flex flex-col gap-3 p-4 rounded-xl bg-app-card' },
    h(
      'div',
      { className: 'flex items-center justify-between' },
      h('h3', { className: 'text-white text-lg font-bold leading-tight' }, mode === 'login' ? '登录' : '注册'),
      h(
        'button',
        { className: 'text-app-accent underline', onClick: () => setMode(mode === 'login' ? 'register' : 'login') },
        mode === 'login' ? '去注册' : '去登录'
      )
    ),
    h('input', { ref: usernameRef, className: 'rounded-lg bg-app-bg px-3 py-2 text-white', placeholder: '用户名' }),
    h('input', { ref: passwordRef, type: 'password', className: 'rounded-lg bg-app-bg px-3 py-2 text-white', placeholder: '密码' }),
    error ? h('p', { className: 'text-red-400 text-sm' }, error) : null,
    h(
      'button',
      { onClick: submit, disabled: loading, className: 'flex items-center justify-center rounded-lg h-10 bg-app-accent text-black font-semibold' },
      loading ? '处理中...' : '提交'
    )
  );
};

const ProfileContent = ({ user, onLogout, avatarPreview }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem('favorites') || '[]');
      const favs = RECIPES.filter((r) => ids.includes(r.id));
      setFavorites(favs);
    } catch {
      setFavorites([]);
    }
  }, []);

  return h(
    'div',
    { className: 'flex flex-col gap-4' },

    // MY TAB
    h(
          React.Fragment,
          null,
          h(
            'div',
            { className: 'flex items-center gap-4 rounded-xl bg-app-card p-4' },
            avatarPreview
              ? h('img', { src: avatarPreview, alt: 'avatar', className: 'h-20 w-20 rounded-full object-cover bg-gray-700' })
              : h(UserCircle, { size: 80, className: 'text-app-textSub' }),
            h('div', { className: 'flex-1' }, h('p', { className: 'text-white text-[22px] font-bold leading-tight' }, user.username))
          ),

          h(
            'div',
            { className: 'flex flex-col gap-2 rounded-xl bg-app-card p-4' },
            h('h3', { className: 'text-white text-lg font-bold leading-tight' }, '收藏的菜'),
            favorites.length === 0
              ? h('p', { className: 'text-app-textSub text-sm' }, '暂无收藏，去菜谱页面看看吧。')
              : h(
                  'div',
                  { className: 'space-y-2' },
                  favorites.map((f) =>
                    h(
                      'a',
                      {
                        key: f.id,
                        href: `./recipe.html?id=${f.id}`,
                        className: 'flex items-start justify-between gap-4 cursor-pointer text-left w-full'
                      },
                      h(
                        'div',
                        { className: 'flex flex-col gap-1 flex-1' },
                        h('p', { className: 'text-white text-base font-medium leading-tight' }, f.title),
                        h('p', { className: 'text-app-textSub text-sm font-normal leading-normal truncate' }, f.tags.join(', '))
                      ),
                      h('div', {
                        className: 'w-20 h-20 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 bg-gray-700',
                        style: { backgroundImage: `url("${f.image}")` }
                      })
                    )
                  )
                )
          ),

          h(
            'div',
            { className: 'flex justify-end px-4' },
            h(
              'button',
              { onClick: onLogout, className: 'text-app-textSub underline' },
              '退出登录'
            )
          )
        )
  );
};

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileRef = useRef(null);
  const oldPwdRef = useRef(null);
  const newPwdRef = useRef(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_BASE}/users/me`, { headers: getAuthHeaders(token) })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setUser({ username: data.username, avatar_url: resolveAvatarUrl(data.avatar_url) });
          setAvatarPreview(resolveAvatarUrl(data.avatar_url) || '');
        }
      })
      .catch(() => {});
  }, [user]); // Add user to dependency array

  const uploadAvatar = async () => {
    const file = fileRef.current?.files?.[0];
    setMsg('');
    if (!file) {
      setMsg('请选择图片文件');
      return;
    }
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('avatar', file);
    try {
      const res = await fetch(`${API_BASE}/users/avatar`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || '上传失败');
      setAvatarPreview(resolveAvatarUrl(data.avatar_url));
      setMsg('头像已更新');
    } catch (e) {
      setMsg(e.message);
    }
  };

  const changePassword = async () => {
    const old_password = oldPwdRef.current?.value || '';
    const new_password = newPwdRef.current?.value || '';
    setMsg('');
    if (!old_password || !new_password) {
      setMsg('请输入旧密码和新密码');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/users/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders(token) },
        body: JSON.stringify({ old_password, new_password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || '修改失败');
      setMsg('密码已修改');
      oldPwdRef.current.value = '';
      newPwdRef.current.value = '';
    } catch (e) {
      setMsg(e.message);
    }
  };

  return h(
    Page,
    { current: 'profile' },
    h(PageHeader, {
      title: '我的',
      rightSlot: h(
        'div',
        { className: 'relative' },
        h(
          'button',
          { onClick: () => setShowSettingsDropdown(!showSettingsDropdown), className: 'flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-transparent text-white' },
          h(Settings, { size: 24 })
        )
      )
    }),
    showSettingsDropdown &&
      h(
        'div',
        { className: 'absolute right-4 top-16 w-64 bg-app-card rounded-md shadow-lg z-10 p-4 flex flex-col gap-4' },
        h(
          'div',
          { className: 'flex flex-col gap-2' },
          h('label', { className: 'text-white text-lg font-bold' }, '修改头像'),
          h('input', { type: 'file', ref: fileRef, className: 'text-app-textSub text-sm', accept: 'image/*' }),
          h(
            'button',
            { onClick: uploadAvatar, className: 'bg-app-blue text-white py-2 px-4 rounded-md' },
            '上传头像'
          )
        ),
        h(
          'div',
          { className: 'flex flex-col gap-2' },
          h('label', { className: 'text-white text-lg font-bold' }, '修改密码'),
          h('input', { type: 'password', ref: oldPwdRef, className: 'p-2 rounded-md bg-app-bg text-white', placeholder: '旧密码' }),
          h('input', { type: 'password', ref: newPwdRef, className: 'p-2 rounded-md bg-app-bg text-white', placeholder: '新密码' }),
          h(
            'button',
            { onClick: changePassword, className: 'bg-app-blue text-white py-2 px-4 rounded-md' },
            '修改密码'
          )
        ),
        msg && h('p', { className: 'text-app-red text-sm' }, msg)
      ),
    h('div', { className: 'p-4' }, user ? h(ProfileContent, { user, onLogout: () => { localStorage.removeItem('token'); setUser(null); }, avatarPreview }) : h(AuthSection, { onLoggedIn: setUser }))
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(h(React.StrictMode, null, h(ProfileScreen)));
}
