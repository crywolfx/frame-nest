import { useEffect, useState } from "react";

type ApiResult = {
  message: string;
  platform: string;
  timestamp: string;
};

export function App() {
  const [data, setData] = useState<ApiResult | null>(null);

  useEffect(() => {
    void fetch("/api/hello")
      .then((res) => res.json() as Promise<ApiResult>)
      .then(setData);
  }, []);

  return (
    <main className="container">
      <h1>👋 Hello React on Cloudflare</h1>
      <p>这是一个 React + Cloudflare Workers + Assets 的全栈起步模板。</p>
      <pre>{data ? JSON.stringify(data, null, 2) : "Loading /api/hello ..."}</pre>
    </main>
  );
}
