interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/hello") {
      return Response.json({
        message: "Hello World",
        platform: "cloudflare-workers + react",
        timestamp: new Date().toISOString()
      });
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
