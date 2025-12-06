<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1qFJomGnm5tAF97Am6yjtzPxpcwLIxxk4

## Run Locally

**Prerequisites:**  Node.js


The project now ships as a static multi-page site that still uses React via CDN imports (no bundler required). Open `index.html`, `fridge.html`, `shopping.html`, `profile.html`, or `recipe.html?id=1` directly in the browser, or serve the folder with any static server (for example, `npx serve .`).

Legacy Node/Vite files have been removed. If you still see an old `node_modules` directory from the previous setup, you can delete it from Finder or with `rm -rf node_modules` (may require admin rights).
