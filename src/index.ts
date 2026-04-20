const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>frame-nest · Hello World</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      }
      main { text-align: center; max-width: 680px; padding: 2rem; }
      code { padding: .2rem .4rem; border-radius: 6px; background: #00000022; }
    </style>
  </head>
  <body>
    <main>
      <h1>👋 Hello from Cloudflare Workers</h1>
      <p>这是一个零成本友好的起步模板（Worker + API）。</p>
      <p><code>GET /api/hello</code> 可以看到 JSON 接口。</p>
    </main>
  </body>
</html>`;

export default {
  async fetch(request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/hello") {
      return Response.json({
        message: "Hello World",
        platform: "cloudflare-workers",
        timestamp: new Date().toISOString()
      });
    }

    if (url.pathname === "/") {
      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
} satisfies ExportedHandler;
