import Link from "next/link";

const sections = ["行程节奏", "交通方式", "住宿区域", "美食清单", "预算记录", "注意事项"];

export default function HongKongGuidePage() {
  return (
    <main className="site-shell detail-shell" id="main">
      <nav className="top-nav" aria-label="香港攻略导航">
        <Link className="brand-link" href="/">
          Frame Nest
        </Link>
        <div className="nav-links">
          <Link href="/">首页</Link>
          <Link href="/travel">攻略总览</Link>
        </div>
      </nav>

      <section className="page-heading destination-heading" aria-labelledby="hong-kong-title">
        <p className="eyebrow">Hong Kong Guide</p>
        <h1 id="hong-kong-title">香港旅游攻略</h1>
        <p>
          先搭好攻略骨架。等你补充资料后，这里可以继续扩展成完整的香港旅行页面。
        </p>
      </section>

      <section className="section-map" aria-label="攻略结构">
        {sections.map((section, index) => (
          <article className="section-tile" key={section}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{section}</h2>
            <p>待补充</p>
          </article>
        ))}
      </section>
    </main>
  );
}
