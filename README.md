# frame-nest

Cloudflare Workers `Hello World` 初始化项目。

## 快速开始

```bash
npm install
npm run dev
```

部署：

```bash
npm run deploy
```

## 路由

- `/`：返回一个简单的 HTML 页面
- `/api/hello`：返回 JSON API

## 关于「要不要直接上 Next.js」

建议分两阶段：

1. **现在先用 Worker 跑通**（你当前这个仓库）
   - 免费额度利用率最高、部署和调试最简单。
   - 先把鉴权、数据读写、缓存策略、日志链路跑通。
2. **业务复杂后再上 Next.js（App Router）**
   - 在 Cloudflare 上建议采用 `@opennextjs/cloudflare` 方案部署。
   - Next.js 适合需要 SSR/RSC、复杂页面路由和中后台 UI 的阶段。

也就是说：**不是不能直接上 Next.js，而是建议先用 Worker 起盘更稳、更省免费额度。**
