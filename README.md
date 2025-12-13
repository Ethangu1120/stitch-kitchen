<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1qFJomGnm5tAF97Am6yjtzPxpcwLIxxk4

## Run Locally

**Prerequisites:**  Node.js

项目现在是一个使用 CDN 引入 React 的静态多页面站点（无需打包）。所有页面已整理到 `pages/` 目录。可直接打开 `pages/index.html`、`pages/fridge.html`、`pages/shopping.html`、`pages/profile.html` 或 `pages/recipe.html?id=1` 进行开发预览，或使用任意静态服务器在项目根目录启动。

在项目根目录运行以下命令之一：

- 使用 Node.js（推荐）
  ```powershell
  npx serve .
  ```
  启动后在浏览器访问 `http://localhost:<PORT>/`，根级别的重定向页会自动跳转到 `/pages/index.html`；也可直接访问 `http://localhost:<PORT>/pages/index.html`。

Legacy Node/Vite files have been removed. If you still see an old `node_modules` directory from the previous setup, you can delete it from Finder or with `rm -rf node_modules` (may require admin rights).
