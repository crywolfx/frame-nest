async function getHello() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/hello`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch /api/hello");
  return (await res.json()) as { message: string; platform: string; timestamp: string };
}

export default async function HomePage() {
  const data = await getHello();

  return (
    <main className="container">
      <h1>👋 Hello Next.js on Cloudflare</h1>
      <p>已切换为 Next.js 全栈模板（App Router + API Route）。</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
