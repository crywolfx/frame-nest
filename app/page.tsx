import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell home-shell" id="main">
      <nav className="top-nav" aria-label="主导航">
        <Link className="brand-link" href="/" aria-label="返回首页">
          Frame Nest
        </Link>
        <div className="nav-links">
          <Link href="/travel">旅游攻略</Link>
          <Link href="/api/hello">API</Link>
        </div>
      </nav>

      <section className="hero-section" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Personal Knowledge Hub</p>
          <h1 id="home-title">把不同主题的内容整理成清晰的网站入口。</h1>
          <p className="hero-text">
            首页只负责承载全局导航和模块总览。旅游攻略是其中一个独立频道，后续也可以继续加入作品、工具、笔记或其他页面。
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/travel">
              进入旅游频道
            </Link>
            <Link className="secondary-action" href="/api/hello">查看 API</Link>
          </div>
        </div>

        <div className="hub-visual" aria-hidden="true">
          <div className="hub-card card-travel">
            <span>Travel</span>
            <strong>01</strong>
          </div>
          <div className="hub-card card-api">
            <span>API</span>
            <strong>Edge</strong>
          </div>
          <div className="hub-line" />
        </div>
      </section>

      <section className="feature-grid" aria-label="站点能力">
        <Link className="feature-panel" href="/travel">
          <span className="panel-index">01</span>
          <h2>旅游攻略</h2>
          <p>旅游频道拥有自己的总览和目的地导航，香港攻略会放在这里继续扩展。</p>
        </Link>
        <Link className="feature-panel" href="/api/hello">
          <span className="panel-index">02</span>
          <h2>边缘接口</h2>
          <p>保留 Cloudflare 运行时接口能力，方便后续接数据。</p>
        </Link>
        <article className="feature-panel feature-panel-muted">
          <span className="panel-index">03</span>
          <h2>更多模块</h2>
          <p>首页会继续作为通用入口，后续非旅游页面可以并列加入。</p>
        </article>
      </section>
    </main>
  );
}
