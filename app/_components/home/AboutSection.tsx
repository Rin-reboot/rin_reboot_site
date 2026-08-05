import { technologies } from "@/app/_data/home";

export function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-copy">
        <p className="section-kicker">ABOUT / APPROACH</p>
        <h2 id="about-title">Build, learn, repeat.</h2>
        <p>
          {
            "本職はフロントエンドエンジニアです。React / Next.js と TypeScript を中心に、理解しやすく、保守しやすい Web 体験をつくっています。"
          }
        </p>
        <p>
          {
            "仕事の外では Go、Rust、Docker、Terraform、AWS などにも手を伸ばし、アプリケーションの外側まで含めて仕組みを組み立てます。気の赴くままに開発することがモットーです。"
          }
        </p>
      </div>
      <div className="tech-panel">
        <div className="panel-heading">
          <p>TECHNOLOGY PLAYGROUND</p>
          <span>09 TOOLS</span>
        </div>
        <ul>
          {technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </div>
      <aside className="hobby-note">
        <span>OFF SCREEN / 01</span>
        <p>
          {
            "コードを書いていない時間は、ゲームの世界へ。遊ぶ側の体験からも、心地よい操作や表現のヒントを探しています。"
          }
        </p>
      </aside>
    </section>
  );
}
