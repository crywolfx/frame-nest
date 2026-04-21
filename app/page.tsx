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
          <Link href="/travel/hong-kong">香港攻略</Link>
          <Link href="/api/hello">API</Link>
        </div>
      </nav>

      <section className="hero-section" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Cloudflare Native Travel Notebook</p>
          <h1 id="home-title">把旅行灵感整理成可以持续生长的网站。</h1>
          <p className="hero-text">
            首页、攻略总览和目的地详情已经打通。后续补资料时，可以直接把城市攻略扩展成可导航、可维护、可部署的内容体系。
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/travel">
              浏览攻略
            </Link>
            <Link className="secondary-action" href="/travel/hong-kong">
              查看香港
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="travel-card card-peak">
            <span>Victoria Peak</span>
            <strong>18:40</strong>
          </div>
          <div className="travel-card card-harbor">
            <span>Star Ferry</span>
            <strong>07 Stops</strong>
          </div>
          <div className="route-line" />
        </div>
      </section>

      <section className="feature-grid" aria-label="站点能力">
        <Link className="feature-panel" href="/travel">
          <span className="panel-index">01</span>
          <h2>攻略总览</h2>
          <p>集中管理旅行页面，后续新增城市时保持统一入口。</p>
        </Link>
        <Link className="feature-panel" href="/travel/hong-kong">
          <span className="panel-index">02</span>
          <h2>城市详情</h2>
          <p>先放好香港攻略结构，等资料补齐后直接填充。</p>
        </Link>
        <Link className="feature-panel" href="/api/hello">
          <span className="panel-index">03</span>
          <h2>边缘接口</h2>
          <p>保留 Cloudflare 运行时接口能力，方便后续接数据。</p>
        </Link>
      </section>
    </main>
  );
}
