# frame-nest

Next.js（App Router）+ Cloudflare Workers 的全栈模板，已完成 CF 适配。

## 开发

```bash
npm install
npm run dev
```

## 构建（OpenNext Cloudflare）

```bash
npm run build
```

## 本地预览 Worker

```bash
npm run preview
```

## 部署到 Cloudflare

```bash
npm run deploy
```

## 路由

- `/`：Next.js 页面
- `/api/hello`：Edge API Route

## 关键点

- 使用 `@opennextjs/cloudflare` 生成 `.open-next/worker.js`
- `wrangler.jsonc` 直接发布 OpenNext 产物（Worker + assets）
- 适合优先利用 Cloudflare 免费能力
