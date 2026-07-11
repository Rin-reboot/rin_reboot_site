"use client";

import Image from "next/image";
import { useState } from "react";

const projects = [
  {
    index: "01",
    type: "DESKTOP",
    title: "pure_board",
    description:
      "CPU・メモリ・ネットワークの状態と、日常で使う小さな機能を一つにまとめた Windows 11 向けデスクトップダッシュボード。",
    stack: ["Tauri", "React", "TypeScript", "Rust"],
    href: "https://github.com/Rin-reboot/pure_board",
  },
  {
    index: "02",
    type: "CLI",
    title: "log_total",
    description:
      "Apache / nginx のアクセスログを集計し、必要な情報へ素早くたどり着くための CLI ツール。",
    stack: ["Go", "CLI", "Log analysis"],
    href: "https://github.com/Rin-reboot/log_total",
  },
  {
    index: "03",
    type: "WEB APP",
    title: "chatapp",
    description:
      "Next.js の UI と AWS のマネージドサービスを組み合わせ、リアルタイムな体験を検証したチャットアプリ。",
    stack: ["Next.js", "AWS", "GraphQL"],
    href: "https://github.com/Rin-reboot/chatapp",
  },
] as const;

const technologies = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Go",
  "Rust",
  "Docker",
  "Terraform",
  "AWS",
] as const;

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ページの先頭へ">
          R<span>.</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <nav
          id="main-navigation"
          className={isMenuOpen ? "is-open" : undefined}
          aria-label="メインナビゲーション"
        >
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a
            href="https://github.com/Rin-reboot"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <aside className="floating-card avatar-card">
            <div className="avatar-frame">
              <Image
                src="/avatar.jpg"
                alt="ノートパソコンでコードを書く黒猫のピクセルアート"
                width={400}
                height={400}
                priority
              />
            </div>
            <p>@Rin-reboot</p>
          </aside>

          <div className="hero-copy">
            <p className="eyebrow">FRONTEND ENGINEER / JAPAN</p>
            <h1 id="hero-title">
              Rin<span>.</span>
              <small>Interfaces, systems, and everything between.</small>
            </h1>
            <p className="hero-lead">
              使う人の手に自然になじむインターフェースを考え、実装しています。
              フロントエンドを軸に、気になった技術を自分の手で確かめることが好きです。
            </p>
            <nav className="hero-actions" aria-label="外部プロフィール">
              <a
                className="button button-primary"
                href="https://github.com/Rin-reboot"
                target="_blank"
                rel="noreferrer"
              >
                View GitHub <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button"
                href="https://x.com/dev_rin_fl"
                target="_blank"
                rel="noreferrer"
              >
                X / @dev_rin_fl <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>

          <aside className="floating-card status-card">
            <div className="status-label">
              <span aria-hidden="true" /> NOW EXPLORING
            </div>
            <p>Web とデスクトップの境界。軽く、長く使える道具の設計。</p>
          </aside>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <p>SELECTED WORK / 03</p>
            <h2 id="work-title">Things I build.</h2>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <a
                className={`project-card${project.index === "01" ? " project-card-featured" : ""}`}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                key={project.title}
              >
                <div className="project-meta">
                  <span>{project.index} / {project.type}</span>
                  <span aria-hidden="true">↗</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ul aria-label={`${project.title} の使用技術`}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-copy">
            <p className="section-kicker">ABOUT / APPROACH</p>
            <h2 id="about-title">Build, learn, repeat.</h2>
            <p>
              本職はフロントエンドエンジニアです。React / Next.js と
              TypeScript を中心に、理解しやすく、保守しやすい Web
              体験をつくっています。
            </p>
            <p>
              仕事の外では Go、Rust、Docker、Terraform、AWS
              などにも手を伸ばし、アプリケーションの外側まで含めて仕組みを組み立てます。
              気の赴くままに開発することがモットーです。
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
              コードを書いていない時間は、ゲームの世界へ。遊ぶ側の体験からも、心地よい操作や表現のヒントを探しています。
            </p>
          </aside>
        </section>

        <section className="closing" aria-labelledby="closing-title">
          <p>LET&apos;S KEEP BUILDING</p>
          <h2 id="closing-title">作りながら、できることを増やしていく。</h2>
          <a
            href="https://x.com/dev_rin_fl"
            target="_blank"
            rel="noreferrer"
          >
            Follow the journey <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Rin</span>
        <span>FRONTEND / SYSTEMS / CURIOSITY</span>
      </footer>
    </div>
  );
}
