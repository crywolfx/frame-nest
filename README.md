# frame-nest

Next.js（App Router）+ Cloudflare Workers 的全栈模板，已完成 CF 适配。

## 开发

```bash
npm install
npm run dev
```

## Next.js 构建

```bash
npm run build
```

## Cloudflare 构建（OpenNext）

```bash
npm run build:cf
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

- `npm run build` 只执行 `next build`
- `npm run build:cf` 执行 `opennextjs-cloudflare build`
- 避免 `opennextjs-cloudflare build` 递归调用自身导致构建卡住
