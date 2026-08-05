"use client";

import Image from "next/image";
import { useState } from "react";
import { CareerDialog } from "./CareerDialog";

export function HeroSection() {
  const [isCareerOpen, setIsCareerOpen] = useState(false);

  function handleCareerOpen() {
    setIsCareerOpen(true);
  }

  function handleCareerClose() {
    setIsCareerOpen(false);
  }

  return (
    <>
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
            {
              "使う人の手に自然になじむインターフェースを考え、実装しています。 フロントエンドを軸に、気になった技術を自分の手で確かめることが好きです。"
            }
          </p>
          <nav className="hero-actions" aria-label="プロフィールと経歴">
            <a className="button" href="/blog/">
              Blog <span aria-hidden="true">→</span>
            </a>
            <button
              className="button career-button"
              type="button"
              onClick={handleCareerOpen}
            >
              Career <span aria-hidden="true">＋</span>
            </button>
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
            <a
              className="button"
              href="https://qiita.com/rin_reboot"
              target="_blank"
              rel="noreferrer"
            >
              Qiita <span aria-hidden="true">↗</span>
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

      <CareerDialog isOpen={isCareerOpen} onClose={handleCareerClose} />
    </>
  );
}
