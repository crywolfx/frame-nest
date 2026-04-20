export const runtime = "edge";

export async function GET() {
  return Response.json({
    message: "Hello World",
    platform: "nextjs + cloudflare",
    timestamp: new Date().toISOString()
  });
}
