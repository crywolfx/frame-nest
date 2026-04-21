import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell home-shell" id="main">
      <nav className="top-nav" aria-label="主导航">
        <Link className="brand-link" href="/" aria-label="返回首页">
          首页
        </Link>
        <div className="nav-links">
          <a href="#content">内容</a>
        </div>
      </nav>

      <section className="hero-section" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Home</p>
          <h1 id="home-title">把重要的事整理好。</h1>
          <p className="hero-text">
            记录、计划、资料和回忆，都可以在这里慢慢归位。
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#content">
              开始查看
            </a>
          </div>
        </div>

        <div className="hub-visual" aria-hidden="true">
          <div className="hub-card card-memory">
            <span>记录</span>
            <strong>01</strong>
          </div>
          <div className="hub-card card-plan">
            <span>计划</span>
            <strong>02</strong>
          </div>
          <div className="hub-line" />
        </div>
      </section>

      <section className="feature-grid" aria-label="首页模块">
        <article className="feature-panel">
          <span className="panel-index">01</span>
          <h2>记录</h2>
          <p>留下值得回看的片段。</p>
        </article>
        <article className="feature-panel">
          <span className="panel-index">02</span>
          <h2>计划</h2>
          <p>整理正在发生和即将开始的事。</p>
        </article>
        <article className="feature-panel">
          <span className="panel-index">03</span>
          <h2>资料</h2>
          <p>把分散的信息收进清晰的位置。</p>
        </article>
        <article className="feature-panel">
          <span className="panel-index">04</span>
          <h2>回忆</h2>
          <p>让经历过的事有迹可循。</p>
        </article>
      </section>

      <section className="recent-section" id="content" aria-labelledby="recent-title">
        <div>
          <p className="eyebrow">Content</p>
          <h2 id="recent-title">近期内容</h2>
        </div>
        <Link className="recent-link" href="/travel">
          <span>攻略</span>
          <strong>香港攻略</strong>
          <p>先放好资料结构，后续继续补充。</p>
        </Link>
      </section>
    </main>
  );
}
