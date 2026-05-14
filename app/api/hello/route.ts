import { formatBeijingDateTimeLabel } from "../../cosmic-moment/lib/time";

export async function GET() {
  return Response.json({
    message: "Hello World",
    platform: "nextjs + cloudflare",
    timestamp: formatBeijingDateTimeLabel(new Date())
  });
}
