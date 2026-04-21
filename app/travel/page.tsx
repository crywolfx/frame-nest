import Link from "next/link";

const guides = [
  {
    title: "香港旅游攻略",
    href: "/travel/hong-kong",
    status: "资料待补充",
    summary: "用于承载香港行程、交通、美食、住宿和注意事项。"
  }
];

export default function TravelPage() {
  return (
    <main className="site-shell travel-shell" id="main">
      <nav className="top-nav" aria-label="旅游导航">
        <Link className="brand-link" href="/">
          Frame Nest
        </Link>
        <div className="nav-links">
          <Link href="/">首页</Link>
          <Link href="/travel/hong-kong">香港攻略</Link>
        </div>
      </nav>

      <section className="page-heading" aria-labelledby="travel-title">
        <p className="eyebrow">Travel Guides</p>
        <h1 id="travel-title">旅游攻略总览</h1>
        <p>
          这里会作为全部旅行攻略的索引页。每个目的地都可以独立沉淀路线、清单、预算和补充资料。
        </p>
      </section>

      <section className="guide-list" aria-label="攻略列表">
        {guides.map((guide) => (
          <Link className="guide-card" href={guide.href} key={guide.href}>
            <span>{guide.status}</span>
            <h2>{guide.title}</h2>
            <p>{guide.summary}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
