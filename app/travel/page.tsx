import Link from "next/link";

const guides = [
  {
    title: "香港澳门 5 日旅行攻略",
    href: "/travel/hong-kong",
    meta: "2026.04.28 - 05.02",
    summary: "杭州往返，澳门住瑞吉，香港住千禧新世界。路线以 citywalk、公共交通、顺路吃饭和拍照为核心。"
  }
];

export default function TravelPage() {
  return (
    <main className="site-shell travel-shell" id="main">
      <nav className="top-nav" aria-label="旅游导航">
        <Link className="brand-link" href="/">
          首页
        </Link>
        <div className="nav-links">
          <Link href="/travel/hong-kong">港澳攻略</Link>
        </div>
      </nav>

      <section className="travel-overview-hero" aria-labelledby="travel-title">
        <div>
          <p className="eyebrow">Travel</p>
          <h1 id="travel-title">旅行攻略</h1>
          <p>
            这里用来收纳出行前的判断、路线、餐饮和预约事项。每一次出发，都尽量少折返、少搬运行李，把时间留给街区和照片。
          </p>
        </div>
        <div className="overview-photo" aria-hidden="true" />
      </section>

      <section className="guide-list" aria-label="攻略列表">
        {guides.map((guide) => (
          <Link className="guide-card guide-card-featured" href={guide.href} key={guide.href}>
            <span>{guide.meta}</span>
            <h2>{guide.title}</h2>
            <p>{guide.summary}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
