# frame-nest

这是一个部署到 **Cloudflare Workers** 的 React 全栈起步模板：

- 前端：React + Vite
- 后端：Cloudflare Worker API (`/api/hello`)
- 静态资源：Workers Assets（`dist`）

## 本地开发

```bash
npm install
npm run dev
```

## 生产部署（Cloudflare 免费能力优先）

```bash
npm run deploy
```

上面的脚本会先 `vite build`，再由 `wrangler deploy` 部署 Worker + 静态资源。

## 路由

- `/`：React 页面
- `/api/hello`：Worker JSON API

## 关于是否直接上 Next.js

你这个诉求是“全栈 + Cloudflare 免费能力优先”，我建议：

1. 先用当前 React + Worker 模板把业务跑通（更轻、更省配额）
2. 当你确实需要 SSR / RSC / 复杂路由时，再迁移到 Next.js + `@opennextjs/cloudflare`

这样不会过早引入框架复杂度，但保留了后续演进空间。
