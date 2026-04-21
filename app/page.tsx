import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell home-shell" id="main">
      <nav className="top-nav" aria-label="主导航">
        <Link className="brand-link" href="/" aria-label="返回首页">
          Frame Nest
        </Link>
        <div className="nav-links">
          <Link href="/travel">旅行计划</Link>
        </div>
      </nav>

      <section className="hero-section" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Memory & Planning Home</p>
          <h1 id="home-title">把重要的记忆、计划和灵感安放在同一个地方。</h1>
          <p className="hero-text">
            Frame Nest 是一个逐步生长的私人空间。它会用清晰的结构记录去过的地方、正在准备的安排、反复出现的想法，以及未来值得认真对待的生活线索。
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/travel">
              查看旅行计划
            </Link>
          </div>
        </div>

        <div className="hub-visual" aria-hidden="true">
          <div className="hub-card card-memory">
            <span>Memory</span>
            <strong>Archive</strong>
          </div>
          <div className="hub-card card-plan">
            <span>Plan</span>
            <strong>Next</strong>
          </div>
          <div className="hub-line" />
        </div>
      </section>

      <section className="home-story" aria-labelledby="home-story-title">
        <p className="eyebrow">Why It Exists</p>
        <h2 id="home-story-title">不是一个展示页，而是一套慢慢变得有用的生活索引。</h2>
        <p>
          它会先从旅行计划开始，把一次出发前后的路线、收藏、判断和回忆整理起来。之后，每一个值得保留的主题都可以拥有自己的位置。
        </p>
      </section>

      <section className="feature-grid" aria-label="当前入口">
        <Link className="feature-panel" href="/travel">
          <span className="panel-index">01</span>
          <h2>旅行计划</h2>
          <p>从攻略总览进入目的地页面，先把香港旅行的资料结构准备好。</p>
        </Link>
        <article className="feature-panel">
          <span className="panel-index">02</span>
          <h2>记忆沉淀</h2>
          <p>未来可以把照片、地点、片段和复盘整理成可回看的时间线。</p>
        </article>
        <article className="feature-panel">
          <span className="panel-index">03</span>
          <h2>长期规划</h2>
          <p>让阶段目标、待办线索和重要决定有一个稳定的归档位置。</p>
        </article>
      </section>
    </main>
  );
}
